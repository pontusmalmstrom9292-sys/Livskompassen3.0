import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import type { HubContextIconId } from '../navigation/hubContextBar';

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
        right: { to: '/hamn', label: 'Hamn', icon: 'anchor' },
      };
    case 'rehab_lag':
      return {
        left: { to: '/mabra', label: 'MåBra', icon: 'sparkles' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
    case 'vardag_arbete':
      return {
        left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
        right: { to: '/arbetsliv?tab=stampla', label: 'Arbetsliv', icon: 'clock' },
      };
    case 'minimal':
      return {
        left: { to: '/', label: 'Hem', icon: 'sparkles' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
    default:
      return {
        left: { to: '/familjen', label: 'Familjen', icon: 'users' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
  }
}

/** Sidolänkar kring kompass — preset med enkla route-overrides. */
export function getDockSideLinks(
  presetId: LifeHubPresetId,
  pathname: string,
): { left: DockSideLink; right: DockSideLink } {
  if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) {
    return {
      left: { to: '/projekt', label: 'Projekt', icon: 'folder' },
      right: { to: '/familjen', label: 'Familjen', icon: 'users' },
    };
  }
  if (pathname.startsWith('/familjen')) {
    return {
      left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
      right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
    };
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return {
      left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
      right: { to: '/projekt', label: 'Projekt', icon: 'folder' },
    };
  }
  return presetSides(presetId);
}
