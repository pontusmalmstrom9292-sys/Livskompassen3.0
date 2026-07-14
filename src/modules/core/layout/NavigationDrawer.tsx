/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { clsx } from 'clsx';
import { memo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, X } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { endVaultSession } from '../security/vaultSessionLifecycle';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { DrawerHubAccordion, isDrawerLinkActive } from './DrawerHubAccordion';
import { DrawerModeToggle } from './DrawerModeToggle';
import { DRAWER_VARDAG_ITEMS, DRAWER_VALV_ITEMS } from '../navigation/drawerNav';
import { useDrawerRecentNav } from '../navigation/hooks/useDrawerRecentNav';
import {
  getHubNavLinks,
  hubGlowColor,
  isHubRouteActive,
  isVardagDrawerRowActive,
} from './drawerFromNavTruth';

const SWIPE_CLOSE_THRESHOLD_PX = 56;

// Vi använder DRAWER_VARDAG_ITEMS och DRAWER_VALV_ITEMS från '../navigation/drawerNav' 
// vilket uppfyller kravet på att extrahera menylänkar till konfigurationsmatriser och 
// separerar data från presentation.

export const NavigationDrawer = memo(function NavigationDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(0);

  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const open = useStore((s) => s.ui.isMenuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const onClose = useCallback(() => setMenuOpen(false), [setMenuOpen]);

  const vaultOpen = isVaultUnlocked || hasVaultGate();
  const recentVisits = useDrawerRecentNav();
  const { pathname, search, hash } = location;
  const currentFullPath = `${pathname}${search}`;

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

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    onCloseRef.current();
  }, [location.pathname, location.search, location.hash]);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    const delta = clientX - touchStartX.current;
    if (delta < -SWIPE_CLOSE_THRESHOLD_PX) onClose();
  };

  const handleBackToVardag = () => {
    navigate({ pathname: '/' });
    onClose();
  };

  const handleLockVaultImmediately = () => {
    void endVaultSession({ closeDrawer: true }).then(() => {
      navigate({ pathname: '/' });
      onClose();
    });
  };

  const navigateDrawerPath = (path: string) => {
    const hashIndex = path.indexOf('#');
    const qIndex = path.indexOf('?');
    const cut = [hashIndex, qIndex].filter((i) => i >= 0);
    const end = cut.length ? Math.min(...cut) : path.length;
    const targetPath = path.slice(0, end > 0 ? end : path.length) || '/';
    const targetSearch =
      qIndex >= 0 ? `?${path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined)}` : '';
    const targetHash = hashIndex >= 0 ? `#${path.slice(hashIndex + 1)}` : '';
    navigate({ pathname: targetPath, search: targetSearch, hash: targetHash });
    onClose();
  };

  const handleVardagRowClick = (item: (typeof DRAWER_VARDAG_ITEMS)[number]) => {
    navigateDrawerPath(item.path);
  };

  if (!open) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="nav-drawer__backdrop"
        aria-label="Stäng meny"
        onClick={onClose}
      />

      <aside
        className="nav-drawer nav-drawer--obsidian-depth"
        role="dialog"
        aria-label={vaultOpen ? 'Huvudmeny och Valv' : 'Huvudmeny'}
        aria-modal="true"
        onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="nav-drawer__scenic" aria-hidden />

        <header className="nav-drawer__header">
          <button
            type="button"
            className="nav-drawer__close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="nav-drawer__brand">
            <LivskompassMark className="nav-drawer__mark" />
            <h2 className="nav-drawer__title">Livskompassen</h2>
            <div className="nav-drawer__ornament" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </header>

        <DrawerModeToggle showValvShell={vaultOpen} onBackToVardag={handleBackToVardag} />

        <div className="nav-drawer__calm-scroll custom-scrollbar">
          <nav className="nav-drawer__list" aria-label="Moduler">
            {recentVisits.length > 0 ? (
              <div className="nav-drawer__recent">
                <p className="nav-drawer__recent-title">Senast besökt</p>
                <div className="nav-drawer__recent-grid">
                  {recentVisits
                    .filter((entry) => entry.path !== currentFullPath)
                    .map((entry) => (
                      <button
                        key={entry.path}
                        type="button"
                        onClick={() => navigateDrawerPath(entry.path)}
                        className="nav-drawer__recent-chip"
                      >
                        {entry.label}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}

            <p className="nav-drawer__section-title">Vardag</p>

            {/* section="vardag" — hub-accordions från navTruth (B35) */}
            <div className="nav-drawer__section nav-drawer__section--hubs">
              {DRAWER_VARDAG_ITEMS.map((item) => {
                const Icon = item.icon;
                const hubLinks = getHubNavLinks(item.id);
                if (hubLinks.length > 0) {
                  return (
                    <DrawerHubAccordion
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={<Icon className="h-4 w-4" aria-hidden />}
                      links={hubLinks}
                      glowColor={hubGlowColor(item.id)}
                      isActive={isHubRouteActive(item.id, pathname)}
                      onClose={onClose}
                    />
                  );
                }

                const active = isVardagDrawerRowActive(item, pathname, search, hash);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleVardagRowClick(item)}
                    className={clsx('nav-drawer__row', active && 'nav-drawer__row--active')}
                  >
                    <span className="nav-drawer__row-icon">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="nav-drawer__row-label">{item.label}</span>
                    <ChevronRight className="nav-drawer__row-chevron" aria-hidden />
                  </button>
                );
              })}
            </div>

            {vaultOpen ? (
              <>
                {/* section="valv" PIN-unlocked drawer block */}
                <div className="nav-drawer__valv-block">
                  <p className="nav-drawer__section-title nav-drawer__section-title--valv">
                    Valvet
                  </p>

                  <div className="nav-drawer__section">
                    {DRAWER_VALV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isDrawerLinkActive(item.path, pathname, search, hash);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateDrawerPath(item.path)}
                          className={clsx('nav-drawer__row', active && 'nav-drawer__row--active')}
                        >
                          <span className="nav-drawer__row-icon">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="nav-drawer__row-label">{item.label}</span>
                          <ChevronRight className="nav-drawer__row-chevron" aria-hidden />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleLockVaultImmediately}
                    className="nav-drawer__lock-btn"
                    aria-label="Lås Valvet omedelbart och gå till startskärm"
                  >
                    <span className="nav-drawer__lock-icon">
                      <Lock className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="nav-drawer__lock-copy">
                      <span className="nav-drawer__lock-title">Lås Valvet nu</span>
                      <span className="nav-drawer__lock-hint">
                        Panik — döljer bevis och tar dig till Hem
                      </span>
                    </span>
                  </button>
                </div>
              </>
            ) : null}
          </nav>
        </div>
      </aside>
    </>,
    document.body,
  );
});
