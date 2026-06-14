import { StampClockPage } from '@/features/admin/stampla/components/StampClockPage';

/**
 * Fas 10C — Stämpel delegate.
 * Thin wrapper — all Firestore via StampClockPage (time_entries).
 */
export function ArbetslivStamplaDelegate() {
  return (
    <div className="arbetsliv-delegate arbetsliv-delegate--stampla" data-write-target="time_entries">
      <StampClockPage />
    </div>
  );
}
