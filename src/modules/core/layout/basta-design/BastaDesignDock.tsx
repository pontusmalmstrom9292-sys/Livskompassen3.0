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

  useLayoutEffect(() => {
    const shell = document.querySelector<HTMLElement>('.dock-shell--basta-v2');
    const bar = document.querySelector<HTMLElement>('.basta-dock-bar--v2');
    if (!shell || !bar) return;
    const shellRect = shell.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    const vv = window.visualViewport;
    const gapFromBottom = Math.round(window.innerHeight - barRect.bottom);
    // #region agent log
    const data = {
      pathname,
      innerH: window.innerHeight,
      vvH: vv?.height ?? null,
      vvOffsetTop: vv?.offsetTop ?? null,
      shellBottom: Math.round(shellRect.bottom),
      barBottom: Math.round(barRect.bottom),
      barTop: Math.round(barRect.top),
      gapFromBottom,
      shellPadBottom: getComputedStyle(shell).paddingBottom,
      barPadBottom: getComputedStyle(bar).paddingBottom,
      lkInset: getComputedStyle(document.documentElement).getPropertyValue('--lk-android-shell-inset'),
      safeCss: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom'),
      platformAndroid: document.documentElement.classList.contains('platform-capacitor-android'),
    };
    console.warn('[DBG-118fef]', 'BastaDesignDock.tsx:measure', 'dock geometry', data);
    fetch('http://127.0.0.1:7891/ingest/e2aa352c-17db-4fb0-8a3f-df79408d16d3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '118fef' },
      body: JSON.stringify({
        sessionId: '118fef',
        runId: 'post-fix',
        hypothesisId: 'E',
        location: 'BastaDesignDock.tsx:measure',
        message: 'dock geometry',
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
