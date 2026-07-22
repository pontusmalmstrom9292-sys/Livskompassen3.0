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

  const triggerActive = isActive || childActive;

  return (
    <div className="drawer-hub mb-1" data-hub-id={id} data-glow={glowColor}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`${label}, ${isOpen ? 'fäll ihop' : 'fäll ut'}`}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'drawer-hub__trigger min-h-11 w-full justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
          triggerActive && 'drawer-hub__trigger--active',
          isOpen && 'drawer-hub__trigger--open',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="drawer-hub__trigger-icon">{icon}</div>
          <span className="drawer-hub__trigger-label">{label}</span>
        </div>
        <ChevronDown className="drawer-hub__chevron" aria-hidden />
      </button>

      <div
        hidden={!isOpen}
        aria-hidden={!isOpen}
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'mt-1 max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
        )}
      >
        <div className="ml-10 space-y-1 py-1">
          {links.map((link) => {
            const active = isDrawerLinkActive(link.path, pathname, search, hash);
            return (
              <button
                key={`${id}-${link.path}`}
                type="button"
                role="link"
                onClick={() => handleLinkClick(link.path)}
                className={clsx(
                  'drawer-hub__link nav-drawer__row--sub min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
                  active && 'drawer-hub__link--active',
                )}
              >
                <span>{link.label}</span>
                <div className="drawer-hub__link-dot" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
