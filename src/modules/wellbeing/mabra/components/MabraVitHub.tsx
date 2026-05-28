import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  groupMabraHubByCategory,
  MABRA_HUB_QUICK_ITEMS,
  MABRA_HUB_ITEMS,
  type MabraHubAction,
  type MabraHubItem,
} from '../mabraHubRegistry';

type Props = {
  onAction: (action: MabraHubAction) => void;
  profileSlot?: ReactNode;
};

export function MabraVitHub({ onAction, profileSlot }: Props) {
  const allGroups = groupMabraHubByCategory(MABRA_HUB_ITEMS);
  const [openCategory, setOpenCategory] = useState<string | null>('akut');

  return (
    <div className="mabra-vit-hub">
      {profileSlot ? <div className="mabra-vit-hub__profile">{profileSlot}</div> : null}

      <p className="mabra-vit-hub__intro text-sm text-text-muted">
        Välj zon eller snabbknapp — inte en lång lista. Allt finns här från start.
      </p>

      <div className="mabra-vit-hub__quick" role="list" aria-label="Snabbstart">
        {MABRA_HUB_QUICK_ITEMS.map((item) => (
          <MabraHubChip key={item.id} item={item} onAction={onAction} />
        ))}
      </div>

      <nav className="mabra-vit-hub__zones" aria-label="MåBra verktyg">
        {allGroups.map((group) => {
          const isOpen = openCategory === group.category;
          return (
            <div
              key={group.category}
              className={clsx('mabra-vit-hub__zone', isOpen && 'mabra-vit-hub__zone--open')}
            >
              <button
                type="button"
                className="mabra-vit-hub__zone-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenCategory(isOpen ? null : group.category)}
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
                      <MabraHubTile key={item.id} item={item} onAction={onAction} />
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
  onAction,
}: {
  item: MabraHubItem;
  onAction: (action: MabraHubAction) => void;
}) {
  return (
    <button
      type="button"
      className="mabra-vit-hub__chip"
      onClick={() => onAction(item.action)}
    >
      <span className="mabra-vit-hub__chip-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__chip-label">{item.title}</span>
    </button>
  );
}

function MabraHubTile({
  item,
  onAction,
}: {
  item: MabraHubItem;
  onAction: (action: MabraHubAction) => void;
}) {
  return (
    <button
      type="button"
      className="mabra-vit-hub__tile"
      onClick={() => onAction(item.action)}
    >
      <span className="mabra-vit-hub__tile-emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="mabra-vit-hub__tile-title">{item.title}</span>
      <span className="mabra-vit-hub__tile-lead">{item.lead}</span>
    </button>
  );
}
