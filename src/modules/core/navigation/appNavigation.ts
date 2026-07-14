import type { LucideIcon } from 'lucide-react';
import { BookOpen, Users, Compass } from 'lucide-react';

export type ClusterTone = 'gold' | 'indigo' | 'lavender' | 'emerald';
export type HubPosition = 'center' | 'side';

export type { HjartatTab, VardagenTab } from './tabRegistry';
import type { HjartatTab, VardagenTab } from './tabRegistry';

export type ClusterChip = {
  label: string;
  tab?: string;
};

export type ClusterTabDef<T extends string = string> = {
  id: T;
  label: string;
  isDefault?: boolean;
};

export type LifeCluster = {
  id: string;
  path: string;
  label: string;
  hubLabel: string;
  desc: string;
  icon: LucideIcon;
  tone: ClusterTone;
  hubPosition: HubPosition;
  longPress?: boolean;
  fyrenSearch?: string;
  chips: ClusterChip[];
};

export { HIDE_BEVIS_TAB } from './navFlags';
import { HIDE_BEVIS_TAB } from './navFlags';

export const FYREN_BEVIS_HINT =
  'Håll Kompis-ögat i toppmenyn i 3 sekunder och verifiera med fingeravtryck eller Face ID.';

export const DOSSIER_PATH = '/dossier';
export const HJARTAT_PATH = '/hjartat';
export const VALVET_PATH = '/valvet';
export const VARDAGEN_PATH = '/vardagen';

export const HJARTAT_TABS: ClusterTabDef<HjartatTab>[] = [
  { id: 'reflektion', label: 'Reflektion', isDefault: true },
  { id: 'bevis', label: 'Bevis' },
  { id: 'speglar', label: 'Speglar' },
];

export const VARDAGEN_TABS: ClusterTabDef<VardagenTab>[] = [
  { id: 'kompasser', label: 'Kompasser', isDefault: true },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'mabra', label: 'MåBra' },
  { id: 'tidrapportering', label: 'Tid & Stämpel' },
];

const HJARTAT_CLUSTER: LifeCluster = {
  id: 'hjartat',
  path: HJARTAT_PATH,
  label: 'Hjärtat',
  hubLabel: 'Hjärtat',
  desc: HIDE_BEVIS_TAB ? 'Reflektion och spegling.' : 'Sanning, reflektion och spegling.',
  icon: BookOpen,
  tone: 'gold',
  hubPosition: 'center',
  longPress: true,
  fyrenSearch: '',
  chips: [
    { label: 'Dagbok', tab: 'reflektion' },
    { label: 'Speglar', tab: 'speglar' },
  ],
};

const FAMILIEN_CLUSTER: LifeCluster = {
  id: 'familjen',
  path: '/familjen',
  label: 'Familjen',
  hubLabel: 'Familjen',
  desc: 'Barnfokus, stunder och Trygg Hamn.',
  icon: Users,
  tone: 'lavender',
  hubPosition: 'side',
  chips: [
    { label: 'Reflektion', tab: 'reflektion' },
    { label: 'Trygg hamn', tab: 'hamn' },
  ],
};

const VARDAGEN_CLUSTER: LifeCluster = {
  id: 'vardagen',
  path: VARDAGEN_PATH,
  label: 'Vardagen',
  hubLabel: 'Vardagen',
  desc: 'Daglig rytm, planering och mående.',
  icon: Compass,
  tone: 'emerald',
  hubPosition: 'side',
  chips: [
    { label: 'Kompasser', tab: 'kompasser' },
    { label: 'MåBra', tab: 'mabra' },
  ],
};

export const LIFE_CLUSTERS: LifeCluster[] = [
  HJARTAT_CLUSTER,
  FAMILIEN_CLUSTER,
  VARDAGEN_CLUSTER,
];

export type HubModule = {
  path: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: ClusterTone;
  longPress?: boolean;
  search?: string;
};

function clusterToHubModule(c: LifeCluster): HubModule {
  const centerHubDesc = HIDE_BEVIS_TAB
    ? 'Dagbok och spegling'
    : 'Dagbok · bevis · spegling';
  return {
    path: c.path,
    label: c.hubLabel,
    desc: c.hubPosition === 'center' ? centerHubDesc : c.desc.split('.')[0] ?? c.desc,
    icon: c.icon,
    tone: c.tone,
    longPress: c.longPress,
    search: c.fyrenSearch,
  };
}

export const HUB_CENTER: HubModule = clusterToHubModule(HJARTAT_CLUSTER);

export const HUB_SIDE_MODULES: HubModule[] = LIFE_CLUSTERS.filter((c) => c.hubPosition === 'side').map(
  clusterToHubModule,
);

export const HUB_TOP = [HUB_SIDE_MODULES[0]!];
export const HUB_BOTTOM = [HUB_SIDE_MODULES[1]!];

export {
  parseHjartatTab,
  resolveHjartatTab,
  parseVardagenTab,
  clusterTabSearch,
  hjartatTabHref,
  vardagenTabHref,
} from './tabRegistry';
import { clusterTabSearch, hjartatTabHref, vardagenTabHref } from './tabRegistry';

const FAMILIEN_PATH = '/familjen';

export function getVisibleHjartatTabs(): ClusterTabDef<HjartatTab>[] {
  if (HIDE_BEVIS_TAB) return HJARTAT_TABS.filter((t) => t.id !== 'bevis');
  return HJARTAT_TABS;
}

export function bevisTabHref(): { pathname: string; search: string } {
  return { pathname: VALVET_PATH, search: '' };
}

export function speglarTabHref(): { pathname: string; search: string } {
  return hjartatTabHref('speglar');
}

export function dossierHref(params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return DOSSIER_PATH;
  const q = new URLSearchParams(params);
  return `${DOSSIER_PATH}?${q.toString()}`;
}

export function clusterChipHref(cluster: LifeCluster, chip: ClusterChip): {
  pathname: string;
  search: string;
} {
  const defaultTab = cluster.id === 'hjartat' ? 'reflektion' : cluster.id === 'vardagen' ? 'kompasser' : '';
  const tab = chip.tab ?? defaultTab;
  if (!tab) return { pathname: cluster.path, search: '' };
  if (cluster.path === HJARTAT_PATH) {
    return hjartatTabHref(tab as HjartatTab);
  }
  if (cluster.path === VARDAGEN_PATH) {
    return vardagenTabHref(tab as VardagenTab);
  }
  if (cluster.path === FAMILIEN_PATH) {
    return { pathname: FAMILIEN_PATH, search: clusterTabSearch(tab, 'reflektion') };
  }
  return { pathname: cluster.path, search: '' };
}

export function isClusterActive(pathname: string, clusterPath: string): boolean {
  if (clusterPath === '/') return pathname === '/';
  return pathname === clusterPath || pathname.startsWith(`${clusterPath}/`);
}

export function getHomeClusters(): LifeCluster[] {
  if (!HIDE_BEVIS_TAB) return LIFE_CLUSTERS;
  return LIFE_CLUSTERS.map((c) =>
    c.id === 'hjartat'
      ? { ...c, chips: c.chips.filter((chip) => chip.tab !== 'bevis') }
      : c,
  );
}

export function getClusterByPath(path: string): LifeCluster | undefined {
  return LIFE_CLUSTERS.find((c) => c.path === path);
}
