import { useCallback } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { getNavTruthById, NAV_PATHS } from '../navigation/navTruth';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';
import { DrawerL2Icon, type DrawerL2HubId } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenDockHandle } from '../components/FyrenWidgetBar';
import { DockNavButton } from './DockNavButton';
import { resolveHeaderPanelStyle } from './headerPanelStyle';

type DockZone = {
  id: string;
  label: string;
  to: string;
  drawerIcon: DrawerL2HubId;
  match: (pathname: string, search: string) => boolean;
};

const DOCK_ZONES: DockZone[] = [
  {
    id: 'vardag',
    label: getNavTruthById('vardagen')?.label ?? 'Liv och göra',
    to: NAV_PATHS.VARDAGEN,
    drawerIcon: 'vardagen',
    match: (pathname, search) => {
      if (pathname !== '/vardagen' && !pathname.startsWith('/vardagen/')) return false;
      return new URLSearchParams(search.replace(/^\?/, '')).get('tab') !== 'handling';
    },
  },
  {
    id: 'familj',
    label: getNavTruthById('familjen')?.label ?? 'Familjen',
    to: NAV_PATHS.FAMILJEN,
    drawerIcon: 'familjen',
    match: (pathname) => pathname === '/familjen' || pathname.startsWith('/familjen/'),
  },
  {
    id: 'dagbok',
    label: getNavTruthById('dagbok')?.label ?? 'Dagbok',
    to: NAV_PATHS.HJARTAT,
    drawerIcon: 'dagbok',
    match: (pathname) =>
      pathname === NAV_PATHS.HJARTAT ||
      pathname.startsWith(`${NAV_PATHS.HJARTAT}/`) ||
      pathname === '/dagbok' ||
      pathname.startsWith('/dagbok/'),
  },
  {
    id: 'planering',
    label: getNavTruthById('vardagen_handling')?.label ?? 'Handling',
    to: '/planering?tab=handling&picked=1',
    drawerIcon: 'planering',
    match: (pathname, search) => {
      if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) return true;
      if (!pathname.startsWith('/vardagen')) return false;
      return new URLSearchParams(search.replace(/^\?/, '')).get('tab') === 'handling';
    },
  },
];

export function FloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const { pathname, search } = location;
  const isHome = pathname === '/';
  const panelStyle = resolveHeaderPanelStyle();

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

  const leftZones = DOCK_ZONES.slice(0, 2);
  const rightZones = DOCK_ZONES.slice(2);

  return (
    <div className="dock-shell dock-shell--fyren">
      <FyrenDockHandle />
      <div className="dock-hub-band floating-dock" data-panel-style={panelStyle}>
        <div className="dock-hub-band__rail dock-hub-band__rail--zones">
          <div className="floating-dock__side-group floating-dock__side-group--left">
            {leftZones.map((zone) => (
              <DockNavButton
                key={zone.id}
                label={zone.label}
                tileVariant="calm"
                icon={
                  <DrawerL2Icon hubId={zone.drawerIcon} className="dock-nav-btn__drawer-l2" />
                }
                active={zone.match(pathname, search)}
                variant="slot"
                className="floating-dock__side-btn"
                onClick={() => navigate(zone.to)}
              />
            ))}
          </div>

          <button
            type="button"
            className={clsx(
              'dock-hub-band__center floating-dock__center',
              isHome && 'dock-hub-band__center--active',
              isHolding && 'dock-hub-band__center--holding',
            )}
            aria-label="Hem. Håll tre sekunder för Valv."
            style={
              progress > 0
                ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                : undefined
            }
            {...centerHoldHandlers}
          >
            <span className="dock-hub-band__center-glow floating-dock__center-glow" aria-hidden />
            <span className="floating-dock__arc" aria-hidden />
            <span className="dock-hub-band__plate floating-dock__plate">
              {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
              <LivskompassMark className="dock-hub-band__mark floating-dock__mark" />
            </span>
          </button>

          <div className="floating-dock__side-group floating-dock__side-group--right">
            {rightZones.map((zone) => (
              <DockNavButton
                key={zone.id}
                label={zone.label}
                tileVariant="calm"
                icon={
                  <DrawerL2Icon hubId={zone.drawerIcon} className="dock-nav-btn__drawer-l2" />
                }
                active={zone.match(pathname, search)}
                variant="slot"
                className="floating-dock__side-btn"
                onClick={() => navigate(zone.to)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
