import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export type DrawerHubLink = {
  label: string;
  path: string;
};

type Link = DrawerHubLink;

type Props = {
  id: string;
  label: string;
  icon: React.ReactNode;
  links: Link[];
  glowColor: 'gold' | 'blue' | 'green';
  isActive: boolean;
  onClose: () => void;
};

const GLOW_LINK: Record<Props['glowColor'], string> = {
  gold: 'border-l-2 border-l-accent/70 text-accent bg-accent/5',
  blue: 'border-l-2 border-l-indigo-500/70 text-indigo-400 bg-indigo-500/5',
  green: 'border-l-2 border-l-emerald-500/70 text-emerald-400 bg-emerald-500/5',
};

/** Matchar drawer-länk mot aktuell route (path + query + hash). */
export function isDrawerLinkActive(
  path: string,
  pathname: string,
  search: string,
  hash: string,
): boolean {
  const hashIndex = path.indexOf('#');
  const qIndex = path.indexOf('?');
  const cut = [hashIndex, qIndex].filter((i) => i >= 0);
  const end = cut.length ? Math.min(...cut) : path.length;
  const itemPath = path.slice(0, end > 0 ? end : path.length);
  const itemHash = hashIndex >= 0 ? path.slice(hashIndex + 1) : '';
  const itemQuery =
    qIndex >= 0 ? path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined) : '';

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

/** @deprecated Använd isDrawerLinkActive — behålls för smoke/legacy. */
export function isDrawerItemActive(
  item: { path: string },
  pathname: string,
  search: string,
  hash: string,
): boolean {
  return isDrawerLinkActive(item.path, pathname, search, hash);
}

function parseNavigateTarget(path: string): { pathname: string; search: string; hash: string } {
  const hashIndex = path.indexOf('#');
  const qIndex = path.indexOf('?');
  const cut = [hashIndex, qIndex].filter((i) => i >= 0);
  const end = cut.length ? Math.min(...cut) : path.length;
  const pathname = path.slice(0, end > 0 ? end : path.length) || '/';
  const search =
    qIndex >= 0 ? `?${path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined)}` : '';
  const hash = hashIndex >= 0 ? `#${path.slice(hashIndex + 1)}` : '';
  return { pathname, search, hash };
}

export function DrawerHubAccordion({
  id,
  label,
  icon,
  links,
  glowColor,
  isActive,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;

  const childActive = links.some((l) => isDrawerLinkActive(l.path, pathname, search, hash));
  const [isOpen, setIsOpen] = useState(isActive || childActive);

  useEffect(() => {
    if (isActive || childActive) setIsOpen(true);
  }, [isActive, childActive]);

  const handleLinkClick = (path: string) => {
    navigate(parseNavigateTarget(path));
    onClose();
  };

  return (
    <div className="drawer-hub mb-1" data-hub-id={id}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'group flex w-full items-center justify-between rounded-xl p-3 transition-all duration-300',
          isOpen ? 'bg-surface-3/50' : 'hover:bg-surface-2/50',
          (isActive || childActive) && 'bg-accent/5',
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'rounded-lg p-2 transition-colors',
              isOpen ? 'text-accent' : 'text-text-dim group-hover:text-text',
            )}
          >
            {icon}
          </div>
          <span
            className={clsx(
              'text-sm font-medium transition-colors',
              isOpen ? 'text-text' : 'text-text-muted group-hover:text-text',
            )}
          >
            {label}
          </span>
        </div>
        <ChevronDown
          className={clsx(
            'h-4 w-4 text-text-dim transition-transform duration-300',
            isOpen && 'rotate-180 text-accent',
          )}
          aria-hidden
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'mt-1 max-h-60 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="ml-10 space-y-1 py-1">
          {links.map((link) => {
            const active = isDrawerLinkActive(link.path, pathname, search, hash);
            return (
              <button
                key={`${id}-${link.path}`}
                type="button"
                onClick={() => handleLinkClick(link.path)}
                className={clsx(
                  'drawer-hub__link nav-drawer__row--sub group/link flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition-all',
                  active
                    ? GLOW_LINK[glowColor]
                    : 'text-text-muted hover:bg-accent/5 hover:text-accent',
                )}
              >
                <span>{link.label}</span>
                <div
                  className={clsx(
                    'h-1 w-1 rounded-full transition-all',
                    active ? 'bg-accent' : 'bg-accent/0 group-hover/link:bg-accent',
                  )}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
