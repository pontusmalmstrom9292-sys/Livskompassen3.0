// src/modules/core/navigation/navigationRegistry.ts

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
      economy: { id: 'economy', label: 'Ekonomi', path: '?tab=ekonomi' },
      work: { id: 'work', label: 'Arbetsliv', path: '?tab=arbetsliv' },
      health: { id: 'health', label: 'Drogfrihet', path: '?tab=health' },
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
      harbor: { id: 'harbor', label: 'Trygg hamn', path: '/hamn' },
    },
  },
  admin: {
    id: 'admin',
    path: '/admin',
    label: 'Administration',
    icon: 'settings',
    tabs: {
      projects: { id: 'projects', label: 'Projekt', path: '?tab=projects' },
      planning: { id: 'planning', label: 'Planering', path: '?tab=planning' },
    },
  },
} as const;

export type NavigationId = keyof typeof NAVIGATION_STRUCTURE;
export type ClusterConfig = (typeof NAVIGATION_STRUCTURE)[NavigationId];

export type LifeJournalTabKey = keyof typeof NAVIGATION_STRUCTURE.lifeJournal.tabs;
export type DailyLifeTabKey = keyof typeof NAVIGATION_STRUCTURE.dailyLife.tabs;
export type FamilyTabKey = keyof typeof NAVIGATION_STRUCTURE.family.tabs;

/** React Router `search` without leading `?`. */
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

/** Default Vardagen tab per registry (kompasser). */
export function dailyLifeDefaultSearch(): string {
  return registryTabSearch(NAVIGATION_STRUCTURE.dailyLife.tabs.compasses.path);
}
