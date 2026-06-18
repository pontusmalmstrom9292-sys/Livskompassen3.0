import { Home, Inbox, LayoutGrid, MoreHorizontal } from 'lucide-react';
import { LivskompassMark } from '@/core/ui/LivskompassMark';

export type ExecutiveNavId = 'hem' | 'resurser' | 'fab' | 'inkorg' | 'mer';

type Item = {
  id: ExecutiveNavId;
  label: string;
  fab?: boolean;
};

const ITEMS: Item[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'resurser', label: 'Resurser' },
  { id: 'fab', label: 'Kompass', fab: true },
  { id: 'inkorg', label: 'Inkorg' },
  { id: 'mer', label: 'Mer' },
];

function NavIcon({ id }: { id: ExecutiveNavId }) {
  const cls = 'design-freeport__exec-nav-icon';
  if (id === 'hem') return <Home className={cls} />;
  if (id === 'resurser') return <LayoutGrid className={cls} />;
  if (id === 'inkorg') return <Inbox className={cls} />;
  return <MoreHorizontal className={cls} />;
}

type Props = {
  active: ExecutiveNavId;
  onSelect: (id: ExecutiveNavId) => void;
};

/** Ref-pixel bottom nav (sandbox jämförelse — ej prod IA). */
export function ExecutiveExactBottomNav({ active, onSelect }: Props) {
  return (
    <nav className="design-freeport__exec-bottom-nav" aria-label="Executive ref navigation">
      {ITEMS.map((item) => {
        if (item.fab) {
          return (
            <button
              key={item.id}
              type="button"
              className="design-freeport__exec-bottom-nav-fab"
              aria-label={item.label}
              onClick={() => onSelect(item.id)}
            >
              <LivskompassMark className="design-freeport__exec-bottom-nav-fab-mark" />
            </button>
          );
        }
        const isOn = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={[
              'design-freeport__exec-bottom-nav-item',
              isOn ? 'design-freeport__exec-bottom-nav-item--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(item.id)}
          >
            <NavIcon id={item.id} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
