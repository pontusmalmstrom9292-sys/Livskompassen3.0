import { ChevronDown } from 'lucide-react';
import {
  FAMILJEN_INPUT_MODES,
  FAMILJEN_INPUT_MODES_MORE,
  FAMILJEN_INPUT_MODES_PRIMARY,
  getFamiljenInputModeMeta,
  type FamiljenInputMode,
} from './familjenInputModes';

export type FamiljenInputModePickerProps = {
  activeMode: FamiljenInputMode;
  onChange: (mode: FamiljenInputMode) => void;
};

/**
 * Compact mode picker — pill row (primary) + native select (Mer…).
 * Drives delegate routing in FamiljenInputSuperModule without full nav grid.
 */
export function FamiljenInputModePicker({ activeMode, onChange }: FamiljenInputModePickerProps) {
  const activeMeta = getFamiljenInputModeMeta(activeMode);
  const isMoreMode = activeMeta.tier === 'more';

  return (
    <div className="familjen-mode-picker min-w-0 flex-1" aria-label="Inmatningslägen">
      <div className="familjen-mode-picker__pills" role="tablist">
        {FAMILJEN_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(mode.id)}
              className={`od-depth__pill ${isActive ? 'od-depth__pill--active' : ''}`}
              title={mode.description}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <label className="familjen-mode-picker__more">
        <span className="sr-only">Fler lägen</span>
        <select
          value={isMoreMode ? activeMode : ''}
          onChange={(e) => {
            const next = e.target.value as FamiljenInputMode;
            if (next) onChange(next);
          }}
          className={`od-depth__mode-select ${isMoreMode ? 'od-depth__mode-select--active' : ''}`}
          aria-label="Fler inmatningslägen"
        >
          <option value="" disabled={isMoreMode}>
            {isMoreMode ? activeMeta.label : 'Mer…'}
          </option>
          {FAMILJEN_INPUT_MODES_MORE.map((mode) => (
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

/** All modes — for tests / Storybook. */
export const FAMILJEN_MODE_PICKER_MODES = FAMILJEN_INPUT_MODES;
