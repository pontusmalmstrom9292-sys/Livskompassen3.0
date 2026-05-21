import { clsx } from 'clsx';
import type { MabraDurationMinutes, MabraSymptomHub } from '../types';
import {
  DEFAULT_MABRA_DURATION,
  DURATION_PICKER_COPY,
  MABRA_DURATION_OPTIONS,
} from '../constants';

type BreathingHub = Extract<MabraSymptomHub, 'panic_rsd' | 'self_critical'>;

type Props = {
  hub: BreathingHub;
  value: MabraDurationMinutes;
  onChange: (minutes: MabraDurationMinutes) => void;
  onStart: () => void;
  onBack: () => void;
};

export function DurationPicker({ hub, value, onChange, onStart, onBack }: Props) {
  const copy = DURATION_PICKER_COPY[hub];

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">{copy.question}</p>
      <div className="flex gap-2">
        {MABRA_DURATION_OPTIONS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            onClick={() => onChange(minutes)}
            className={clsx(
              'flex-1 rounded-xl border py-3 text-sm tabular-nums',
              value === minutes ? 'chip--active' : 'chip--idle',
            )}
          >
            {minutes} min
          </button>
        ))}
      </div>
      {value === DEFAULT_MABRA_DURATION && copy.hint && (
        <p className="text-xs text-text-dim">{copy.hint}</p>
      )}
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onBack} className="btn-pill--ghost flex-1">
          Tillbaka
        </button>
        <button type="button" onClick={onStart} className="btn-pill--secondary flex-1">
          {copy.startLabel}
        </button>
      </div>
    </div>
  );
}
