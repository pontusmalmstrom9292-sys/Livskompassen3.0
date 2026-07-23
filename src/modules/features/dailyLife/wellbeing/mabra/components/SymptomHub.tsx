import { Button } from '@/design-system';
import type { MabraSymptomHub } from '../types';
import { SYMPTOM_HUB_OPTIONS, VALUES_COMPASS_COPY } from '../constants';

type Props = {
  onSelect: (hub: MabraSymptomHub) => void;
  onOpenValues: () => void;
};

export function SymptomHub({ onSelect, onOpenValues }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">Vad behöver hjärnan just nu?</p>
      {SYMPTOM_HUB_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className="min-h-11 w-full rounded-xl border border-border-strong bg-surface/40 px-4 py-4 text-left transition hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <p className="text-base font-medium text-accent">{option.label}</p>
          <p className="mt-1 text-sm text-text-muted">{option.hint}</p>
        </button>
      ))}
      <Button
        variant="ghost"
        className="min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        onClick={onOpenValues}
      >
        {VALUES_COMPASS_COPY.hubLinkLabel}
      </Button>
    </div>
  );
}
