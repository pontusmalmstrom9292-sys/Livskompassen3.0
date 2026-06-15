/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { useLocation, useNavigate } from 'react-router-dom';
import { getNavTruthById, NAV_PATHS } from '../navigation/navTruth';
import { DrawerL2Icon, type DrawerL2HubId } from '../ui/drawerL2Icons/DrawerL2Icon';
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
    label: getNavTruthById('dagbok')?.label ?? 'Hjärtat',
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
  const { pathname, search } = location;
  const panelStyle = resolveHeaderPanelStyle();

  return (
    <div className="dock-shell dock-shell--fyren">
      <FyrenDockHandle />
      <div className="dock-hub-band floating-dock" data-panel-style={panelStyle}>
        <div className="dock-hub-band__rail dock-hub-band__rail--zones">
          {DOCK_ZONES.map((zone) => (
            <DockNavButton
              key={zone.id}
              label={zone.label}
              tileVariant="calm"
              icon={<DrawerL2Icon hubId={zone.drawerIcon} className="dock-nav-btn__drawer-l2" />}
              active={zone.match(pathname, search)}
              variant="slot"
              className="floating-dock__side-btn"
              onClick={() => navigate(zone.to)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
