import { Loader2 } from 'lucide-react';
import { Button } from '@/design-system';

type Props = {
  isClockedIn: boolean;
  busy: boolean;
  compact?: boolean;
  onStampIn: () => void;
  onStampOut: () => void;
};

export function StampClockControls({ isClockedIn, busy, compact, onStampIn, onStampOut }: Props) {
  const btnClass = compact
    ? 'min-h-11 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
    : 'min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

  return (
    <div
      className={compact ? 'flex gap-1.5' : 'grid grid-cols-2 gap-2'}
      role="group"
      aria-label="Stämpla in eller ut"
      aria-busy={busy}
    >
      <Button type="button" disabled={busy || isClockedIn} onClick={onStampIn} variant={isClockedIn || busy ? 'ghost' : 'accent'} className={`${btnClass}${isClockedIn || busy ? ' opacity-40' : ''}`} aria-label={compact ? 'Stämpla in' : undefined}>
        {busy && !isClockedIn ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : compact ? (
          'In'
        ) : (
          'Stämpla in'
        )}
      </Button>
      <Button type="button" disabled={busy || !isClockedIn} onClick={onStampOut} variant={isClockedIn && !busy ? 'success' : 'ghost'} className={`${btnClass}${isClockedIn && !busy ? '' : ' opacity-40'}`} aria-label={compact ? 'Stämpla ut' : undefined}>
        {busy && isClockedIn ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : compact ? (
          'Ut'
        ) : (
          'Stämpla ut'
        )}
      </Button>
    </div>
  );
}
