/**
 * Ikonbeslut (2026-05-22, synkat med design-master):
 * - Hjärtat: BookOpen — yttre ska läsa "dagbok/reflektion", inte valv (plausible deniability).
 * - Familjen: Users — neutral loggning, skiljs från Hjärtat (Heart reserverad semantiskt för känsla).
 * - Vardagen: Compass på hem/kluster; Sprout i Modulhub-tile (vardagsrytm).
 * - Hamn: Anchor · Måbra: Sparkles · Bevis/valv: Shield (endast i chips/Fyren, ej egen dock-ikon).
 */
import type { LucideIcon } from 'lucide-react';
import { BookOpen, Anchor, Users, Sprout, Sparkles, Compass } from 'lucide-react';

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
  'Öppna modulhubben (Kompass), tryck Hjärtat och håll 3 sekunder (Fyren), verifiera med fingeravtryck eller Face ID.';

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
  icon: Users,
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
  const centerHubDesc = HIDE_BEVIS_TAB
    ? 'Dagbok och spegling'
    : 'Dagbok · bevis · spegling';
  return {
    path: c.path,
    label: c.hubLabel,
    desc: c.hubPosition === 'center' ? centerHubDesc : c.desc.split('.')[0] ?? c.desc,
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
  { from: '/kunskap', to: '/dagbok', search: '?tab=bevis&vaultTab=kunskapsbank' },
  { from: '/valv', to: HJARTAT_PATH, search: '?tab=bevis' },
  { from: '/speglar', to: HJARTAT_PATH, search: '?tab=speglar' },
  { from: '/barnen', to: '/familjen' },
];

export {
  parseHjartatTab,
  resolveHjartatTab,
  parseVardagenTab,
  clusterTabSearch,
  hjartatTabHref,
  vardagenTabHref,
} from './tabRegistry';
import { hjartatTabHref, vardagenTabHref } from './tabRegistry';

export function getVisibleHjartatTabs(): ClusterTabDef<HjartatTab>[] {
  if (HIDE_BEVIS_TAB) return HJARTAT_TABS.filter((t) => t.id !== 'bevis');
  return HJARTAT_TABS;
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
