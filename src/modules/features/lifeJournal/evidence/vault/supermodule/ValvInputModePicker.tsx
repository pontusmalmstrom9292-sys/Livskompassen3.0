import { ChevronDown } from 'lucide-react';
import {
  VALV_INPUT_MODES_MORE,
  VALV_INPUT_MODES_PRIMARY,
  valvInputModeDef,
  type ValvInputMode,
} from './valvInputModes';

export type ValvInputModePickerProps = {
  activeMode: ValvInputMode;
  onChange: (mode: ValvInputMode) => void;
};

/** Primära lägen som pills + «Mer…» select (Fas 1B — samma mönster som Familjen). */
export function ValvInputModePicker({ activeMode, onChange }: ValvInputModePickerProps) {
  const activeMeta = valvInputModeDef(activeMode);
  const isMoreMode = activeMeta.tier === 'more';

  return (
    <div className="familjen-mode-picker min-w-0 flex-1" aria-label="Valv-lägen">
      <div className="familjen-mode-picker__pills" role="tablist">
        {VALV_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(mode.id)}
              className={`od-depth__pill ${isActive ? 'od-depth__pill--active' : ''} min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
              title={mode.description}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <label className="familjen-mode-picker__more">
        <span className="sr-only">Fler Valv-lägen</span>
        <select
          value={isMoreMode ? activeMode : ''}
          onChange={(e) => {
            const next = e.target.value as ValvInputMode;
            if (next) onChange(next);
          }}
          className={`od-depth__mode-select ${isMoreMode ? 'od-depth__mode-select--active' : ''}`}
          aria-label="Fler Valv-lägen"
        >
          <option value="" disabled={isMoreMode}>
            {isMoreMode ? activeMeta.label : 'Mer…'}
          </option>
          {VALV_INPUT_MODES_MORE.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.label} — {mode.description}
            </option>
          ))}
        </select>
        <ChevronDown className="familjen-mode-picker__chevron" aria-hidden />
      </label>
    </div>
  );
}
