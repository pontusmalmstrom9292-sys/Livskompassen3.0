import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { DRAWER_NAV_ITEMS, type DrawerNavItem } from '../navigation/drawerNav';
import { LivskompassMark } from '../ui/LivskompassMark';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

function isItemActive(item: DrawerNavItem, pathname: string, search: string): boolean {
  const [itemPath, itemSearch = ''] = item.path.split('?');
  if (pathname !== itemPath) return false;
  if (!itemSearch) return true;
  return search.includes(itemSearch.replace('tab=', 'tab='));
}

export function NavigationDrawer({ open, onClose, onOpenSettings }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('nav-drawer-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('nav-drawer-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    onClose();
  }, [location.pathname, location.search, onClose]);

  if (!open) return null;

  const go = (item: DrawerNavItem) => {
    if (item.id === 'installningar') {
      onOpenSettings?.();
      onClose();
      return;
    }
    const [path, search] = item.path.split('?');
    navigate({ pathname: path, search: search ? `?${search}` : '' });
    onClose();
  };

  return createPortal(
    <>
      <button
        type="button"
        className="nav-drawer__backdrop"
        aria-label="Stäng meny"
        onClick={onClose}
      />
      <aside
        className="nav-drawer"
        role="dialog"
        aria-label="Huvudmeny"
        aria-modal="true"
      >
        <div className="nav-drawer__scenic" aria-hidden />
        <div className="nav-drawer__header">
          <button
            type="button"
            className="nav-drawer__close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <div className="nav-drawer__brand">
            <LivskompassMark className="nav-drawer__mark" />
            <span className="nav-drawer__title">LIVSKOMPASSEN</span>
            <div className="nav-drawer__ornament" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <nav className="nav-drawer__list">
          {DRAWER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item, location.pathname, location.search);
            return (
              <button
                key={item.id}
                type="button"
                className={clsx('nav-drawer__row', active && 'nav-drawer__row--active')}
                onClick={() => go(item)}
              >
                <span className="nav-drawer__row-icon" aria-hidden>
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="nav-drawer__row-label">{item.label}</span>
                <ChevronRight className="nav-drawer__row-chevron" strokeWidth={1.5} aria-hidden />
              </button>
            );
          })}
        </nav>

      </aside>
    </>,
    document.body,
  );
}
