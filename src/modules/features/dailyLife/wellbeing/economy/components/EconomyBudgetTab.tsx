import { Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { SaldoHero } from '@/core/ui/SaldoHero';
import { MetricTile } from '@/core/ui/MetricTile';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useEconomyBudget } from '../hooks/useEconomyBudget';
import { split503020 } from '../rules/budgetTemplates';
import { EconomyEnvelopeSection } from './EconomyEnvelopeSection';

export function EconomyBudgetTab() {
  const {
    user,
    transactions,
    weeklyBudget,
    setWeeklyBudget,
    mealPreset,
    setMealPreset,
    loading,
    saving,
    savedFlash,
    error,
    balance,
    spentThisWeek,
    leftThisWeek,
    progressPercent,
    quickAdd,
    persistProfile,
  } = useEconomyBudget();

  const saldoLabel = balance >= 0 ? `${balance} kr kvar` : `${Math.abs(balance)} kr under noll`;
  const split = split503020(weeklyBudget * 4);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text">Mat & Veckopeng</h3>
        <p className="mt-1 text-xs text-text-muted">
          Säkert att spendera-zonen. Fasta utgifter hanteras i Arbetsliv.
        </p>
      </div>

      <SaldoHero
        label="Vad har jag kvar"
        amount={loading ? '— kr' : saldoLabel}
        hint={`Veckobudget ${weeklyBudget} kr · matlåda ${mealPreset} kr`}
      />

      <div className="space-y-2">
        <div className="flex justify-between text-xs tabular-nums">
          <span className="text-text-dim">
            Förbrukat denna vecka: <strong className="text-text">{spentThisWeek} kr</strong>
          </span>
          <span className="text-text-dim">
            Kvar att leva på: <strong className="text-accent">{leftThisWeek} kr</strong>
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-border/50 bg-surface-3">
          <div
            className="h-full rounded-full bg-accent shadow-accent-glow transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

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
        onClick={() => void quickAdd('Vinst — du gjorde det', 0, 'vinst')}
        className="btn-pill--ghost w-full text-sm"
      >
        Vinst-knapp — markera ett litet steg
      </button>

      <BentoCard title="Profil" description="Veckobudget och matlåda-preset">
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
        <p className="mt-3 text-[10px] leading-relaxed text-text-muted">
          50/30/20 (månad ≈ 4× vecka): behov {split.needsSek} kr · lyx {split.wantsSek} kr · spar{' '}
          {split.savingsSek} kr
        </p>
      </BentoCard>

      <EconomyEnvelopeSection />

      <BentoCard
        title="Transaktioner"
        icon={<Wallet className="h-4 w-4" />}
        description="Veckopeng och matlåda — inga grafer."
      >
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        {savedFlash && !saving && <p className="mb-2 text-sm text-emerald-400">Sparat.</p>}
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

      <p className="text-center text-xs text-text-dim">
        <Link to="/arbetsliv" className="text-accent hover:underline">
          Arbete & lön → Arbetsliv
        </Link>
      </p>
    </div>
  );
}
