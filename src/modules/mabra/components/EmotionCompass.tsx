import { Frown, Meh, Smile } from 'lucide-react';
import { clsx } from 'clsx';

export type EmotionCompassValue = 'tungt' | 'okej' | 'bra';

type Props = {
  value: EmotionCompassValue | null;
  onChange: (value: EmotionCompassValue) => void;
};

const OPTIONS: {
  id: EmotionCompassValue;
  label: string;
  icon: typeof Frown;
  tone: string;
}[] = [
  { id: 'tungt', label: 'TUNGT', icon: Frown, tone: 'mabra-compass--heavy' },
  { id: 'okej', label: 'OKEJ', icon: Meh, tone: 'mabra-compass--neutral' },
  { id: 'bra', label: 'BRA', icon: Smile, tone: 'mabra-compass--light' },
];

export function EmotionCompass({ value, onChange }: Props) {
  return (
    <section className="mabra-reflection-block" aria-labelledby="mabra-compass-heading">
      <h4 id="mabra-compass-heading" className="mabra-reflection-kicker">
        Känslokompassen
      </h4>
      <p className="mb-3 text-sm text-text-muted">Valfritt — inget sparas automatiskt.</p>
      <div className="mabra-compass-grid" role="group" aria-label="Snabb humörmarkering">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={clsx('mabra-compass-card', option.tone, active && 'mabra-compass-card--active')}
            >
              <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              <span className="mabra-compass-card__label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
