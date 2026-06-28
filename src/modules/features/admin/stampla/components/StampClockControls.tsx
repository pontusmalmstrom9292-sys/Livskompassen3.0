import { Loader2 } from 'lucide-react';

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
      <button
        type="button"
        disabled={busy || isClockedIn}
        onClick={onStampIn}
        className={`${btnClass} ${
          isClockedIn || busy ? 'ds-btn ds-btn--ghost opacity-40' : 'ds-btn ds-btn--accent'
        }`}
      >
        {busy && !isClockedIn ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : compact ? (
          'In'
        ) : (
          'Stämpla in'
        )}
      </button>
      <button
        type="button"
        disabled={busy || !isClockedIn}
        onClick={onStampOut}
        className={`${btnClass} ${
          isClockedIn && !busy ? 'ds-btn ds-btn--success-solid' : 'ds-btn ds-btn--ghost opacity-40'
        }`}
      >
        {busy && isClockedIn ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : compact ? (
          'Ut'
        ) : (
          'Stämpla ut'
        )}
      </button>
    </div>
  );
}
