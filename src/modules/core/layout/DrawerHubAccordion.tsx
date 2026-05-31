import { useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import {
  drawerHubHasChildren,
  getDrawerChildren,
  getDrawerRoots,
  type NavDrawerSection,
} from '../navigation/navTruth';
import { groupVardagDrawerRoots } from '../navigation/tabRegistry';
import { toDrawerNavItem, type DrawerNavItem, type DrawerNavIcon } from '../navigation/drawerNav';

export function isDrawerItemActive(
  item: DrawerNavItem,
  pathname: string,
  search: string,
  hash: string,
): boolean {
  const hashIndex = item.path.indexOf('#');
  const qIndex = item.path.indexOf('?');
  const cut = [hashIndex, qIndex].filter((i) => i >= 0);
  const end = cut.length ? Math.min(...cut) : item.path.length;
  const itemPath = item.path.slice(0, end > 0 ? end : item.path.length);
  const itemHash = hashIndex >= 0 ? item.path.slice(hashIndex + 1) : '';
  const itemQuery = qIndex >= 0 ? item.path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined) : '';

  if (pathname !== itemPath) return false;

  if (itemHash) {
    return hash.replace(/^#/, '') === itemHash;
  }

  if (!itemQuery) {
    return pathname === itemPath && !search.replace(/^\?/, '') && !hash.replace(/^#/, '');
  }

  const current = new URLSearchParams(search.replace(/^\?/, ''));
  const expected = new URLSearchParams(itemQuery);
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

function NavRow({
  item,
  active,
  sub,
  group,
  expanded,
  hasChildren,
  onNavigate,
  onToggleExpand,
  badge,
}: {
  item: DrawerNavItem;
  active: boolean;
  sub?: boolean;
  group?: boolean;
  expanded?: boolean;
  hasChildren?: boolean;
  onNavigate: () => void;
  onToggleExpand?: () => void;
  badge?: number;
}) {
  const Icon = item.icon as DrawerNavIcon;

  return (
    <div className={clsx('nav-drawer__row-wrap', sub && 'nav-drawer__row-wrap--sub')}>
      <button
        type="button"
        className={clsx(
          'nav-drawer__row',
          sub && 'nav-drawer__row--sub',
          group && 'nav-drawer__row--group',
          active && 'nav-drawer__row--active',
        )}
        onClick={onNavigate}
      >
        <span className="nav-drawer__row-icon" aria-hidden>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span className="nav-drawer__row-label">{item.label}</span>
        {badge != null && badge > 0 ? (
          <span className="nav-drawer__row-badge" aria-label={`${badge} väntar på godkännande`}>
            {badge}
          </span>
        ) : null}
        {hasChildren ? (
          <span
            role="button"
            tabIndex={0}
            className="nav-drawer__row-expand"
            aria-expanded={expanded}
            aria-label={expanded ? 'Fäll ihop' : 'Visa underflikar'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onToggleExpand?.();
              }
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
          </span>
        ) : (
          <ChevronRight className="nav-drawer__row-chevron" strokeWidth={1.5} aria-hidden />
        )}
      </button>
    </div>
  );
}

type Props = {
  section: NavDrawerSection;
  pathname: string;
  search: string;
  hash: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onGo: (item: DrawerNavItem) => void;
  /** itemId → antal (t.ex. väntande Vävaren på valv_arkiv). */
  badges?: Record<string, number>;
};

export function DrawerHubAccordion({
  section,
  pathname,
  search,
  hash,
  expandedIds,
  onToggleExpand,
  onGo,
  badges,
}: Props) {
  const roots = useMemo(() => getDrawerRoots(section).map(toDrawerNavItem), [section]);

  const vardagGroups = useMemo(
    () => (section === 'vardag' ? groupVardagDrawerRoots(getDrawerRoots('vardag')) : []),
    [section],
  );

  const renderHub = (hub: DrawerNavItem) => {
    const children = getDrawerChildren(hub.id, section).map(toDrawerNavItem);
    const hasChildren = drawerHubHasChildren(hub.id, section);
    const expanded = expandedIds.has(hub.id);
    const hubActive =
      isDrawerItemActive(hub, pathname, search, hash) ||
      children.some((c) => isDrawerItemActive(c, pathname, search, hash));

    return (
      <div key={hub.id} className="nav-drawer__hub">
        <NavRow
          item={hub}
          active={hubActive && !hub.isGroupHeader}
          group={hub.isGroupHeader}
          expanded={expanded}
          hasChildren={hasChildren}
          badge={badges?.[hub.id]}
          onNavigate={() => {
            if (hub.isGroupHeader) {
              onToggleExpand(hub.id);
              return;
            }
            if (!hasChildren) {
              onGo(hub);
              return;
            }
            onGo(hub);
          }}
          onToggleExpand={() => onToggleExpand(hub.id)}
        />
        {hasChildren && expanded && (
          <div className="nav-drawer__hub-children">
            {hub.drawerHint ? (
              <p className="nav-drawer__hub-hint">{hub.drawerHint}</p>
            ) : null}
            {children.map((child) => (
              <NavRow
                key={child.id}
                item={child}
                sub
                active={isDrawerItemActive(child, pathname, search, hash)}
                badge={badges?.[child.id]}
                onNavigate={() => onGo(child)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (section === 'valv') {
    return <div className="nav-drawer__list">{roots.map(renderHub)}</div>;
  }

  return (
    <div className="nav-drawer__list">
      {vardagGroups.map((group) => (
        <div key={group.category} className="nav-drawer__category">
          <p className="nav-drawer__category-title">{group.label}</p>
          {group.entries.map((entry) => renderHub(toDrawerNavItem(entry)))}
        </div>
      ))}
    </div>
  );
}
