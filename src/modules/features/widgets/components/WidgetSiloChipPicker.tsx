import {
  DEFAULT_WIDGET_SILO,
  WIDGET_SILO_CHIPS,
  WIDGET_SILO_STORAGE_KEY,
  type WidgetSiloId,
} from '../config/widgetSiloConfig';
import { WidgetButton } from './WidgetButton';

type Props = {
  value: WidgetSiloId;
  onChange: (silo: WidgetSiloId) => void;
};

export function readStoredWidgetSilo(): WidgetSiloId {
  try {
    const raw = sessionStorage.getItem(WIDGET_SILO_STORAGE_KEY);
    if (raw && WIDGET_SILO_CHIPS.some((c) => c.id === raw)) {
      return raw as WidgetSiloId;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_WIDGET_SILO;
}

export function persistWidgetSilo(silo: WidgetSiloId) {
  try {
    sessionStorage.setItem(WIDGET_SILO_STORAGE_KEY, silo);
  } catch {
    /* ignore */
  }
}

export function WidgetSiloChipPicker({ value, onChange }: Props) {
  const active = WIDGET_SILO_CHIPS.find((c) => c.id === value);

  return (
    <div className="widget-silo-picker space-y-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">Vart ska det landa?</p>
      <div
        role="radiogroup"
        aria-label="Välj silo före spar"
        className="flex flex-wrap gap-1.5"
      >
        {WIDGET_SILO_CHIPS.map((chip) => (
          <WidgetButton
            key={chip.id}
            type="button"
            role="radio"
            variant={value === chip.id ? 'accent' : 'ghost'}
            aria-checked={value === chip.id}
            onClick={() => onChange(chip.id)}
            className="min-h-11 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {chip.label}
          </WidgetButton>
        ))}
      </div>
      {active ? <p className="text-xs text-text-muted">{active.hint}</p> : null}
    </div>
  );
}
