import type { MabraDurationMinutes, MabraSymptomHub } from '../types';
import {
  DEFAULT_MABRA_DURATION,
  DURATION_PICKER_COPY,
  MABRA_DURATION_OPTIONS,
} from '../constants';

type BreathingHub = Extract<MabraSymptomHub, 'panic_rsd'>;

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
      <label className="block text-xs text-text-muted">
        Varaktighet
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as MabraDurationMinutes)}
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm tabular-nums"
        >
          {MABRA_DURATION_OPTIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} min
            </option>
          ))}
        </select>
      </label>
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
