/* PROTECTED BASTA-DESIGN DOCK LOCK — docs/design/BASTA-DESIGN-DOCK-LOCK.md · npm run smoke:basta-dock-lock */
import { useCallback, useLayoutEffect } from 'react';
import { trimAndroidBastaDockInsets } from '../../platform/androidDockInsetFix';
import { useLocation, useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../../auth/valvFyrenGate';
import { NAV_PATHS } from '../../navigation/navTruth';
import { useLongPress } from '../../hooks/useLongPress';
import { useStore } from '../../store';
import { BastaDesignDockBar } from './BastaDesignDockBar';

/** Bästa design — kanon-bottom dock (5 zoner + hero-kompass). Resurser i header. */
export function BastaDesignDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
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

  useLayoutEffect(() => {
    trimAndroidBastaDockInsets();
  }, [pathname]);

  return (
    <div className="dock-shell dock-shell--basta-design dock-shell--basta-v2">
      <BastaDesignDockBar
        pathname={pathname}
        isHome={isHome}
        isFamiljen={isFamiljen}
        isHjartat={isHjartat}
        showFyrenRing={showFyrenRing}
        progress={progress}
        isHolding={isHolding}
        centerHoldHandlers={centerHoldHandlers}
        onAnteckning={() => navigate('/widget/anteckning')}
        onFamiljen={() => navigate(NAV_PATHS.FAMILJEN)}
        onVentil={() => navigate(NAV_PATHS.HJARTAT)}
        onInkast={() => navigate('/planering/input?inputMode=inkast')}
      />
    </div>
  );
}
