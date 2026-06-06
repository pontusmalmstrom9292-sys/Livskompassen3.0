import { NAV_PATHS } from './navTruth';

export const NAVIGATION_STRUCTURE = {
  lifeJournal: {
    id: 'lifeJournal',
    path: NAV_PATHS.HJARTAT,
    label: 'Hjärtat',
    icon: 'heart',
    description: 'Din dagbok och speglar',
    tabs: {
      reflektion: { id: 'reflektion', label: 'Reflektion', path: '?tab=reflektion' },
      mirrors: { id: 'mirrors', label: 'Speglar', path: '?tab=speglar' },
    },
  },
  vault: {
    id: 'vault',
    path: NAV_PATHS.VALVET,
    label: 'Valvet',
    icon: 'vault',
    description: 'Verklighetsvalvet — bevis och analys',
    tabs: {
      default: { id: 'default', label: 'Arkiv', path: '' },
    },
  },
  dailyLife: {
    id: 'dailyLife',
    path: NAV_PATHS.VARDAGEN,
    label: 'Vardagen',
    icon: 'sun',
    tabs: {
      compasses: { id: 'compasses', label: 'Kompasser', path: '?tab=kompasser' },
      mabra: { id: 'mabra', label: 'MåBra', path: '?tab=mabra' },
      handling: { id: 'handling', label: 'Planering', path: '?tab=handling' },
      arbetsliv: { id: 'arbetsliv', label: 'Arbetsliv', path: '?tab=arbetsliv' },
      economy: { id: 'economy', label: 'Ekonomi', path: '?tab=ekonomi' },
      drogfrihet: { id: 'drogfrihet', label: 'Drogfrihet', path: '?tab=drogfrihet' },
    },
  },
  family: {
    id: 'family',
    path: NAV_PATHS.FAMILJEN,
    label: 'Familjen',
    icon: 'users',
    tabs: {
      reflektion: { id: 'reflektion', label: 'Reflektion', path: '?tab=reflektion' },
      livslogg: { id: 'livslogg', label: 'Livslogg', path: '?tab=livslogg' },
      tillsammans: { id: 'tillsammans', label: 'Tillsammans', path: '?tab=tillsammans' },
      barnporten: { id: 'barnporten', label: 'Barnporten', path: '?tab=barnporten' },
      hamn: { id: 'hamn', label: 'Trygg hamn', path: '?tab=hamn' },
    },
  },
} as const;

export type NavigationId = keyof typeof NAVIGATION_STRUCTURE;
export type ClusterConfig = (typeof NAVIGATION_STRUCTURE)[NavigationId];

export type LifeJournalTabKey = keyof typeof NAVIGATION_STRUCTURE.lifeJournal.tabs;
export type VaultTabKey = keyof typeof NAVIGATION_STRUCTURE.vault.tabs;
export type DailyLifeTabKey = keyof typeof NAVIGATION_STRUCTURE.dailyLife.tabs;
export type FamilyTabKey = keyof typeof NAVIGATION_STRUCTURE.family.tabs;

export function registryTabSearch(tabPath: string): string {
  return tabPath.startsWith('?') ? tabPath.slice(1) : tabPath;
}

export function clusterPath(clusterId: NavigationId): string {
  return NAVIGATION_STRUCTURE[clusterId].path;
}

export function clusterTabNavigateTarget(
  clusterId: NavigationId,
  tabKey: string,
): { pathname: string; search: string } {
  const cluster = NAVIGATION_STRUCTURE[clusterId];
  const tabs = cluster.tabs as Record<string, { path: string }>;
  const tab = tabs[tabKey];
  if (!tab) {
    return { pathname: cluster.path, search: '' };
  }
  if (tab.path.startsWith('/')) {
    return { pathname: tab.path, search: '' };
  }
  return { pathname: cluster.path, search: registryTabSearch(tab.path) };
}

/** Valv-länk med valfri vaultTab (separat silo från Hjärtat). */
export function valvetNavigateTarget(vaultTab?: string): { pathname: string; search: string } {
  if (!vaultTab) {
    return { pathname: NAV_PATHS.VALVET, search: '' };
  }
  return { pathname: NAV_PATHS.VALVET, search: `vaultTab=${encodeURIComponent(vaultTab)}` };
}
