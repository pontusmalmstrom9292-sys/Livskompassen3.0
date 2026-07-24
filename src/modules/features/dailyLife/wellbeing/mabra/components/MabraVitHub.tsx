import { useEffect, useRef, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  groupMabraHubByCategory,
  MABRA_HUB_QUICK_ITEMS,
  MABRA_HUB_ITEMS,
  MABRA_LOW_ENERGY_ITEMS,
  type MabraHubCategory,
  type MabraHubItem,
} from '../mabraHubRegistry';
import { LOW_ENERGY_COPY } from '../constants';

const MABRA_HUB_TILE_FOCUS =
  'min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2';

type Props = {
  openCategory: MabraHubCategory | null;
  onOpenCategoryChange: (category: MabraHubCategory | null) => void;
  onSelectItem: (item: MabraHubItem) => void;
  profileSlot?: ReactNode;
  /** Triggas när hubben visas igen — scrolla till öppen zon. */
  focusToken?: number;
  /** Fas 2 §1 — två stora val istället för full hub. */
  lowEnergyMode?: boolean;
};

export function MabraVitHub({
  openCategory,
  onOpenCategoryChange,
  onSelectItem,
  profileSlot,
  focusToken = 0,
  lowEnergyMode = false,
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

  if (lowEnergyMode) {
    return (
      <div className="mabra-vit-hub">
        {profileSlot ? <div className="mabra-vit-hub__profile">{profileSlot}</div> : null}
        <p className="mabra-vit-hub__intro text-sm text-text-muted">{LOW_ENERGY_COPY.hubHint}</p>
        <div className="mabra-vit-hub__low-energy" role="list" aria-label="Lågenergi">
          {MABRA_LOW_ENERGY_ITEMS.map((item) => (
            <MabraHubLargeTile key={item.id} item={item} onSelectItem={onSelectItem} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mabra-vit-hub">
      {profileSlot ? <div className="mabra-vit-hub__profile">{profileSlot}</div> : null}

      <p className="mabra-vit-hub__intro text-sm text-text-muted">
        Snabbstart eller zon — när du går tillbaka öppnas samma zon igen.
      </p>

      <label className="block text-xs text-text-muted">
        Snabbstart
        <select
          className="input-glass mt-1 min-h-[44px] w-full rounded-xl px-3 py-2 text-sm"
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            const item = MABRA_HUB_QUICK_ITEMS.find((i) => i.id === id);
            if (item) onSelectItem(item);
          }}
          aria-label="Snabbstart verktyg"
        >
          <option value="">Välj snabbstart…</option>
          {MABRA_HUB_QUICK_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.emoji} {item.title}
            </option>
          ))}
        </select>
      </label>

      <nav className="mabra-vit-hub__zones" aria-label="Mabra verktyg">
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
                className={clsx('mabra-vit-hub__zone-trigger', MABRA_HUB_TILE_FOCUS)}
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

function MabraHubLargeTile({
  item,
  onSelectItem,
}: {
  item: MabraHubItem;
  onSelectItem: (item: MabraHubItem) => void;
}) {
  return (
    <button
      type="button"
      className={clsx('mabra-vit-hub__tile mabra-vit-hub__tile--large', MABRA_HUB_TILE_FOCUS)}
      onClick={() => onSelectItem(item)}
    >
      <span className="mabra-vit-hub__tile-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__tile-title">{item.title}</span>
      <span className="mabra-vit-hub__tile-lead">{item.lead}</span>
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
    <button type="button" className={clsx('mabra-vit-hub__tile', MABRA_HUB_TILE_FOCUS)} onClick={() => onSelectItem(item)}>
      <span className="mabra-vit-hub__tile-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__tile-title">{item.title}</span>
      <span className="mabra-vit-hub__tile-lead">{item.lead}</span>
    </button>
  );
}
