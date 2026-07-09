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
  const btnClass = compact ? 'text-xs px-2 py-1.5' : 'text-sm';

  return (
    <div className={compact ? 'flex gap-1.5' : 'grid grid-cols-2 gap-2'}>
      <Button type="button" disabled={busy || isClockedIn} onClick={onStampIn} variant={isClockedIn || busy ? 'ghost' : 'accent'} className={`${btnClass}${isClockedIn || busy ? ' opacity-40' : ''}`}>
        {busy && !isClockedIn ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : compact ? (
          'In'
        ) : (
          'Stämpla in'
        )}
      </Button>
      <Button type="button" disabled={busy || !isClockedIn} onClick={onStampOut} variant={isClockedIn && !busy ? 'success' : 'ghost'} className={`${btnClass}${isClockedIn && !busy ? '' : ' opacity-40'}`}>
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
