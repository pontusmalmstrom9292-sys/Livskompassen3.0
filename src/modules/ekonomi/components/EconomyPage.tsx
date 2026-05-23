import { useCallback, useEffect, useMemo, useState } from 'react';
import { Wallet, Loader2, PiggyBank } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { SaldoHero } from '../../core/ui/SaldoHero';
import { MetricTile } from '../../core/ui/MetricTile';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import {
  getEconomyTransactions,
  saveEconomyTransaction,
} from '../../core/firebase/firestore';
import {
  getBudgetSavings,
  getEconomyProfileExtended,
  setBudgetSaving,
  setEconomyProfileExtended,
} from '../../core/firebase/timeEconomyFirestore';
import { TimeAndPayPanel } from './TimeAndPayPanel';

type EconomyPageProps = {
  embedded?: boolean;
};

const DEFAULT_WEEKLY = 500;
const DEFAULT_MEAL = 85;

export function EconomyPage({ embedded = false }: EconomyPageProps) {
  const user = useStore((s) => s.user);
  const [transactions, setTransactions] = useState<
    { id: string; label: string; amountSek: number; category: string; createdAt: string }[]
  >([]);
  const [weeklyBudget, setWeeklyBudget] = useState(DEFAULT_WEEKLY);
  const [mealPreset, setMealPreset] = useState(DEFAULT_MEAL);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [flexTarget, setFlexTarget] = useState(40);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [defaultBreak, setDefaultBreak] = useState(30);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savings, setSavings] = useState<
    { id: string; title: string; targetSek: number; currentSek: number }[]
  >([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('1000');

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [txs, profile, goals] = await Promise.all([
        getEconomyTransactions(user.uid),
        getEconomyProfileExtended(user.uid),
        getBudgetSavings(user.uid),
      ]);
      setTransactions(txs);
      setSavings(goals);
      setWeeklyBudget(profile.weeklyBudgetSek || DEFAULT_WEEKLY);
      setMealPreset(profile.mealBoxPresetSek || DEFAULT_MEAL);
      setHourlyRate(profile.hourlyRateSek || 0);
      setFlexTarget(profile.flexHoursTarget || 40);
      setMonthlySalary(profile.monthlySalarySek || 0);
      setDefaultBreak(profile.defaultBreakMinutes ?? 30);
    } catch {
      setError('Kunde inte läsa ekonomi.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      setTransactions([]);
      setError(null);
    },
    [],
  );

  const balance = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amountSek, 0),
    [transactions],
  );

  const quickAdd = async (
    label: string,
    amountSek: number,
    category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt',
  ) => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveEconomyTransaction(user.uid, { label, amountSek, category });
      await reload();
    } catch {
      setError('Kunde inte spara transaktion.');
    } finally {
      setSaving(false);
    }
  };

  const handleWin = () => {
    void quickAdd('Vinst — du gjorde det', 0, 'vinst');
  };

  const persistProfile = async () => {
    if (!user) return;
    try {
      await setEconomyProfileExtended(user.uid, {
        weeklyBudgetSek: weeklyBudget,
        mealBoxPresetSek: mealPreset,
        hourlyRateSek: hourlyRate,
        flexHoursTarget: flexTarget,
        monthlySalarySek: monthlySalary,
        defaultBreakMinutes: defaultBreak,
      });
    } catch {
      setError('Kunde inte spara profil.');
    }
  };

  const saldoLabel = balance >= 0 ? `${balance} kr kvar` : `${Math.abs(balance)} kr under noll`;

  return (
    <div className="space-y-4">
      <SaldoHero
        label="Vad har jag kvar"
        amount={loading ? '— kr' : saldoLabel}
        hint={`Veckobudget ${weeklyBudget} kr · matlåda ${mealPreset} kr`}
      />

      <TimeAndPayPanel />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={saving || !user}
          onClick={() => void quickAdd('Veckopeng', weeklyBudget, 'veckopeng')}
          className="text-left"
        >
          <MetricTile label="Veckopeng" value={`+${weeklyBudget} kr`} hint="Lägg till" />
        </button>
        <button
          type="button"
          disabled={saving || !user}
          onClick={() => void quickAdd('Matlåda', -mealPreset, 'matlada')}
          className="text-left"
        >
          <MetricTile label="Matlåda" value={`−${mealPreset} kr`} hint="Lägg till" />
        </button>
      </div>

      <button
        type="button"
        disabled={saving || !user}
        onClick={handleWin}
        className="btn-pill--ghost w-full text-sm"
      >
        Vinst-knapp — markera ett litet steg
      </button>

      <BentoCard title="Sparmål" icon={<PiggyBank className="h-4 w-4" />} description="Enkla mål — inga grafer">
        {savings.length === 0 ? (
          <EmptyState message="Inga sparmål ännu." />
        ) : (
          <ul className="mb-3 space-y-2 text-sm">
            {savings.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-2">
                <span>
                  {g.title}: {g.currentSek} / {g.targetSek} kr
                </span>
                <button
                  type="button"
                  className="text-xs text-accent-primary"
                  disabled={saving || !user}
                  onClick={() =>
                    void setBudgetSaving(user!.uid, {
                      id: g.id,
                      title: g.title,
                      targetSek: g.targetSek,
                      currentSek: Math.min(g.targetSek, g.currentSek + 100),
                    }).then(reload)
                  }
                >
                  +100
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            className="input-glass flex-1 min-w-[120px]"
            placeholder="Mål (t.ex. Simkort)"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <input
            type="number"
            className="input-glass w-24"
            value={goalTarget}
            onChange={(e) => setGoalTarget(e.target.value)}
          />
          <button
            type="button"
            disabled={saving || !user || !goalTitle.trim()}
            className="btn-pill--ghost text-sm"
            onClick={() =>
              void setBudgetSaving(user!.uid, {
                title: goalTitle.trim(),
                targetSek: Number(goalTarget) || 0,
                currentSek: 0,
              }).then(() => {
                setGoalTitle('');
                return reload();
              })
            }
          >
            Lägg till
          </button>
        </div>
        <p className="mt-2 text-xs text-text-dim">
          Utgift/inkomst-logg och fasta räkningar finns också under Valv → Lön (PIN).
        </p>
      </BentoCard>

      <BentoCard title="Profil" description="Veckopeng, matlåda och lön">
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Veckobudget (kr)</span>
            <input
              type="number"
              value={weeklyBudget}
              onChange={(e) => setWeeklyBudget(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Matlåda (kr)</span>
            <input
              type="number"
              value={mealPreset}
              onChange={(e) => setMealPreset(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Timlön (kr/h)</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Flexmål (h/vecka)</span>
            <input
              type="number"
              value={flexTarget}
              onChange={(e) => setFlexTarget(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Månadslön (kr)</span>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-text-dim">Standard rast (min)</span>
            <input
              type="number"
              value={defaultBreak}
              onChange={(e) => setDefaultBreak(Number(e.target.value) || 0)}
              onBlur={() => void persistProfile()}
              className="input-glass w-28"
            />
          </label>
        </div>
      </BentoCard>

      <BentoCard
        title={embedded ? 'Ekonomi' : 'Transaktioner'}
        icon={<Wallet className="h-4 w-4" />}
        description={embedded ? 'Veckopeng och matlåda — inga grafer.' : undefined}
      >
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        {saving && (
          <p className="mb-2 flex items-center gap-2 text-sm text-text-dim">
            <Loader2 className="h-4 w-4 animate-spin" /> Sparar…
          </p>
        )}
        {transactions.length === 0 ? (
          <EmptyState message="Inga transaktioner ännu. Tryck veckopeng eller matlåda." />
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <TimelineEntry
                key={t.id}
                meta={`${t.createdAt.slice(0, 10)} · ${t.category}`}
                body={`${t.label} — ${t.amountSek >= 0 ? '+' : ''}${t.amountSek} kr`}
              />
            ))}
          </div>
        )}
      </BentoCard>
    </div>
  );
}
