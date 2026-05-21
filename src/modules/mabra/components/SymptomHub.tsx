import type { MabraSymptomHub } from '../types';
import { SYMPTOM_HUB_OPTIONS } from '../constants';

type Props = {
  onSelect: (hub: MabraSymptomHub) => void;
};

export function SymptomHub({ onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">Vad behöver hjärnan just nu?</p>
      {SYMPTOM_HUB_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className="w-full rounded-xl border border-border-strong bg-surface/40 px-4 py-4 text-left transition hover:border-accent/30"
        >
          <p className="text-base font-medium text-accent">{option.label}</p>
          <p className="mt-1 text-sm text-text-dim">{option.hint}</p>
        </button>
      ))}
    </div>
  );
}
