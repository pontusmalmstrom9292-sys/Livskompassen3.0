import { LayoutGrid, MoreHorizontal } from 'lucide-react';
import { LivskompassMark } from '@/modules/core/ui/LivskompassMark';
import type { ModellADockId } from './FreeportModellADock';

export type HybridDockSlot = ModellADockId | 'resurser' | 'mer';

type ZoneItem = {
  id: ModellADockId;
  label: string;
};

const LEFT: ZoneItem[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'familjen', label: 'Familjen' },
];

const RIGHT: ZoneItem[] = [
  { id: 'vardagen', label: 'Vardagen' },
  { id: 'hjartat', label: 'Hjärtat' },
];

type Props = {
  active: HybridDockSlot;
  snabbstartOpen: boolean;
  onSelect: (id: HybridDockSlot) => void;
  onFabPress: () => void;
};

/**
 * Hybrid dock — 3-zon rail (Hem/Familjen · Kompass · Vardagen/Hjärtat) + Mer/Resurser.
 */
export function FreeportHybridDock({ active, snabbstartOpen, onSelect, onFabPress }: Props) {
  return (
    <nav className="design-freeport__hybrid-dock" aria-label="Hybrid navigation">
      <div className="design-freeport__hybrid-dock-rail">
        {LEFT.map((item) => (
          <HybridDockItem key={item.id} item={item} active={active} onSelect={onSelect} />
        ))}
        <div className="design-freeport__hybrid-dock-fab-gap" aria-hidden />
        {RIGHT.map((item) => (
          <HybridDockItem key={item.id} item={item} active={active} onSelect={onSelect} />
        ))}
      </div>

      <button
        type="button"
        className={[
          'design-freeport__hybrid-dock-fab',
          snabbstartOpen ? 'design-freeport__hybrid-dock-fab--open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={snabbstartOpen ? 'Stäng snabbstart' : 'Öppna snabbstart — Livskompassen'}
        aria-expanded={snabbstartOpen}
        onClick={onFabPress}
      >
        <LivskompassMark className="design-freeport__hybrid-dock-fab-mark" />
      </button>

      <div className="design-freeport__hybrid-dock-aux">
        <button
          type="button"
          className={[
            'design-freeport__hybrid-dock-aux-btn',
            active === 'resurser' ? 'design-freeport__hybrid-dock-aux-btn--on' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Resurser"
          onClick={() => onSelect('resurser')}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          <span>Resurser</span>
        </button>
        <button
          type="button"
          className={[
            'design-freeport__hybrid-dock-aux-btn',
            active === 'mer' ? 'design-freeport__hybrid-dock-aux-btn--on' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Mer"
          onClick={() => onSelect('mer')}
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
          <span>Mer</span>
        </button>
      </div>
    </nav>
  );
}

function HybridDockItem({
  item,
  active,
  onSelect,
}: {
  item: ZoneItem;
  active: HybridDockSlot;
  onSelect: (id: HybridDockSlot) => void;
}) {
  const isOn = active === item.id;
  return (
    <button
      type="button"
      className={[
        'design-freeport__hybrid-dock-item',
        isOn ? 'design-freeport__hybrid-dock-item--on' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onSelect(item.id)}
    >
      <span className="design-freeport__hybrid-dock-dot" aria-hidden />
      <span>{item.label}</span>
    </button>
  );
}
