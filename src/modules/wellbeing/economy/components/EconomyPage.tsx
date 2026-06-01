import { useCallback, useEffect, useMemo, useState } from 'react';
import { Briefcase, Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { SaldoHero } from '../../../core/ui/SaldoHero';
import { MetricTile } from '../../../core/ui/MetricTile';
import { EmptyState } from '../../../core/ui/EmptyState';
import { TimelineEntry } from '../../../core/ui/TimelineEntry';
import { useStore } from '../../../core/store';
import {
  getEconomyProfile,
  getEconomyTransactions,
  saveEconomyTransaction,
  setEconomyProfile,
} from '../../../core/firebase/firestore';

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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [txs, profile] = await Promise.all([
        getEconomyTransactions(user.uid),
        getEconomyProfile(user.uid),
      ]);
      setTransactions(txs);
      if (profile) {
        setWeeklyBudget(profile.weeklyBudgetSek || DEFAULT_WEEKLY);
        setMealPreset(profile.mealBoxPresetSek || DEFAULT_MEAL);
      }
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
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
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
      await setEconomyProfile(user.uid, {
        weeklyBudgetSek: weeklyBudget,
        mealBoxPresetSek: mealPreset,
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

      <BentoCard
        title="Arbetsliv"
        icon={<Briefcase className="h-4 w-4" />}
        description="Stämpel, flex, sjuk/VAB och lönespec"
      >
        <Link to="/arbetsliv" className="text-sm text-accent hover:underline">
          Öppna Arbetsliv-hubben
        </Link>
      </BentoCard>

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

      <BentoCard title="Profil" description="Firestore economy_profiles">
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
        </div>
      </BentoCard>

      <BentoCard
        title={embedded ? 'Ekonomi' : 'Transaktioner'}
        icon={<Wallet className="h-4 w-4" />}
        description={embedded ? 'Veckopeng och matlåda — inga grafer.' : undefined}
      >
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        {savedFlash && !saving && (
          <p className="mb-2 text-sm text-emerald-400">Sparat.</p>
        )}
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
