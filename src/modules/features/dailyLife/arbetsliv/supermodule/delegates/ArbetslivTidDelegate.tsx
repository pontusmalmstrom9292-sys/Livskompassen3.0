import { EconomyTidPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyTidPanel';

/**
 * Fas 10C — Tid & flex delegate.
 * Read-only veckodata; lönespec via Valv-länk inuti EconomyTidPanel / EconomyPayslipCard.
 */
export function ArbetslivTidDelegate() {
  return (
    <div className="arbetsliv-delegate arbetsliv-delegate--tid" data-write-target="read_only">
      <EconomyTidPanel />
    </div>
  );
}
