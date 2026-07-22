import { LOW_ENERGY_COPY } from '../constants';

type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

/** Diskret rad — ingen skuld vid avstängning (Fas 2 §1). */
export function MabraLowEnergyToggle({ enabled, onChange }: Props) {
  return (
    <label className="mabra-low-energy-toggle">
      <span className="mabra-low-energy-toggle__label">{LOW_ENERGY_COPY.toggleLabel}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={LOW_ENERGY_COPY.toggleLabel}
        className="mabra-low-energy-toggle__switch min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        onClick={() => onChange(!enabled)}
      >
        <span className="mabra-low-energy-toggle__thumb" aria-hidden />
      </button>
    </label>
  );
}
