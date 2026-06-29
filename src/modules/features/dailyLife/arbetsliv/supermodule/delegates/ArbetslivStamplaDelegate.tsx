import { StampClockPage } from '@/features/admin/stampla/components/StampClockPage';

/**
 * Fas 10C — Stämpel delegate.
 * Thin wrapper — all Firestore via StampClockPage (time_entries).
 */
export function ArbetslivStamplaDelegate() {
  return (
    <div
      className="arbetsliv-delegate arbetsliv-delegate--stampla overflow-hidden rounded-2xl border border-border-strong bg-surface/25 p-1"
      data-write-target="time_entries"
    >
      <StampClockPage />
    </div>
  );
}
