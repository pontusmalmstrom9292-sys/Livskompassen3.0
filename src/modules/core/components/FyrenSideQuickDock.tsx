import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { ChevronDown, Filter, Lock, Shield, Wind, Zap } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { useFyrenHeaderQuickAnchor } from '../hooks/useFyrenHeaderQuickAnchor';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { ExecutiveDecorCompass } from '../ui/executive';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenShortcutMicIcon } from '../ui/widget-icons';
import {
  DEFAULT_BREATHING_EXERCISE_ID,
  getBreathingExercise,
} from '../ui/ankare/breathingExercises';
import { useBreathingCycle } from '../ui/ankare/useBreathingCycle';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import './FyrenHeaderQuick.css';

const HIDDEN_STORAGE_KEY = 'livskompassen.fyren-side-quick.hidden';
const VISIBILITY_EVENT = 'fyren-side-quick-visibility';

const CAMO_SURFACE_SELECTOR =
  '[data-surface], .home-action-hub__glass, .rounded-2xl.border, .bento-tile, main .rounded-2xl';

function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  return !(a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);
}

function detectOverContent(panel: HTMLElement): boolean {
  const panelRect = panel.getBoundingClientRect();
  if (panelRect.height < 8) return false;

  const surfaces = document.querySelectorAll(CAMO_SURFACE_SELECTOR);
  for (const el of Array.from(surfaces)) {
    if (!(el instanceof HTMLElement) || el.contains(panel)) continue;
    if (rectsOverlap(panelRect, el.getBoundingClientRect())) return true;
  }
  return false;
}

type QuickAction = {
  id: string;
  label: string;
  to: string;
  icon: 'mic' | 'filter' | 'zap' | 'shield';
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'dagbok', label: 'Dagbok', to: '/widget/snabbval', icon: 'zap' },
  { id: 'snabbanteckning', label: 'Bevis-rad', to: '/widget/anteckning', icon: 'zap' },
  { id: 'barnobs', label: 'Barnobs', to: '/widget/familjen', icon: 'zap' },
  { id: 'voice-vault', label: 'Bevis-röst', to: '/widget/voice-vault', icon: 'mic' },
  { id: 'brusfiltret', label: 'Hamn', to: '/widget/hamn', icon: 'filter' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, icon: 'shield' },
];

type FyrenHeaderQuickContextValue = {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  hidden: boolean;
  hideDock: () => void;
  breathingActive: boolean;
  setBreathingActive: (value: boolean) => void;
  toggleBtnRef: RefObject<HTMLButtonElement | null>;
  toggleWrapRef: RefObject<HTMLDivElement | null>;
};

const FyrenHeaderQuickContext = createContext<FyrenHeaderQuickContextValue | null>(null);

function useFyrenHeaderQuick(): FyrenHeaderQuickContextValue {
  const ctx = useContext(FyrenHeaderQuickContext);
  if (!ctx) {
    throw new Error('FyrenHeaderQuick must be used within FyrenHeaderQuickProvider');
  }
  return ctx;
}

export function readFyrenSideQuickHidden(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(HIDDEN_STORAGE_KEY) === '1';
}

export function setFyrenSideQuickHidden(hidden: boolean): void {
  if (typeof window === 'undefined') return;
  if (hidden) {
    window.localStorage.setItem(HIDDEN_STORAGE_KEY, '1');
  } else {
    window.localStorage.removeItem(HIDDEN_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(VISIBILITY_EVENT));
}

function QuickActionIcon({ kind }: { kind: QuickAction['icon'] }) {
  const shell = 'fyren-header-quick__glyph';
  if (kind === 'mic') return <FyrenShortcutMicIcon className={shell} />;
  if (kind === 'filter') return <Filter className={shell} strokeWidth={1.75} aria-hidden />;
  if (kind === 'zap') return <Zap className={shell} strokeWidth={1.75} aria-hidden />;
  return <Shield className={shell} strokeWidth={1.75} aria-hidden />;
}

function FyrenQuickBreathingRow({
  active,
  onActiveChange,
}: {
  active: boolean;
  onActiveChange: (value: boolean) => void;
}) {
  const exercise = getBreathingExercise(DEFAULT_BREATHING_EXERCISE_ID);
  const { activeDuration, activeText, visual } = useBreathingCycle(exercise, active);
  const label = active ? activeText.split(' (')[0] || 'Andas…' : 'Andning';

  return (
    <button
      type="button"
      className="fyren-header-quick__row"
      aria-pressed={active}
      aria-label={active ? 'Stoppa andningsövning' : 'Starta andningsövning'}
      onClick={() => onActiveChange(!active)}
    >
      <span
        className={clsx(
          'fyren-header-quick__icon-shell fyren-header-quick__icon-shell--breathing',
          active && 'fyren-header-quick__icon-shell--breathing-active',
        )}
      >
        <div
          className="fyren-header-quick__breathing-ring"
          style={{
            transform: `scale(${visual.ringScale})`,
            opacity: visual.ringOpacity,
            transitionDuration: `${activeDuration}ms`,
          }}
          aria-hidden
        />
        <Wind className="fyren-header-quick__glyph" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="fyren-header-quick__row-label sr-only">{label}</span>
    </button>
  );
}

function FyrenQuickDagensFokus() {
  const { tasks } = usePlanningTasks();
  const activeTask = tasks.find(t => t.status === 'todo' || t.status === 'waiting');

  if (!activeTask) return null;

  return (
    <div className="fyren-header-quick__row !flex-col !items-start !h-auto px-4 py-3 gap-1.5 border-b border-white/5 bg-accent/5">
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent/80">
          Dagens Fokus
        </span>
      </div>
      <p className="text-sm font-medium leading-snug text-white/90 line-clamp-2">
        {activeTask.title}
      </p>
    </div>
  );
}

function FyrenHeaderQuickPanel() {
  const location = useLocation();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const { open, setOpen, hideDock, breathingActive, setBreathingActive, toggleBtnRef } =
    useFyrenHeaderQuick();
  const panelRef = useRef<HTMLDivElement>(null);
  const anchor = useFyrenHeaderQuickAnchor(toggleBtnRef, panelRef, open);
  const [overContent, setOverContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !panelRef.current) {
      setOverContent(false);
      return;
    }

    const panel = panelRef.current;
    const sync = () => setOverContent(detectOverContent(panel));

    sync();
    const id = requestAnimationFrame(sync);
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('scroll', sync, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', sync, true);
    };
  }, [open, location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (location.pathname.startsWith('/widget') || !mounted) return null;

  const portal = (
    <>
      {open ? (
        <button
          type="button"
          className="fyren-header-quick__dismiss"
          aria-label="Stäng snabbåtkomst"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        ref={panelRef}
        className={clsx(
          'fyren-header-quick',
          open && 'fyren-header-quick--open',
          overContent && 'fyren-header-quick--over-content',
        )}
        style={anchor.style}
        aria-label="Snabbåtkomst"
        aria-hidden={!open}
      >
        <div className="fyren-header-quick__panel fyren-header-quick__panel--camo">
          <nav className="fyren-header-quick__stack">
            <FyrenQuickDagensFokus />
            <FyrenQuickBreathingRow
              active={breathingActive}
              onActiveChange={setBreathingActive}
            />
            {QUICK_ACTIONS.map((action) => {
              const label =
                action.id === 'valv' && !vaultSessionOpen ? 'Lås upp' : action.label;
              return (
                <Link
                  key={action.id}
                  to={action.to}
                  className="fyren-header-quick__row"
                  aria-label={label}
                  onClick={() => setOpen(false)}
                >
                  <span className="fyren-header-quick__icon-shell">
                    <QuickActionIcon kind={action.icon} />
                  </span>
                  <span className="fyren-header-quick__row-label sr-only">{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="fyren-header-quick__hide"
            onClick={() => {
              setBreathingActive(false);
              setOpen(false);
              hideDock();
            }}
          >
            <Lock className="fyren-header-quick__hide-icon" strokeWidth={1.75} aria-hidden />
            <span className="sr-only">Dölj snabbåtkomst</span>
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(portal, document.body);
}

/** Header-kompass + nedfällbar snabbpanel (ersätter sidodock + SOS-knapp). */
export function FyrenHeaderQuickProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const toggleWrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(readFyrenSideQuickHidden);
  const [breathingActive, setBreathingActive] = useState(false);

  const syncHidden = useCallback(() => {
    setHidden(readFyrenSideQuickHidden());
  }, []);

  const hideDock = useCallback(() => {
    setFyrenSideQuickHidden(true);
    setHidden(true);
  }, []);

  useEffect(() => {
    window.addEventListener(VISIBILITY_EVENT, syncHidden);
    return () => window.removeEventListener(VISIBILITY_EVENT, syncHidden);
  }, [syncHidden]);

  useEffect(() => {
    setOpen(false);
    setBreathingActive(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('fyren-header-quick-open', open);
    return () => document.body.classList.remove('fyren-header-quick-open');
  }, [open]);

  const value: FyrenHeaderQuickContextValue = {
    open,
    setOpen,
    hidden,
    hideDock,
    breathingActive,
    setBreathingActive,
    toggleBtnRef,
    toggleWrapRef,
  };

  return (
    <FyrenHeaderQuickContext.Provider value={value}>
      {children}
      {!hidden ? <FyrenHeaderQuickPanel /> : null}
    </FyrenHeaderQuickContext.Provider>
  );
}

/** Kompassknapp i header — samma plats som tidigare SOS. */
export function FyrenHeaderQuickToggle() {
  const location = useLocation();
  const { themeId } = useTheme();
  const executive = isMidnightExecutiveTheme(themeId);
  const { open, setOpen, hidden, toggleBtnRef, toggleWrapRef } = useFyrenHeaderQuick();

  if (hidden || location.pathname.startsWith('/widget')) return null;

  return (
    <div
      ref={toggleWrapRef as Ref<HTMLDivElement>}
      className={clsx(
        'fyren-header-quick__toggle-wrap',
        executive && 'fyren-header-quick__toggle-wrap--executive',
        open && 'fyren-header-quick__toggle-wrap--open',
      )}
    >
      <button
        ref={toggleBtnRef as Ref<HTMLButtonElement>}
        type="button"
        className={clsx(
          'header-chrome-btn header-chrome-btn--round fyren-header-quick__toggle',
          executive && 'fyren-header-quick__toggle--executive',
          open && 'fyren-header-quick__toggle--open',
        )}
        aria-expanded={open}
        aria-label={open ? 'Stäng snabbåtkomst' : 'Öppna snabbåtkomst'}
        onClick={() => setOpen((value) => !value)}
      >
        {executive ? (
          <ExecutiveDecorCompass size="sm" className="fyren-header-quick__toggle-mark fyren-header-quick__toggle-mark--executive" />
        ) : (
          <LivskompassMark className="fyren-header-quick__toggle-mark" />
        )}
      </button>
      <ChevronDown className="fyren-header-quick__chevron" strokeWidth={2.25} aria-hidden />
    </div>
  );
}

/** @deprecated Sidodock borttaget — använd FyrenHeaderQuickProvider + Toggle. */
export function FyrenSideQuickDock() {
  return null;
}
