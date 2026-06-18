import { clsx } from 'clsx';
import { FREEPORT_ZONES, type FreeportZoneId } from '../freeportZones';

type Props = {
  activeZone: FreeportZoneId;
  onSelect: (zone: FreeportZoneId) => void;
};

export function FreeportZoneNav({ activeZone, onSelect }: Props) {
  return (
    <nav className="design-freeport__zone-nav" aria-label="Zoner">
      {FREEPORT_ZONES.map((zone) => (
        <button
          key={zone.id}
          type="button"
          className={clsx(
            'design-freeport__zone-btn',
            activeZone === zone.id && 'design-freeport__zone-btn--on',
          )}
          onClick={() => onSelect(zone.id)}
        >
          <div>
            <p className="design-freeport__zone-label">{zone.label}</p>
            <p className="design-freeport__zone-lead">{zone.lead}</p>
          </div>
        </button>
      ))}
    </nav>
  );
}
