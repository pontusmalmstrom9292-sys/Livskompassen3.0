import { BentoCard } from '../../../core/ui/BentoCard';
import { MetricTile } from '../../../core/ui/MetricTile';
import type { PeriodEconomySummary } from '../../../core/firebase/timeEconomyFirestore';

type EconomyPeriodSummaryProps = {
  summary: PeriodEconomySummary | null;
  loading?: boolean;
};

export function EconomyPeriodSummary({ summary, loading }: EconomyPeriodSummaryProps) {
  if (loading || !summary) {
    return (
      <BentoCard title="Period" description="Laddar…">
        <p className="text-sm text-text-dim">—</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard title="Period" description={summary.period.label}>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <MetricTile label="Månadslön" value={`${summary.monthlySalarySek} kr`} hint="Grund" />
        <MetricTile label="Fasta räkningar" value={`${summary.fixedBillsSumSek} kr`} hint="Summa/månad" />
        <MetricTile label="Utgifter (logg)" value={`${summary.ledgerExpensesSek} kr`} hint="I perioden" />
        <MetricTile label="Inkomster (logg)" value={`${summary.ledgerIncomeSek} kr`} hint="I perioden" />
      </div>
      <p className="text-sm text-text-dim">
        Rörliga i perioden: {summary.variableExpensesSek} kr · Uppskattat kvar:{' '}
        <span className="font-medium text-text">{summary.estimatedBalanceSek} kr</span>
      </p>
      <p className="mt-1 text-xs text-text-dim">{summary.ledgerRowCount} loggrader i perioden</p>
    </BentoCard>
  );
}
