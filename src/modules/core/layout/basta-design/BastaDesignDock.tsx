import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { NotebookPen, Users2, UtensilsCrossed, Library } from 'lucide-react';
import { openValvViaFyren } from '../../auth/valvFyrenGate';
import { NAV_PATHS } from '../../navigation/navTruth';
import { ResurserOverlay } from '../../navigation/ResurserOverlay';
import { useLongPress } from '../../hooks/useLongPress';
import { useStore } from '../../store';
import { BastaDesignDockCompass } from './BastaDesignDockCompass';

function SideItem({
  label,
  active,
  onClick,
  children,
  expanded,
}: {
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={clsx('basta-dock-bar__side', active && 'basta-dock-bar__side--active')}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-expanded={expanded}
    >
      <span className="basta-dock-bar__icon">{children}</span>
      <span className="basta-dock-bar__label">{label}</span>
    </button>
  );
}

/** Figma-ref bottom dock — prod routes, premium glass. */
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
      <div className="dock-shell dock-shell--basta-design">
        <nav className="basta-dock-bar" aria-label="Huvudnavigering">
          <SideItem
            label="Anteckningar"
            active={isAnteckning}
            onClick={() => navigate(`${NAV_PATHS.HJARTAT}?tab=reflektion`)}
          >
            <NotebookPen size={18} strokeWidth={1.5} />
          </SideItem>

          <SideItem label="Familj" active={isFamiljen} onClick={() => navigate(NAV_PATHS.FAMILJEN)}>
            <Users2 size={18} strokeWidth={1.5} />
          </SideItem>

          <div className="basta-dock-bar__compass-slot">
            <button
              type="button"
              className={clsx('basta-dock-bar__compass', isHome && 'basta-dock-bar__compass--home')}
              aria-label="Kompassen. Håll tre sekunder för Valv."
              onClick={centerClick}
              {...centerHoldHandlers}
            >
              <BastaDesignDockCompass />
            </button>
          </div>

          <SideItem
            label="Recept"
            active={isEkonomi}
            onClick={() => navigate('/vardagen?tab=ekonomi')}
          >
            <UtensilsCrossed size={18} strokeWidth={1.5} />
          </SideItem>

          <SideItem
            label="Resurser"
            active={resurserOpen}
            expanded={resurserOpen}
            onClick={() => setResurserOpen(true)}
          >
            <Library size={18} strokeWidth={1.5} />
          </SideItem>
        </nav>
      </div>
    </>
  );
}
