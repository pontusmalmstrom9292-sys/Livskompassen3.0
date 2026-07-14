import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { ExecutiveDecorCompass } from '../ui/executive/ExecutiveDecorCompass';
import { FyrenShortcutMicIcon, FyrenShortcutNoteIcon } from '../ui/widget-icons';
import { readFyrenSideQuickHidden } from './FyrenSideQuickDock';
import './W1EdgeQuickDock.css';

type EdgeAction = {
  id: string;
  label: string;
  to: string;
  icon: 'mic' | 'note' | 'shield';
};

const EDGE_ACTIONS: EdgeAction[] = [
  { id: 'rost', label: 'Röst', to: '/widget/inspelning?autostart=1', icon: 'mic' },
  { id: 'snabbanteckning', label: 'Snabbanteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, icon: 'shield' },
];

function EdgeActionIcon({ kind }: { kind: EdgeAction['icon'] }) {
  const shell = 'w1-edge-quick-dock__glyph';
  if (kind === 'mic') return <FyrenShortcutMicIcon className={shell} />;
  if (kind === 'note') return <FyrenShortcutNoteIcon className={shell} />;
  return <Shield className={shell} strokeWidth={1.75} aria-hidden />;
}

/** W1 — kompass-flik höger kant (Executive Midnight). Expanderar → Röst / Snabbanteckning / Valv. */
export function W1EdgeQuickDock() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(readFyrenSideQuickHidden);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();

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
      className={clsx('w1-edge-quick-dock', open && 'w1-edge-quick-dock--open')}
      aria-label="W1 snabbåtkomst"
    >
      <div className="w1-edge-quick-dock__panel" aria-hidden={!open}>
        <nav className="flex flex-col items-center gap-1">
          {EDGE_ACTIONS.map((action) => {
            const label =
              action.id === 'valv' && !vaultSessionOpen ? 'Lås upp' : action.label;
            return (
              <Link
                key={action.id}
                to={action.to}
                className="w1-edge-quick-dock__action"
                aria-label={label}
                onClick={() => setOpen(false)}
              >
                <span className="w1-edge-quick-dock__icon-shell">
                  <EdgeActionIcon kind={action.icon} />
                </span>
                <span className="w1-edge-quick-dock__label">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        className={clsx('w1-edge-quick-dock__tab', open && 'w1-edge-quick-dock__tab--open')}
        aria-expanded={open}
        aria-label={open ? 'Stäng W1 snabbåtkomst' : 'Öppna W1 snabbåtkomst'}
        onClick={() => setOpen((value) => !value)}
      >
        <ExecutiveDecorCompass size="sm" className="w1-edge-quick-dock__compass" />
      </button>
    </aside>
  );
}
