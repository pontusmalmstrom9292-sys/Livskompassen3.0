import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../../auth/valvFyrenGate';
import { NAV_PATHS } from '../../navigation/navTruth';
import { ResurserOverlay } from '../../navigation/ResurserOverlay';
import { useLongPress } from '../../hooks/useLongPress';
import { useStore } from '../../store';
import { BastaDesignDockBar } from './BastaDesignDockBar';

/** Bästa design — kanon-bottom dock (6 zoner + hero-kompass). */
export function BastaDesignDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const [resurserOpen, setResurserOpen] = useState(false);
  const { pathname } = location;
  const isHome = pathname === '/';
  const isFamiljen = pathname === NAV_PATHS.FAMILJEN || pathname.startsWith(`${NAV_PATHS.FAMILJEN}/`);
  const isHjartat =
    pathname === NAV_PATHS.HJARTAT ||
    pathname.startsWith(`${NAV_PATHS.HJARTAT}/`) ||
    pathname.startsWith('/dagbok');

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

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;
  const showFyrenRing = progress > 0;

  return (
    <>
      <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
      <div className="dock-shell dock-shell--basta-design dock-shell--basta-v2">
        <BastaDesignDockBar
          pathname={pathname}
          isHome={isHome}
          isFamiljen={isFamiljen}
          isHjartat={isHjartat}
          resurserOpen={resurserOpen}
          showFyrenRing={showFyrenRing}
          progress={progress}
          isHolding={isHolding}
          centerHoldHandlers={centerHoldHandlers}
          onAnteckning={() => navigate('/widget/anteckning')}
          onFamiljen={() => navigate(NAV_PATHS.FAMILJEN)}
          onVentil={() => navigate(NAV_PATHS.HJARTAT)}
          onInkast={() => navigate('/planering/input?inputMode=inkast')}
          onResurser={() => setResurserOpen(true)}
        />
      </div>
    </>
  );
}
