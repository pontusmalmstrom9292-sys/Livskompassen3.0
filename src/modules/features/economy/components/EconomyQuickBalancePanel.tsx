import { Loader2 } from 'lucide-react';
import { SaldoHero } from '@/core/ui/SaldoHero';
import { MetricTile } from '@/core/ui/MetricTile';
import { useEconomyBudget } from '@/features/dailyLife/wellbeing/economy/hooks/useEconomyBudget';

/**
 * Förenklad vy — Snabbsaldo + Snabbtillägg (veckopeng / matlåda).
 * Alltid tillgänglig oavsett isEconomyAdvancedUnlocked.
 */
export function EconomyQuickBalancePanel() {
  const {
    user,
    loading,
    saving,
    savedFlash,
    error,
    balance,
    spentThisWeek,
    leftThisWeek,
    progressPercent,
    weeklyBudget,
    mealPreset,
    quickAdd,
  } = useEconomyBudget();

  const saldoLabel = balance >= 0 ? `${balance} kr kvar` : `${Math.abs(balance)} kr under noll`;

  return (
    <div className="space-y-4">
      <SaldoHero
        label="Snabbsaldo"
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

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-text-dim">Snabbtillägg</p>
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
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {savedFlash && !saving && <p className="text-sm text-emerald-400">Sparat.</p>}
      {saving && (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Sparar…
        </p>
      )}
    </div>
  );
}
