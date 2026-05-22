import type { LucideIcon } from 'lucide-react';
import { BookOpen, Anchor, Heart, Sprout, Sparkles, Compass } from 'lucide-react';

export type ClusterTone = 'gold' | 'indigo' | 'lavender' | 'emerald';
export type HubPosition = 'center' | 'side';

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';
export type VardagenTab = 'kompasser' | 'ekonomi' | 'kunskap';

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

export const HIDE_BEVIS_TAB = import.meta.env.VITE_HIDE_BEVIS_TAB === 'true';

export const DOSSIER_PATH = '/dossier';

export const HJARTAT_PATH = '/dagbok';
export const VARDAGEN_PATH = '/vardagen';

export const HJARTAT_TABS: ClusterTabDef<HjartatTab>[] = [
  { id: 'reflektion', label: 'Reflektion', isDefault: true },
  { id: 'bevis', label: 'Bevis' },
  { id: 'speglar', label: 'Speglar' },
];

export const VARDAGEN_TABS: ClusterTabDef<VardagenTab>[] = [
  { id: 'kompasser', label: 'Kompasser', isDefault: true },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'kunskap', label: 'Kunskap' },
];

const HJARTAT_CLUSTER: LifeCluster = {
  id: 'hjartat',
  path: HJARTAT_PATH,
  label: 'Hjärtat',
  hubLabel: 'Hjärtat',
  desc: 'Sanning, reflektion och spegling.',
  icon: BookOpen,
  tone: 'gold',
  hubPosition: 'center',
  longPress: true,
  fyrenSearch: '?tab=bevis',
  chips: [
    { label: 'Dagbok', tab: 'reflektion' },
    { label: 'Verklighetsvalvet', tab: 'bevis' },
    { label: 'Speglar', tab: 'speglar' },
  ],
};

const HAMN_CLUSTER: LifeCluster = {
  id: 'hamn',
  path: '/hamn',
  label: 'Hamnen',
  hubLabel: 'Hamn',
  desc: 'Gränser och kommunikation mot ex.',
  icon: Anchor,
  tone: 'indigo',
  hubPosition: 'side',
  chips: [{ label: 'Safe Harbor · BIFF' }],
};

const FAMILIEN_CLUSTER: LifeCluster = {
  id: 'familjen',
  path: '/familjen',
  label: 'Familjen',
  hubLabel: 'Familjen',
  desc: 'Neutral loggning för Kasper och Arvid.',
  icon: Heart,
  tone: 'lavender',
  hubPosition: 'side',
  chips: [
    { label: 'Livsloggar' },
    { label: 'Balansmätare' },
  ],
};

const VARDAGEN_CLUSTER: LifeCluster = {
  id: 'vardagen',
  path: VARDAGEN_PATH,
  label: 'Vardagen',
  hubLabel: 'Vardagen',
  desc: 'Daglig rytm och vardagsstress.',
  icon: Compass,
  tone: 'emerald',
  hubPosition: 'side',
  chips: [
    { label: 'Kompasser', tab: 'kompasser' },
    { label: 'Ekonomi', tab: 'ekonomi' },
    { label: 'Kunskap', tab: 'kunskap' },
  ],
};

const MABRA_CLUSTER: LifeCluster = {
  id: 'mabra',
  path: '/mabra',
  label: 'Måbra',
  hubLabel: 'Måbra',
  desc: 'KBT, självmedkänsla och små vanor.',
  icon: Sparkles,
  tone: 'lavender',
  hubPosition: 'side',
  chips: [{ label: 'Måbra-sidan' }],
};

/** All livsområden — single source för hem, hub och specs. */
export const LIFE_CLUSTERS: LifeCluster[] = [
  HJARTAT_CLUSTER,
  HAMN_CLUSTER,
  FAMILIEN_CLUSTER,
  VARDAGEN_CLUSTER,
  MABRA_CLUSTER,
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
  return {
    path: c.path,
    label: c.hubLabel,
    desc: c.hubPosition === 'center' ? 'Dagbok · bevis · spegling' : c.desc.split('.')[0] ?? c.desc,
    icon: c.hubPosition === 'center' ? c.icon : c.id === 'vardagen' ? Sprout : c.icon,
    tone: c.tone,
    longPress: c.longPress,
    search: c.fyrenSearch,
  };
}

export const HUB_CENTER: HubModule = clusterToHubModule(HJARTAT_CLUSTER);

export const HUB_SIDE_MODULES: HubModule[] = LIFE_CLUSTERS.filter((c) => c.hubPosition === 'side').map(
  clusterToHubModule,
);

export const HUB_TOP = HUB_SIDE_MODULES.slice(0, 2);
export const HUB_BOTTOM = HUB_SIDE_MODULES.slice(2, 4);

export type LegacyRedirect = {
  from: string;
  to: string;
  search?: string;
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  { from: '/kompasser', to: VARDAGEN_PATH },
  { from: '/ekonomi', to: VARDAGEN_PATH, search: '?tab=ekonomi' },
  { from: '/kunskap', to: VARDAGEN_PATH, search: '?tab=kunskap' },
  { from: '/valv', to: HJARTAT_PATH, search: '?tab=bevis' },
  { from: '/speglar', to: HJARTAT_PATH, search: '?tab=speglar' },
  { from: '/barnen', to: '/familjen' },
];

export function parseHjartatTab(raw: string | null): HjartatTab {
  if (raw === 'bevis' || raw === 'speglar') return raw;
  return 'reflektion';
}

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi' || raw === 'kunskap') return raw;
  return 'kompasser';
}

export function getVisibleHjartatTabs(): ClusterTabDef<HjartatTab>[] {
  if (HIDE_BEVIS_TAB) return HJARTAT_TABS.filter((t) => t.id !== 'bevis');
  return HJARTAT_TABS;
}

export function clusterTabSearch(tab: string, defaultTab: string): string {
  return tab === defaultTab ? '' : `?tab=${tab}`;
}

export function hjartatTabHref(tab: HjartatTab): { pathname: string; search: string } {
  return {
    pathname: HJARTAT_PATH,
    search: clusterTabSearch(tab, 'reflektion'),
  };
}

export function vardagenTabHref(tab: VardagenTab): { pathname: string; search: string } {
  return {
    pathname: VARDAGEN_PATH,
    search: clusterTabSearch(tab, 'kompasser'),
  };
}

export function bevisTabHref(): { pathname: string; search: string } {
  return hjartatTabHref('bevis');
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
