import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { RESURSER_NAV_ROWS } from '@/core/navigation/resurserNavConfig';
import { Sheet } from '@/design-system/components/Sheet';

type Props = {
  open: boolean;
  onClose: () => void;
  onPick?: (id: string, label: string) => void;
};

/** Resurser overlay — Design Freeport (mock navigation). */
export function FreeportResurserOverlay({ open, onClose, onPick }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESURSER_NAV_ROWS;
    return RESURSER_NAV_ROWS.filter(
      (r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Resurser"
      placement="sheet"
      size="tall"
      panelClassName="design-freeport__resurser-panel"
      bodyClassName="design-freeport__resurser-body"
      headerAction={
        <button type="button" className="design-freeport__exec-close" aria-label="Stäng" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      }
    >
      <label className="design-freeport__exec-search">
        <Search className="h-4 w-4" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök i resurser"
        />
      </label>

      <ul className="design-freeport__exec-list design-freeport__exec-list--menu">
        {filtered.map((row) => {
          const Icon = row.icon;
          return (
            <li key={row.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => {
                  onPick?.(row.id, row.label);
                  onClose();
                }}
              >
                <span className="design-freeport__exec-list-icon-wrap">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="design-freeport__exec-list-copy">
                  <span className="design-freeport__exec-list-title">{row.label}</span>
                  <span className="design-freeport__exec-list-sub">{row.sub}</span>
                </span>
                <span className="design-freeport__exec-list-chevron">›</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
