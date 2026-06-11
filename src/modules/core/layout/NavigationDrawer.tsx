import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Settings, Lock } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { endVaultSession } from '../security/vaultSessionLifecycle';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { DrawerHubAccordion, isDrawerLinkActive } from './DrawerHubAccordion';
import { DrawerModeToggle } from './DrawerModeToggle';
import { DRAWER_VALV_ITEMS } from '../navigation/drawerNav';
import { useDrawerRecentNav } from '../navigation/hooks/useDrawerRecentNav';
import {
  drawerItemById,
  getHubNavLinks,
  getVardagDrawerHubs,
  hubGlowColor,
  isHubRouteActive,
} from './drawerFromNavTruth';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const SWIPE_CLOSE_THRESHOLD_PX = 56;

export function NavigationDrawer({ open, onClose, onOpenSettings }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(0);

  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);

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

  if (!open) return null;

  const vardagHubs = getVardagDrawerHubs();

  return createPortal(
    <>
      <button
        type="button"
        className="nav-drawer__backdrop"
        aria-label="Stäng meny"
        onClick={onClose}
      />

      <aside
        className="nav-drawer nav-drawer--calm-2"
        role="dialog"
        aria-label={vaultOpen ? 'Huvudmeny och Valv' : 'Huvudmeny'}
        aria-modal="true"
        onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="nav-drawer__scenic" aria-hidden />

        <div className="nav-drawer__calm-header flex items-center justify-between border-b border-border/15 bg-surface-2/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <LivskompassMark className="h-7 w-7 text-accent" />
            <h2 className="font-display-serif text-base tracking-[0.22em] text-text">MENY</h2>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-text-dim transition-colors hover:bg-surface-3/50 hover:text-text"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <DrawerModeToggle showValvShell={vaultOpen} onBackToVardag={handleBackToVardag} />

        <div className="nav-drawer__calm-scroll custom-scrollbar flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3" aria-label="Moduler">
            {recentVisits.length > 0 ? (
              <div className="mb-3">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">
                  Senast besökt
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {recentVisits
                    .filter((entry) => entry.path !== currentFullPath)
                    .map((entry) => (
                      <button
                        key={entry.path}
                        type="button"
                        onClick={() => navigateDrawerPath(entry.path)}
                        className="rounded-full border border-border/30 bg-surface-2/50 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/40 hover:bg-surface-3 hover:text-text"
                      >
                        {entry.label}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}

            {/* section="vardag" */}
            <p className="mt-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">
              Vardag
            </p>

            {vardagHubs.map((hub) => {
              const item = drawerItemById(hub.id, 'vardag');
              const Icon = item?.icon;
              const links = getHubNavLinks(hub.id);
              if (!Icon || links.length === 0) return null;

              return (
                <DrawerHubAccordion
                  key={hub.id}
                  id={hub.id}
                  label={hub.label}
                  icon={<Icon className="h-4 w-4" />}
                  glowColor={hubGlowColor(hub.id)}
                  isActive={isHubRouteActive(hub.id, pathname)}
                  links={links}
                  onClose={onClose}
                />
              );
            })}

            {vaultOpen ? (
              <div className="mt-6 border-t border-border/15 pt-4">
                {/* section="valv" */}
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">
                  Valvet
                </p>

                <div className="space-y-1">
                  {DRAWER_VALV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isDrawerLinkActive(item.path, pathname, search, hash);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateDrawerPath(item.path)}
                        className={`nav-drawer__row flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                          active
                            ? 'bg-accent/10 text-accent'
                            : 'text-text-muted hover:bg-surface-2/50 hover:text-text'
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-surface-2/40">
                          <Icon className="h-4 w-4 text-accent" />
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleLockVaultImmediately}
                  className="mx-1 mt-3 flex w-full items-center gap-3 rounded-xl border border-danger/35 bg-danger/10 px-4 py-3.5 text-left transition-colors hover:bg-danger/15"
                  aria-label="Lås Valvet omedelbart och gå till startskärm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-danger/30 bg-danger/5 text-danger">
                    <Lock className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-danger">Lås Valvet nu</span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-text-muted">
                      Panik — döljer bevis och tar dig till Hem
                    </span>
                  </span>
                </button>
              </div>
            ) : null}
          </nav>
        </div>

        <div className="border-t border-border/15 bg-surface-2/40 p-4 backdrop-blur-md">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-text-muted transition-colors hover:bg-surface-3/60 hover:text-text"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else navigate('/installningar');
              onClose();
            }}
          >
            <Settings className="h-4 w-4" aria-hidden />
            <span>Inställningar &amp; konto</span>
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
}
