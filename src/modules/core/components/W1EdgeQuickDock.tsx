import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { W1KompaktProjektRail } from '@/features/widgets/components/W1KompaktProjektRail';
import { ExecutiveDecorCompass } from '../ui/executive/ExecutiveDecorCompass';
import { readFyrenSideQuickHidden } from './FyrenSideQuickDock';
import './W1EdgeQuickDock.css';

/** W1 — kompass-flik höger kant (Executive). Expanderar → kompakt projekt-strip. */
export function W1EdgeQuickDock() {
  const location = useLocation();
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
      className={clsx('w1-edge-quick-dock', open && 'w1-edge-quick-dock--open')}
      aria-label="W1 snabbåtkomst"
    >
      <div className="w1-edge-quick-dock__panel" aria-hidden={!open}>
        <W1KompaktProjektRail
          variant="edge"
          onNavigate={() => setOpen(false)}
        />
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
