export const NAVIGATION_STRUCTURE = {
  lifeJournal: {
    id: 'lifeJournal',
    path: '/dagbok',
    label: 'Hjärtat',
    icon: 'heart',
    description: 'Din dagbok, bevis och speglar',
    tabs: {
      reflektion: { id: 'reflektion', label: 'Reflektion', path: '?tab=reflektion' },
      evidence: { id: 'evidence', label: 'Bevis', path: '?tab=bevis' },
      mirrors: { id: 'mirrors', label: 'Speglar', path: '?tab=speglar' },
    },
  },
  dailyLife: {
    id: 'dailyLife',
    path: '/vardagen',
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
    path: '/familjen',
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
