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
  Users,
} from 'lucide-react';
import type { DrawerHubId } from './hubTabs';
import { tabIdFromNavPath } from './hubTabs';
import { getNavChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';
import {
  FORENSIC_VAULT_TAB_IDS,
  KUNSKAP_VAULT_TAB_IDS,
  MAIN_VAULT_TAB_IDS,
  ANALYSERA_VAULT_TAB_IDS,
  PANSARET_VAULT_TAB_IDS,
  SAMLA_VAULT_TAB_IDS,
  VALV_ZONE_VISIBLE_IDS,
  forensicVaultTabLabel,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type MainVaultTab,
  type AnalyseraVaultTab,
  type PansaretVaultTab,
  type SamlaVaultTab,
  type ValvZone,
} from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';

import { NAV_PATHS } from './navTruth';
import { HIDE_BEVIS_TAB } from './navFlags';
import { VALV_ZONE_LABELS, VAULT_MAIN_TAB_LABELS } from '../copy/valvNavCopy';

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
  liv: 'vardag_aterhamtning',
  familj: 'familj',
  dagbok: 'dagbok_spegling',
  vardagen: 'vardag_aterhamtning',
  mabra: 'vardag_aterhamtning',
  familjen: 'familj',
  planering: 'verktyg',
  gora: 'verktyg',
  arbetsliv: 'verktyg',
  projekt: 'verktyg',
  hamn: 'trygghet',
  drogfrihet: 'trygghet',
  installningar: 'kompass_system',
};

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';
export type VardagenTab = 'kompasser' | 'ekonomi' | 'tidrapportering';

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
  return getNavChildren(hubId, 'vardag')
    .map((entry) => {
      const id = tabIdFromNavPath(entry.path);
      const pathOnly = !id && !entry.path.includes('?') ? entry.path.split('/').filter(Boolean)[0] : null;
      const tabId = id ?? pathOnly;
      if (!tabId) return null;
      return { id: tabId, label: entry.label };
    })
    .filter((t): t is HubTabDef => t !== null);
}

export function getVisibleHjartatTabIds(vaultSessionOpen = false): HjartatTab[] {
  const ids = hubTabDefsFromNav('dagbok').map((t) => t.id as HjartatTab);
  // Om bevis-fliken ska döljas generellt, tillåt den endast om valvet faktiskt är upplåst i sessionen
  if (HIDE_BEVIS_TAB && !vaultSessionOpen) {
    return ids.filter((id) => id !== 'bevis');
  }
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
  if (raw === 'tidrapportering' || raw === 'arbetsliv' || raw === 'stampla') return 'tidrapportering';
  return 'kompasser';
}

const VAULT_MAIN_LABELS = { ...VAULT_MAIN_TAB_LABELS } as Record<
  (typeof MAIN_VAULT_TAB_IDS)[number],
  string
>;

const icon = (Icon: typeof FileText) => createElement(Icon, { className: 'h-3 w-3' });

const VAULT_MAIN_ICONS: Partial<Record<MainVaultTab, ReactNode>> = {
  logga: icon(FileText),
  sok: icon(Search),
  monster: icon(BarChart3),
  orkester: icon(Network),
  dossier: icon(ScrollText),
  kunskapsbank: icon(BookOpen),
  aktorskarta: icon(Users),
};

export function vaultMainTabLabel(id: MainVaultTab): string {
  return VAULT_MAIN_LABELS[id];
}

export function getMainVaultTabBarItems(): TabBarItem<MainVaultTab>[] {
  return MAIN_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

const VALV_ZONE_LABELS_MAP = { ...VALV_ZONE_LABELS } as Record<ValvZone, string>;

export function getVaultZoneTabBarItems(): TabBarItem<ValvZone>[] {
  return VALV_ZONE_VISIBLE_IDS.map((id) => ({ id, label: VALV_ZONE_LABELS_MAP[id] }));
}

export function getSamlaVaultTabBarItems(): TabBarItem<SamlaVaultTab>[] {
  return SAMLA_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function getAnalyseraVaultTabBarItems(): TabBarItem<AnalyseraVaultTab>[] {
  return ANALYSERA_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

/** @deprecated Använd zon-specifika getters (samla / analysera / exportera). */
export function getPansaretVaultTabBarItems(): TabBarItem<PansaretVaultTab>[] {
  return PANSARET_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function getForensicVaultTabBarItems(): TabBarItem<ForensicVaultTab>[] {
  return FORENSIC_VAULT_TAB_IDS.map((id) => ({
    id,
    label: forensicVaultTabLabel(id),
  }));
}

export function getKunskapVaultTabBarItems(): TabBarItem<KunskapVaultTab>[] {
  return KUNSKAP_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function clusterTabSearch(tab: string, defaultTab: string): string {
  return tab === defaultTab ? '' : `?tab=${tab}`;
}

export function hjartatTabHref(tab: HjartatTab): { pathname: string; search: string } {
  if (tab === 'bevis') {
    return { pathname: NAV_PATHS.VALVET, search: '' };
  }
  return { pathname: NAV_PATHS.HJARTAT, search: clusterTabSearch(tab, 'reflektion') };
}

export function vardagenTabHref(tab: VardagenTab): { pathname: string; search: string } {
  if (tab === 'ekonomi') {
    return { pathname: NAV_PATHS.VARDAGEN, search: '?tab=ekonomi' };
  }
  if (tab === 'tidrapportering') {
    return { pathname: '/arbetsliv', search: '?tab=stampla' };
  }
  return { pathname: NAV_PATHS.VARDAGEN, search: clusterTabSearch('kompasser', 'kompasser') };
}
