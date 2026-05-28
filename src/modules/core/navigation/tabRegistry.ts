/**
 * TabRegistry — livsområden, hub-flikar och Valv-flikar.
 * Synkad med `navTruth.ts` (paths) och `evidence/vault/utils/vaultTabs.ts`.
 */
import { createElement, type ReactNode } from 'react';
import {
  BarChart3,
  BookOpen,
  FileText,
  Network,
  ScrollText,
  Search,
} from 'lucide-react';
import type { DrawerHubId } from './hubTabs';
import { tabIdFromNavPath } from './hubTabs';
import { getDrawerChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';
import {
  MAIN_VAULT_TAB_IDS,
  type MainVaultTab,
} from '../../evidence/vault/utils/vaultTabs';

import { HIDE_BEVIS_TAB } from './navFlags';

export { HIDE_BEVIS_TAB } from './navFlags';

export type TabCategory =
  | 'dagbok_spegling'
  | 'vardag_aterhamtning'
  | 'familj'
  | 'verktyg'
  | 'trygghet'
  | 'kompass_system';

export const TAB_CATEGORY_ORDER: TabCategory[] = [
  'kompass_system',
  'dagbok_spegling',
  'vardag_aterhamtning',
  'familj',
  'verktyg',
  'trygghet',
];

export const TAB_CATEGORY_LABELS: Record<TabCategory, string> = {
  kompass_system: 'Kompass',
  dagbok_spegling: 'Dagbok & spegling',
  vardag_aterhamtning: 'Vardag & återhämtning',
  familj: 'Familjen',
  verktyg: 'Planering & arbete',
  trygghet: 'Trygghet & stöd',
};

export const HUB_TAB_CATEGORY: Record<string, TabCategory> = {
  hem: 'kompass_system',
  dagbok: 'dagbok_spegling',
  vardagen: 'vardag_aterhamtning',
  mabra: 'vardag_aterhamtning',
  familjen: 'familj',
  planering: 'verktyg',
  arbetsliv: 'verktyg',
  projekt: 'verktyg',
  hamn: 'trygghet',
  drogfrihet: 'trygghet',
  installningar: 'kompass_system',
};

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';
export type VardagenTab = 'kompasser' | 'ekonomi';

export type HubTabDef<T extends string = string> = {
  id: T;
  label: string;
  isDefault?: boolean;
};

export function getHubTabCategory(hubId: string): TabCategory | undefined {
  return HUB_TAB_CATEGORY[hubId];
}

export function groupVardagDrawerRoots(
  roots: NavTruthEntry[],
): { category: TabCategory; label: string; entries: NavTruthEntry[] }[] {
  const buckets = new Map<TabCategory, NavTruthEntry[]>();
  for (const root of roots) {
    const cat = getHubTabCategory(root.id) ?? 'verktyg';
    const list = buckets.get(cat) ?? [];
    list.push(root);
    buckets.set(cat, list);
  }
  return TAB_CATEGORY_ORDER.filter((c) => buckets.has(c)).map((category) => ({
    category,
    label: TAB_CATEGORY_LABELS[category],
    entries: buckets.get(category) ?? [],
  }));
}

export function hubTabDefsFromNav(hubId: DrawerHubId): HubTabDef[] {
  return getDrawerChildren(hubId, 'vardag')
    .map((entry) => {
      const id = tabIdFromNavPath(entry.path);
      if (!id) return null;
      return { id, label: entry.label };
    })
    .filter((t): t is HubTabDef => t !== null);
}

export function getVisibleHjartatTabIds(): HjartatTab[] {
  const ids = hubTabDefsFromNav('dagbok').map((t) => t.id as HjartatTab);
  if (HIDE_BEVIS_TAB) return ids.filter((id) => id !== 'bevis');
  return ids;
}

export function parseHjartatTab(raw: string | null): HjartatTab {
  if (raw === 'bevis' || raw === 'speglar') return raw;
  return 'reflektion';
}

export function resolveHjartatTab(raw: string | null, vaultGateOpen: boolean): HjartatTab {
  const parsed = parseHjartatTab(raw);
  if (vaultGateOpen && parsed === 'bevis') return 'bevis';
  if (parsed === 'bevis' && HIDE_BEVIS_TAB && !vaultGateOpen) return 'reflektion';
  return parsed;
}

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

const VAULT_MAIN_LABELS: Record<MainVaultTab, string> = {
  logga: 'Arkiv',
  sok: 'Triage',
  monster: 'Mönster',
  orkester: 'Orkester',
  dossier: 'Dossier',
  kunskapsbank: 'Kunskapsbank',
};

const icon = (Icon: typeof FileText) => createElement(Icon, { className: 'h-3 w-3' });

const VAULT_MAIN_ICONS: Partial<Record<MainVaultTab, ReactNode>> = {
  logga: icon(FileText),
  sok: icon(Search),
  monster: icon(BarChart3),
  orkester: icon(Network),
  dossier: icon(ScrollText),
  kunskapsbank: icon(BookOpen),
};

export function getMainVaultTabBarItems(): TabBarItem<MainVaultTab>[] {
  return MAIN_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function clusterTabSearch(tab: string, defaultTab: string): string {
  return tab === defaultTab ? '' : `?tab=${tab}`;
}

export function hjartatTabHref(tab: HjartatTab): { pathname: string; search: string } {
  return { pathname: '/dagbok', search: clusterTabSearch(tab, 'reflektion') };
}

export function vardagenTabHref(tab: VardagenTab): { pathname: string; search: string } {
  return { pathname: '/vardagen', search: clusterTabSearch(tab, 'kompasser') };
}
