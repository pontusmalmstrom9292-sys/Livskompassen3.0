import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Filter, Lock, Shield, Wind, Zap } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenShortcutMicIcon } from '../ui/widget-icons';
import {
  DEFAULT_BREATHING_EXERCISE_ID,
  getBreathingExercise,
} from '../ui/ankare/breathingExercises';
import { useBreathingCycle } from '../ui/ankare/useBreathingCycle';

const HIDDEN_STORAGE_KEY = 'livskompassen.fyren-side-quick.hidden';
const VISIBILITY_EVENT = 'fyren-side-quick-visibility';

type QuickAction = {
  id: string;
  label: string;
  to: string;
  icon: 'mic' | 'filter' | 'zap' | 'shield';
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'voice-vault', label: 'Röst till Valv', to: '/widget/voice-vault', icon: 'mic' },
  { id: 'brusfiltret', label: 'Brusfiltret', to: '/widget/hamn', icon: 'filter' },
  { id: 'snabbanteckning', label: 'Snabbanteckning', to: '/widget/anteckning', icon: 'zap' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, icon: 'shield' },
];

type FyrenHeaderQuickContextValue = {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  hidden: boolean;
  hideDock: () => void;
  breathingActive: boolean;
  setBreathingActive: (value: boolean) => void;
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

function FyrenQuickBreathingStrip({
  active,
  onActiveChange,
}: {
  active: boolean;
  onActiveChange: (value: boolean) => void;
}) {
  const exercise = getBreathingExercise(DEFAULT_BREATHING_EXERCISE_ID);
  const { activeDuration, activeText, visual } = useBreathingCycle(exercise, active);

  return (
    <section className="fyren-header-quick__breathing" aria-label="Andningsövning">
      <div className="fyren-header-quick__breathing-stage">
        <div
          className="fyren-header-quick__breathing-ring"
          style={{
            transform: `scale(${visual.ringScale})`,
            opacity: visual.ringOpacity,
            transitionDuration: `${activeDuration}ms`,
          }}
          aria-hidden
        />
        <div
          className="fyren-header-quick__breathing-glow"
          style={{
            transform: `scale(${visual.bgScale})`,
            opacity: visual.bgOpacity,
            transitionDuration: `${activeDuration}ms`,
          }}
          aria-hidden
        />
        <button
          type="button"
          className={clsx(
            'fyren-header-quick__breathing-btn',
            active && 'fyren-header-quick__breathing-btn--active',
          )}
          aria-pressed={active}
          aria-label={active ? 'Stoppa andningsövning' : 'Starta andningsövning'}
          onClick={() => onActiveChange(!active)}
        >
          <Wind className="fyren-header-quick__breathing-icon" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <div className="fyren-header-quick__breathing-copy">
        <p className="fyren-header-quick__breathing-title">
          {active ? activeText || 'Andas…' : 'Andning'}
        </p>
        <p className="fyren-header-quick__breathing-hint">
          {active ? 'Följ rytmen. Du är trygg.' : 'Box breathing — ett tryckt steg i taget.'}
        </p>
      </div>
    </section>
  );
}

function FyrenHeaderQuickPanel() {
  const location = useLocation();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const { open, setOpen, hideDock, breathingActive, setBreathingActive } = useFyrenHeaderQuick();

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fyren-header-quick__backdrop"
          aria-label="Stäng snabbåtkomst"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={clsx('fyren-header-quick', open && 'fyren-header-quick--open')}
        aria-label="Snabbåtkomst"
        aria-hidden={!open}
      >
        <div className="fyren-header-quick__panel">
          <FyrenQuickBreathingStrip active={breathingActive} onActiveChange={setBreathingActive} />

          <nav className="fyren-header-quick__grid">
            {QUICK_ACTIONS.map((action) => {
              const label =
                action.id === 'valv' && !vaultSessionOpen ? 'Lås upp' : action.label;
              return (
                <Link
                  key={action.id}
                  to={action.to}
                  className="fyren-header-quick__cell"
                  aria-label={label}
                  onClick={() => setOpen(false)}
                >
                  <span className="fyren-header-quick__icon-shell">
                    <QuickActionIcon kind={action.icon} />
                  </span>
                  <span className="fyren-header-quick__cell-label">{label}</span>
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
            <span>Snabbåtkomst dold</span>
          </button>
        </div>
      </div>
    </>
  );
}

/** Header-kompass + nedfällbar snabbpanel (ersätter sidodock + SOS-knapp). */
export function FyrenHeaderQuickProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
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

  const value: FyrenHeaderQuickContextValue = {
    open,
    setOpen,
    hidden,
    hideDock,
    breathingActive,
    setBreathingActive,
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
  const { open, setOpen, hidden } = useFyrenHeaderQuick();

  if (hidden || location.pathname.startsWith('/widget')) return null;

  return (
    <button
      type="button"
      className={clsx(
        'header-chrome-btn header-chrome-btn--round mr-1 fyren-header-quick__toggle',
        open && 'fyren-header-quick__toggle--open',
      )}
      aria-expanded={open}
      aria-label={open ? 'Stäng snabbåtkomst' : 'Öppna snabbåtkomst'}
      onClick={() => setOpen((value) => !value)}
    >
      <LivskompassMark className="fyren-header-quick__toggle-mark" />
    </button>
  );
}

/** @deprecated Sidodock borttaget — använd FyrenHeaderQuickProvider + Toggle. */
export function FyrenSideQuickDock() {
  return null;
}
