import { useEffect, useRef, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  groupMabraHubByCategory,
  MABRA_HUB_QUICK_ITEMS,
  MABRA_HUB_ITEMS,
  type MabraHubCategory,
  type MabraHubItem,
} from '../mabraHubRegistry';

type Props = {
  openCategory: MabraHubCategory | null;
  onOpenCategoryChange: (category: MabraHubCategory | null) => void;
  onSelectItem: (item: MabraHubItem) => void;
  profileSlot?: ReactNode;
  /** Triggas när hubben visas igen — scrolla till öppen zon. */
  focusToken?: number;
};

export function MabraVitHub({
  openCategory,
  onOpenCategoryChange,
  onSelectItem,
  profileSlot,
  focusToken = 0,
}: Props) {
  const allGroups = groupMabraHubByCategory(MABRA_HUB_ITEMS);
  const zoneRefs = useRef<Partial<Record<MabraHubCategory, HTMLDivElement | null>>>({});

  useEffect(() => {
    if (!openCategory || focusToken === 0) return;
    const el = zoneRefs.current[openCategory];
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [openCategory, focusToken]);

  return (
    <div className="mabra-vit-hub">
      {profileSlot ? <div className="mabra-vit-hub__profile">{profileSlot}</div> : null}

      <p className="mabra-vit-hub__intro text-sm text-text-muted">
        Snabbstart eller zon — när du går tillbaka öppnas samma zon igen.
      </p>

      <div className="mabra-vit-hub__quick" role="list" aria-label="Snabbstart">
        {MABRA_HUB_QUICK_ITEMS.map((item) => (
          <MabraHubChip key={item.id} item={item} onSelectItem={onSelectItem} />
        ))}
      </div>

      <nav className="mabra-vit-hub__zones" aria-label="MåBra verktyg">
        {allGroups.map((group) => {
          const isOpen = openCategory === group.category;
          return (
            <div
              key={group.category}
              ref={(node) => {
                zoneRefs.current[group.category] = node;
              }}
              id={`mabra-zone-${group.category}`}
              className={clsx('mabra-vit-hub__zone', isOpen && 'mabra-vit-hub__zone--open')}
            >
              <button
                type="button"
                className="mabra-vit-hub__zone-trigger"
                aria-expanded={isOpen}
                onClick={() => onOpenCategoryChange(isOpen ? null : group.category)}
              >
                <span className="mabra-vit-hub__zone-label">{group.label}</span>
                <span className="mabra-vit-hub__zone-meta">{group.items.length}</span>
                <ChevronDown className="mabra-vit-hub__zone-chevron" aria-hidden />
              </button>
              {isOpen ? (
                <div className="mabra-vit-hub__zone-grid">
                  {group.items
                    .filter((item) => !item.quick)
                    .map((item) => (
                      <MabraHubTile key={item.id} item={item} onSelectItem={onSelectItem} />
                    ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function MabraHubChip({
  item,
  onSelectItem,
}: {
  item: MabraHubItem;
  onSelectItem: (item: MabraHubItem) => void;
}) {
  return (
    <button type="button" className="mabra-vit-hub__chip" onClick={() => onSelectItem(item)}>
      <span className="mabra-vit-hub__chip-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__chip-label">{item.title}</span>
    </button>
  );
}

function MabraHubTile({
  item,
  onSelectItem,
}: {
  item: MabraHubItem;
  onSelectItem: (item: MabraHubItem) => void;
}) {
  return (
    <button type="button" className="mabra-vit-hub__tile" onClick={() => onSelectItem(item)}>
      <span className="mabra-vit-hub__tile-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__tile-title">{item.title}</span>
      <span className="mabra-vit-hub__tile-lead">{item.lead}</span>
    </button>
  );
}
