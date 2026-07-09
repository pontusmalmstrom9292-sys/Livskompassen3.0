import { Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { EconomyQuickBalancePanel } from '@/features/economy/components/EconomyQuickBalancePanel';
import { EconomyAdvancedGate } from '@/features/economy/components/EconomyAdvancedGate';
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
    saving,
    error,
    quickAdd,
    persistProfile,
  } = useEconomyBudget();

  const split = split503020(weeklyBudget * 4);

  return (
    <div className="economy-budget-shell space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text">Mat & Veckopeng</h3>
        <p className="mt-1 text-xs text-text-muted">
          Säkert att spendera-zonen. Fasta utgifter hanteras i Arbetsliv.
        </p>
      </div>

      <EconomyQuickBalancePanel />

      <Button
        variant="ghost"
        disabled={saving || !user}
        onClick={() => void quickAdd('Vinst — du gjorde det', 0, 'vinst')}
        className="w-full text-sm"
      >
        Vinst-knapp — markera ett litet steg
      </Button>

      <EconomyAdvancedGate featureLabel="Kuvert, profil och transaktionslogg" compact>
        <div className="space-y-5">
          <BentoCard title="Profil" description="Veckobudget och matlåda-preset">
            <div className="flex flex-wrap gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-text-dim">Veckobudget (kr)</span>
                <Input
                  type="number"
                  value={weeklyBudget}
                  onChange={(e) => setWeeklyBudget(Number(e.target.value) || 0)}
                  onBlur={() => void persistProfile()}
                  className="input-glass w-28"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-text-dim">Matlåda (kr)</span>
                <Input
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
      </EconomyAdvancedGate>

      <p className="text-center text-xs text-text-dim">
        <Link to="/arbetsliv" className="text-accent hover:underline">
          Arbete & lön → Arbetsliv
        </Link>
      </p>
    </div>
  );
}
