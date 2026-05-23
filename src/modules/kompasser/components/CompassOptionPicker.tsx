import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { getCompassOptionMeta } from '../config/compassOptionMeta';

type CompassOptionPickerProps = {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  density?: 'compact' | 'comfortable';
};

export function CompassOptionPicker({
  options,
  selected,
  onSelect,
  density = 'compact',
}: CompassOptionPickerProps) {
  const comfortable = density === 'comfortable';

  return (
    <div
      className={clsx('compass-option-grid', comfortable && 'compass-option-grid--comfortable')}
      role="group"
    >
      {options.map((opt) => {
        const meta = getCompassOptionMeta(opt);
        const Icon = meta?.icon;
        const isActive = selected === opt;

        return (
          <button
            key={opt}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(opt)}
            className={clsx(
              'compass-option-tile',
              meta && `compass-option-tile--${meta.tone}`,
              isActive && 'compass-option-tile--active',
            )}
          >
            {Icon ? (
              <span className="compass-option-tile__icon" aria-hidden>
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
            ) : null}
            <span className="compass-option-tile__copy">
              <span className="compass-option-tile__label">{opt}</span>
              {meta?.hint ? (
                <span className="compass-option-tile__hint">{meta.hint}</span>
              ) : null}
            </span>
            {isActive ? (
              <span className="compass-option-tile__check" aria-hidden>
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
