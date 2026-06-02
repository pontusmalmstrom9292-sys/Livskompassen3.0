import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Settings, Shield, Home, Sprout, Users, Lock } from 'lucide-react';
import { clearAllVaultZones, hasVaultGate } from '../auth/sessionService';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { DrawerHubAccordion } from './DrawerHubAccordion';
import { DrawerModeToggle } from './DrawerModeToggle';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const SWIPE_CLOSE_THRESHOLD_PX = 56;

const VALV_QUICK_LINKS = [
  { label: 'Logga & spara', path: '/dagbok?tab=bevis&vaultTab=logga' },
  { label: 'Sök i arkivet', path: '/dagbok?tab=bevis&vaultTab=sok' },
  { label: 'Mönster & Orkester', path: '/dagbok?tab=bevis&vaultTab=monster' },
  { label: 'Kunskapsbank', path: '/dagbok?tab=bevis&vaultTab=kunskapsbank' },
  { label: 'Aktörskarta', path: '/dagbok?tab=bevis&vaultTab=aktorskarta' },
  { label: 'Dossier-export', path: '/dagbok?tab=bevis&vaultTab=dossier' },
] as const;

export function NavigationDrawer({ open, onClose, onOpenSettings }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(0);

  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const setActiveDrawer = useStore((s) => s.setActiveDrawer);

  const vaultOpen = isVaultUnlocked || hasVaultGate();
  const pathname = location.pathname;

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

  /** Panik — lås Valv omedelbart och lämna känslig vy (Zero Footprint-liknande). */
  const handleLockVaultImmediately = () => {
    setVaultUnlocked(false);
    setActiveDrawer(null);
    clearAllVaultZones();
    navigate({ pathname: '/' });
    onClose();
  };

  if (!open) return null;

  const isFamiljRoute =
    pathname === '/familjen' ||
    pathname === '/familj' ||
    pathname === '/hamn' ||
    pathname === '/barnen';

  const isValvRoute =
    pathname.startsWith('/dagbok') ||
    pathname.startsWith('/dossier') ||
    pathname.startsWith('/valv');

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
            <p className="mt-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">
              Vardag &amp; Liv
            </p>

            <DrawerHubAccordion
              id="hem"
              label="Hem & Skriv"
              icon={<Home className="h-4 w-4" />}
              glowColor="gold"
              isActive={pathname === '/'}
              links={[
                { label: 'Startskärm', path: '/' },
                { label: 'Snabb-inkast', path: '/#inkast' },
              ]}
              onClose={onClose}
            />

            <DrawerHubAccordion
              id="vardagen"
              label="Liv & Göra"
              icon={<Sprout className="h-4 w-4" />}
              glowColor="gold"
              isActive={
                pathname === '/vardagen' || pathname === '/liv' || pathname === '/planering'
              }
              links={[
                { label: 'Mina Kompasser', path: '/vardagen?tab=kompasser' },
                { label: 'Ekonomi & Mål', path: '/vardagen?tab=ekonomi' },
                { label: 'Tid & Stämpel', path: '/vardagen?tab=tidrapportering' },
                { label: 'Planering (Kanban)', path: '/planering' },
                { label: 'Projekt', path: '/projekt' },
              ]}
              onClose={onClose}
            />

            <DrawerHubAccordion
              id="familjen"
              label="Familj & Gränser"
              icon={<Users className="h-4 w-4" />}
              glowColor="blue"
              isActive={isFamiljRoute}
              links={[
                { label: 'Dagens Barnfokus', path: '/familjen?tab=reflektion' },
                { label: 'Livslogg (Barnen)', path: '/familjen?tab=livslogg' },
                { label: 'Trygg Hamn (BIFF)', path: '/familjen?tab=hamn' },
                { label: 'Drogfrihet', path: '/familjen?tab=drogfrihet' },
              ]}
              onClose={onClose}
            />

            {vaultOpen ? (
              <div className="mt-6 border-t border-border/15 pt-4">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/90">
                  Verklighetsvalvet
                </p>

                <DrawerHubAccordion
                  id="valv"
                  label="Bevis & Sanning"
                  icon={<Shield className="h-4 w-4 text-indigo-300" />}
                  glowColor="blue"
                  isActive={isValvRoute}
                  links={[...VALV_QUICK_LINKS]}
                  onClose={onClose}
                />

                <button
                  type="button"
                  onClick={handleLockVaultImmediately}
                  className="mx-1 mt-3 flex w-full items-center gap-3 rounded-xl border border-danger/35 bg-danger/10 px-4 py-3.5 text-left transition-colors hover:bg-danger/15"
                  aria-label="Lås Verklighetsvalvet omedelbart och gå till startskärm"
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
