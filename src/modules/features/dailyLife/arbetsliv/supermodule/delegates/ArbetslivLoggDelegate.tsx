import { EconomyLogPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyLogPanel';

export type ArbetslivLoggDelegateProps = {
  /** Valfri callback efter ledger-ändring (t.ex. parent refresh). */
  onChanged?: () => void;
};

/**
 * Fas 10C — Ekonomilogg delegate.
 * Writes via EconomyLogPanel → economy_ledger + fasta räkningar.
 */
export function ArbetslivLoggDelegate({ onChanged }: ArbetslivLoggDelegateProps) {
  return (
    <div className="arbetsliv-delegate arbetsliv-delegate--logg" data-write-target="economy_ledger">
      <EconomyLogPanel onChanged={onChanged} />
    </div>
  );
}
