import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotebookPen, Users2, UtensilsCrossed, Library } from 'lucide-react';
import { openValvViaFyren } from '../../auth/valvFyrenGate';
import { NAV_PATHS } from '../../navigation/navTruth';
import { ResurserOverlay } from '../../navigation/ResurserOverlay';
import { useLongPress } from '../../hooks/useLongPress';
import { useStore } from '../../store';
import { BastaDesignDockCompass } from './BastaDesignDockCompass';

/** Figma-ref bottom dock — prod routes. */
export function BastaDesignDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const [resurserOpen, setResurserOpen] = useState(false);
  const { pathname, search } = location;
  const isHome = pathname === '/';
  const isFamiljen = pathname === NAV_PATHS.FAMILJEN || pathname.startsWith(`${NAV_PATHS.FAMILJEN}/`);
  const isAnteckning =
    pathname.startsWith('/widget/anteckning') ||
    pathname.startsWith('/hjartat') ||
    pathname.startsWith('/dagbok');
  const isEkonomi = pathname.startsWith('/vardagen') && search.includes('tab=ekonomi');

  const fyrenToValv = useCallback(
    () =>
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      }),
    [navigate, setSystemError],
  );

  const centerPress = useLongPress({
    onLongPress: fyrenToValv,
    onClick: () => {
      if (!isHome) navigate('/');
    },
    delayMs: 3000,
  });

  const { onClick: centerClick, ...centerHoldHandlers } = centerPress;

  return (
    <>
      <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
      <nav className="basta-design__dock basta-design__dock--prod" aria-label="Huvudnavigering">
        <div className="basta-design__dock-inner">
          <button
            type="button"
            className="basta-design__dock-item"
            onClick={() => navigate(`${NAV_PATHS.HJARTAT}?tab=reflektion`)}
            aria-current={isAnteckning ? 'page' : undefined}
          >
            <span style={{ color: isAnteckning ? 'var(--bd-accent)' : 'var(--bd-text-muted)' }}>
              <NotebookPen size={18} />
            </span>
            <span className={`basta-design__dock-label ${isAnteckning ? 'basta-design__dock-label--on' : ''}`}>
              ANTECKNINGAR
            </span>
          </button>

          <button
            type="button"
            className="basta-design__dock-item"
            onClick={() => navigate(NAV_PATHS.FAMILJEN)}
            aria-current={isFamiljen ? 'page' : undefined}
          >
            <span style={{ color: isFamiljen ? 'var(--bd-accent)' : 'var(--bd-text-muted)' }}>
              <Users2 size={18} />
            </span>
            <span className={`basta-design__dock-label ${isFamiljen ? 'basta-design__dock-label--on' : ''}`}>
              FAMILJ
            </span>
          </button>

          <button
            type="button"
            className="basta-design__dock-item basta-design__dock-item--fab"
            aria-label="Kompassen. Håll tre sekunder för Valv."
            onClick={centerClick}
            {...centerHoldHandlers}
          >
            <div className="basta-design__dock-fab">
              <BastaDesignDockCompass />
            </div>
            <span className={`basta-design__dock-label ${isHome ? 'basta-design__dock-label--on' : ''}`}>
              KOMPASSEN
            </span>
          </button>

          <button
            type="button"
            className="basta-design__dock-item"
            onClick={() => navigate('/vardagen?tab=ekonomi')}
            aria-current={isEkonomi ? 'page' : undefined}
          >
            <span style={{ color: isEkonomi ? 'var(--bd-accent)' : 'var(--bd-text-muted)' }}>
              <UtensilsCrossed size={18} />
            </span>
            <span className={`basta-design__dock-label ${isEkonomi ? 'basta-design__dock-label--on' : ''}`}>
              RECEPT
            </span>
          </button>

          <button
            type="button"
            className="basta-design__dock-item"
            onClick={() => setResurserOpen(true)}
            aria-expanded={resurserOpen}
          >
            <span style={{ color: resurserOpen ? 'var(--bd-accent)' : 'var(--bd-text-muted)' }}>
              <Library size={18} />
            </span>
            <span className={`basta-design__dock-label ${resurserOpen ? 'basta-design__dock-label--on' : ''}`}>
              RESURSER
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
