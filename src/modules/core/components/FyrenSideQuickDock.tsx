import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Filter, Lock, Shield, Zap } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenShortcutMicIcon } from '../ui/widget-icons';

const HIDDEN_STORAGE_KEY = 'livskompassen.fyren-side-quick.hidden';

type SideQuickAction = {
  id: string;
  label: string;
  to: string;
  icon: 'mic' | 'filter' | 'zap' | 'shield';
};

const SIDE_QUICK_ACTIONS: SideQuickAction[] = [
  { id: 'voice-vault', label: 'Röst till Valv', to: '/widget/voice-vault', icon: 'mic' },
  { id: 'brusfiltret', label: 'Brusfiltret', to: '/widget/hamn', icon: 'filter' },
  { id: 'snabbanteckning', label: 'Snabbanteckning', to: '/widget/anteckning', icon: 'zap' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, icon: 'shield' },
];

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
  window.dispatchEvent(new CustomEvent('fyren-side-quick-visibility'));
}

function SideQuickIcon({ kind }: { kind: SideQuickAction['icon'] }) {
  const shell = 'fyren-side-quick__glyph';
  if (kind === 'mic') return <FyrenShortcutMicIcon className={shell} />;
  if (kind === 'filter') return <Filter className={shell} strokeWidth={1.75} aria-hidden />;
  if (kind === 'zap') return <Zap className={shell} strokeWidth={1.75} aria-hidden />;
  return <Shield className={shell} strokeWidth={1.75} aria-hidden />;
}

/** Höger sidodock — kompass-pebble, vertikal panel (mockup I-stone). */
export function FyrenSideQuickDock() {
  const location = useLocation();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(readFyrenSideQuickHidden);

  const syncHidden = useCallback(() => {
    setHidden(readFyrenSideQuickHidden());
  }, []);

  useEffect(() => {
    window.addEventListener('fyren-side-quick-visibility', syncHidden);
    return () => window.removeEventListener('fyren-side-quick-visibility', syncHidden);
  }, [syncHidden]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/widget') || hidden) return null;

  return (
    <aside
      className={clsx('fyren-side-quick', open && 'fyren-side-quick--open')}
      aria-label="Snabbåtkomst"
    >
      <div className="fyren-side-quick__drawer" aria-hidden={!open}>
        <nav className="fyren-side-quick__stack">
          {SIDE_QUICK_ACTIONS.map((action) => {
            const label =
              action.id === 'valv' && !vaultSessionOpen ? 'Lås upp' : action.label;
            return (
              <Link
                key={action.id}
                to={action.to}
                className="fyren-side-quick__row"
                aria-label={label}
                onClick={() => setOpen(false)}
              >
                <span className="fyren-side-quick__icon-shell">
                  <SideQuickIcon kind={action.icon} />
                </span>
                <span className="fyren-side-quick__row-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="fyren-side-quick__hide"
          onClick={() => {
            setOpen(false);
            setFyrenSideQuickHidden(true);
          }}
        >
          <Lock className="fyren-side-quick__hide-icon" strokeWidth={1.75} aria-hidden />
          <span>Snabbåtkomst dold</span>
        </button>
      </div>

      <button
        type="button"
        className="fyren-side-quick__toggle"
        aria-expanded={open}
        aria-label={open ? 'Stäng snabbåtkomst' : 'Öppna snabbåtkomst'}
        onClick={() => setOpen((value) => !value)}
      >
        <LivskompassMark className="fyren-side-quick__toggle-mark" />
      </button>
    </aside>
  );
}
