import {
  DAGBOK_INPUT_MODES_PRIMARY,
  getDagbokInputModeMeta,
  type DagbokInputMode,
} from './dagbokInputModes';

export type DagbokInputModePickerProps = {
  activeMode: DagbokInputMode;
  onChange: (mode: DagbokInputMode) => void;
  /** Dölj modes vid låg kapacitet (Chameleon regel 5). */
  hiddenModes?: DagbokInputMode[];
};

/** Primära dagbokslägen som pills (samma mönster som Valv/Familjen). */
export function DagbokInputModePicker({
  activeMode,
  onChange,
  hiddenModes,
}: DagbokInputModePickerProps) {
  const modes = DAGBOK_INPUT_MODES_PRIMARY.filter((m) => !hiddenModes?.includes(m.id));
  return (
    <div className="familjen-mode-picker" aria-label="Dagbokslägen">
      <div className="familjen-mode-picker__pills" role="tablist">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(mode.id)}
              className={`od-depth__pill min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${isActive ? 'od-depth__pill--active' : ''}`}
              title={mode.description}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function activeDagbokModeLabel(mode: DagbokInputMode): string {
  return getDagbokInputModeMeta(mode).label;
}
