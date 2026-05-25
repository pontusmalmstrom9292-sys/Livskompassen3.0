import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { DRAWER_NAV_ITEMS, type DrawerNavItem } from '../navigation/drawerNav';
import { LivskompassMark } from '../ui/LivskompassMark';
import { DrawerHomeQuickActions } from '../components/DrawerHomeQuickActions';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const SWIPE_CLOSE_THRESHOLD_PX = 56;

function isItemActive(item: DrawerNavItem, pathname: string, search: string): boolean {
  const qIndex = item.path.indexOf('?');
  const itemPath = qIndex >= 0 ? item.path.slice(0, qIndex) : item.path;
  const itemQuery = qIndex >= 0 ? item.path.slice(qIndex + 1) : '';
  if (pathname !== itemPath) return false;
  if (!itemQuery) return pathname === itemPath;
  const current = new URLSearchParams(search.replace(/^\?/, ''));
  const expected = new URLSearchParams(itemQuery);
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

export function NavigationDrawer({ open, onClose, onOpenSettings }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef(0);

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

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    const delta = clientX - touchStartX.current;
    if (delta < -SWIPE_CLOSE_THRESHOLD_PX) onClose();
  };

  if (!open) return null;

  const isHome = location.pathname === '/';

  const go = (item: DrawerNavItem) => {
    if (item.id === 'installningar') {
      onOpenSettings?.();
      onClose();
      return;
    }
    const qIndex = item.path.indexOf('?');
    const path = qIndex >= 0 ? item.path.slice(0, qIndex) : item.path;
    const search = qIndex >= 0 ? `?${item.path.slice(qIndex + 1)}` : '';
    navigate({ pathname: path, search });
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
        onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
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

        {isHome ? <DrawerHomeQuickActions onNavigate={onClose} /> : null}

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
