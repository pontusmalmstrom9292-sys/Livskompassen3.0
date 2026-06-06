import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import type { HubContextIconId } from '../navigation/hubContextBar';
import { NAV_PATHS } from '../navigation/navTruth';

export type DockSideLink = {
  to: string;
  label: string;
  icon: HubContextIconId;
};

export function getHubPresetShortLabel(presetId: LifeHubPresetId): string {
  switch (presetId) {
    case 'foralder_trygg':
      return 'Förälder';
    case 'rehab_lag':
      return 'Rehab';
    case 'vardag_arbete':
      return 'Vardag';
    case 'minimal':
      return 'Min';
    default:
      return 'Hub';
  }
}

function presetSides(presetId: LifeHubPresetId): { left: DockSideLink; right: DockSideLink } {
  switch (presetId) {
    case 'foralder_trygg':
      return {
        left: { to: '/familjen', label: 'Familjen', icon: 'users' },
        right: { to: '/familjen?tab=hamn', label: 'Trygg hamn', icon: 'anchor' },
      };
    case 'rehab_lag':
      return {
        left: { to: '/vardagen?tab=mabra', label: 'MåBra', icon: 'sparkles' },
        right: { to: NAV_PATHS.HJARTAT, label: 'Dagbok', icon: 'book' },
      };
    case 'vardag_arbete':
      return {
        left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
        right: { to: '/vardagen?tab=arbetsliv', label: 'Arbetsliv', icon: 'clock' },
      };
    case 'minimal':
      return {
        left: { to: '/', label: 'Hem', icon: 'sparkles' },
        right: { to: NAV_PATHS.HJARTAT, label: 'Dagbok', icon: 'book' },
      };
    default:
      return {
        left: { to: '/familjen', label: 'Familjen', icon: 'users' },
        right: { to: NAV_PATHS.HJARTAT, label: 'Dagbok', icon: 'book' },
      };
  }
}

function tabParam(search: string): string | null {
  return new URLSearchParams(search.replace(/^\?/, '')).get('tab');
}

function isPlaneringDockContext(pathname: string, search: string): boolean {
  if (pathname.startsWith('/projekt') || pathname.startsWith('/planering')) {
    return true;
  }
  if (pathname.startsWith('/vardagen')) {
    return tabParam(search) === 'handling';
  }
  return false;
}

/** Sidolänkar kring kompass — anpassade efter aktiva zoner. */
export function getDockSideLinks(
  presetId: LifeHubPresetId,
  pathname: string,
  search = '',
): { left: DockSideLink; right: DockSideLink } {
  if (isPlaneringDockContext(pathname, search)) {
    return {
      left: { to: '/projekt', label: 'Projekt', icon: 'folder' },
      right: { to: '/familjen', label: 'Familjen', icon: 'users' },
    };
  }
  if (pathname.startsWith('/familjen')) {
    return {
      left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
      right: { to: NAV_PATHS.HJARTAT, label: 'Dagbok', icon: 'book' },
    };
  }
  return presetSides(presetId);
}
