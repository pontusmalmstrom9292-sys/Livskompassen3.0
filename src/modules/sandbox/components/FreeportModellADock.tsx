import { LivskompassMark } from '@/modules/core/ui/LivskompassMark';
import type { FreeportZoneId } from '../freeportZones';

export type ModellADockId = 'hem' | FreeportZoneId | 'fab';

type NavItem = {
  id: ModellADockId;
  label: string;
  zone?: FreeportZoneId;
};

const RAIL_ITEMS: NavItem[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'hjartat', label: 'Hjärtat', zone: 'hjartat' },
  { id: 'vardagen', label: 'Vardagen', zone: 'vardagen' },
  { id: 'familjen', label: 'Familjen', zone: 'familjen' },
];

type Props = {
  active: ModellADockId;
  snabbstartOpen: boolean;
  onSelect: (id: ModellADockId) => void;
  onFabPress: () => void;
};

/**
 * Modell A dock — S2-zoner + D1 LivskompassMark centrerad på hela docken.
 * Kompassen sticker ut lika mycket ovanför och under dock-bandet.
 */
export function FreeportModellADock({ active, snabbstartOpen, onSelect, onFabPress }: Props) {
  return (
    <nav className="design-freeport__modell-a-dock" aria-label="Modell A navigation">
      <div className="design-freeport__modell-a-dock-rail">
        {RAIL_ITEMS.slice(0, 2).map((item) => (
          <DockItem key={item.id} item={item} active={active} onSelect={onSelect} />
        ))}
        <div className="design-freeport__modell-a-dock-fab-gap" aria-hidden />
        {RAIL_ITEMS.slice(2).map((item) => (
          <DockItem key={item.id} item={item} active={active} onSelect={onSelect} />
        ))}
      </div>
      <button
        type="button"
        className={[
          'design-freeport__modell-a-dock-fab',
          snabbstartOpen ? 'design-freeport__modell-a-dock-fab--open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={snabbstartOpen ? 'Stäng snabbstart' : 'Öppna snabbstart — Livskompassen'}
        aria-expanded={snabbstartOpen}
        onClick={onFabPress}
      >
        <LivskompassMark className="design-freeport__modell-a-dock-fab-mark" />
      </button>
    </nav>
  );
}

function DockItem({
  item,
  active,
  onSelect,
}: {
  item: NavItem;
  active: ModellADockId;
  onSelect: (id: ModellADockId) => void;
}) {
  const isOn =
    item.id === 'hem' ? active === 'hem' : item.zone ? active === item.zone : false;
  return (
    <button
      type="button"
      className={[
        'design-freeport__modell-a-dock-item',
        isOn ? 'design-freeport__modell-a-dock-item--on' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onSelect(item.id)}
    >
      <span className="design-freeport__modell-a-dock-dot" aria-hidden />
      <span>{item.label}</span>
    </button>
  );
}
