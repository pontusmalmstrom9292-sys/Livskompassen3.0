import { LivskompassMark } from '@/modules/core/ui/LivskompassMark';
import type { FreeportZoneId } from '../freeportZones';

export type ModellADockId = 'hem' | FreeportZoneId | 'fab';

type NavItem = {
  id: ModellADockId;
  label: string;
  zone?: FreeportZoneId;
  fab?: boolean;
};

const ITEMS: NavItem[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'hjartat', label: 'Hjärtat', zone: 'hjartat' },
  { id: 'fab', label: 'Kompass', fab: true },
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
 * Modell A dock — S2-zoner + upphöjd LivskompassMark (D1) i mitten.
 * FAB växlar snabbstart-panel (Fyren-lik), inte ref-pixel Mer/Inkorg.
 */
export function FreeportModellADock({ active, snabbstartOpen, onSelect, onFabPress }: Props) {
  return (
    <nav
      className="design-freeport__bottom-nav design-freeport__modell-a-dock"
      aria-label="Modell A navigation"
    >
      {ITEMS.map((item) => {
        if (item.fab) {
          return (
            <button
              key={item.id}
              type="button"
              className={[
                'design-freeport__bottom-nav-fab',
                'design-freeport__modell-a-dock-fab',
                snabbstartOpen ? 'design-freeport__modell-a-dock-fab--open' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={
                snabbstartOpen ? 'Stäng snabbstart' : 'Öppna snabbstart — Livskompassen'
              }
              aria-expanded={snabbstartOpen}
              onClick={onFabPress}
            >
              <LivskompassMark className="design-freeport__bottom-nav-fab-mark" />
            </button>
          );
        }
        const isOn =
          item.id === 'hem' ? active === 'hem' : item.zone ? active === item.zone : false;
        return (
          <button
            key={item.id}
            type="button"
            className={[
              'design-freeport__bottom-nav-item',
              isOn ? 'design-freeport__bottom-nav-item--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(item.id)}
          >
            <span className="design-freeport__bottom-nav-dot" aria-hidden />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
