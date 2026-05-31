/**
 * Single source for hub labels, paths, drawer sections, and chrome flags.
 * Drawer-ikoner: `drawerNav.ts` (v4 chrome `createChromeV4Icon` + Lucide där glyph saknas).
 */
import { HIDE_BEVIS_TAB } from './navFlags';
import {
  FORENSIC_VAULT_TAB_IDS,
  forensicVaultTabLabel,
  MAIN_VAULT_TAB_IDS,
} from '../../evidence/vault/utils/vaultTabs';
import {
  DAGBOK_BEVIS_DRAWER_LABEL,
  VALV_DRAWER_HINTS,
  VALV_KUNSKAP_DRAWER_LEAF,
  VALV_ZONE_LABELS,
  VAULT_MAIN_TAB_LABELS,
} from '../copy/valvNavCopy';

export type NavDrawerSection = 'vardag' | 'valv';

export type NavTruthEntry = {
  id: string;
  label: string;
  path: string;
  section: NavDrawerSection;
  inDrawer: boolean;
  requiresVaultPin?: boolean;
  /** Sub-rad under hub eller Valv-grupp */
  parentId?: string;
  /** Valv: expanderbar grupp utan egen navigation */
  isGroupHeader?: boolean;
  /** Kort hjälptext under grupp-rubrik i Valv-drawer */
  drawerHint?: string;
  /** Dölj i drawer när G18 döljer publik Bevis-flik */
  omitWhenHideBevis?: boolean;
  inDock?: boolean;
  fyrenHomeQuick?: boolean;
  /** Theme Pack J id when auto-module theme is on */
  themeId?: string;
};

/** Deep-link till Valv-baksida (PIN i VaultPage). */
export function vaultDrawerPath(vaultTab: string): string {
  return `/dagbok?tab=bevis&vaultTab=${vaultTab}`;
}

const VAULT_MAIN_LABELS = { ...VAULT_MAIN_TAB_LABELS } as Record<
  (typeof MAIN_VAULT_TAB_IDS)[number],
  string
>;

function valvLeaf(
  id: string,
  vaultTab: string,
  parentId: string,
  label?: string,
  inDrawer = false,
): NavTruthEntry {
  return {
    id,
    label: label ?? VAULT_MAIN_LABELS[vaultTab as keyof typeof VAULT_MAIN_LABELS] ?? vaultTab,
    path: vaultDrawerPath(vaultTab),
    section: 'valv',
    inDrawer,
    requiresVaultPin: true,
    parentId,
  };
}

export const NAV_TRUTH: NavTruthEntry[] = [
  // —— Vardag —— (4 drawer-rader: Hem · Liv · Familj · Inställningar)
  { id: 'hem', label: 'Hem — Skriv', path: '/', section: 'vardag', inDrawer: true, themeId: 'J-fyren-hem' },
  {
    id: 'liv',
    label: 'Liv och göra',
    path: '/liv',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'liv_kompasser',
    label: 'Kompasser',
    path: '/liv?tab=kompasser',
    section: 'vardag',
    inDrawer: false,
    parentId: 'liv',
  },
  {
    id: 'liv_mabra',
    label: 'MåBra',
    path: '/liv?tab=mabra',
    section: 'vardag',
    inDrawer: false,
    parentId: 'liv',
  },
  {
    id: 'liv_handling',
    label: 'Handling',
    path: '/liv?tab=handling',
    section: 'vardag',
    inDrawer: false,
    parentId: 'liv',
  },
  {
    id: 'liv_arbetsliv',
    label: 'Arbetsliv',
    path: '/liv?tab=arbetsliv',
    section: 'vardag',
    inDrawer: false,
    parentId: 'liv',
  },
  {
    id: 'familj',
    label: 'Familj och gränser',
    path: '/familj',
    section: 'vardag',
    inDrawer: true,
    inDock: true,
    themeId: 'J-familjen-varm',
  },
  {
    id: 'familj_reflektion',
    label: 'Reflektion',
    path: '/familj?tab=reflektion',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'familj_livslogg',
    label: 'Livslogg',
    path: '/familj?tab=livslogg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'familj_tillsammans',
    label: 'Tillsammans',
    path: '/familj?tab=tillsammans',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'familj_barnporten',
    label: 'Barnporten',
    path: '/familj?tab=barnporten',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'familj_hamn',
    label: 'Trygg hamn',
    path: '/familj?tab=hamn',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'familj_drogfrihet',
    label: 'Drogfrihet',
    path: '/familj?tab=drogfrihet',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familj',
  },
  {
    id: 'hem_inkast',
    label: 'Inkast',
    path: '/#inkast-lite',
    section: 'vardag',
    inDrawer: false,
    parentId: 'hem',
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    path: '/dagbok',
    section: 'vardag',
    inDrawer: false,
    fyrenHomeQuick: true,
    themeId: 'J-valv-pansar',
  },
  {
    id: 'dagbok_reflektion',
    label: 'Reflektion',
    path: '/dagbok?tab=reflektion',
    section: 'vardag',
    inDrawer: false,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_speglar',
    label: 'Speglar',
    path: '/dagbok?tab=speglar',
    section: 'vardag',
    inDrawer: false,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_bevis',
    label: DAGBOK_BEVIS_DRAWER_LABEL,
    path: vaultDrawerPath('logga'),
    section: 'vardag',
    inDrawer: false,
    parentId: 'dagbok',
    requiresVaultPin: true,
    omitWhenHideBevis: true,
  },
  {
    id: 'vardagen',
    label: 'Vardag',
    path: '/vardagen',
    section: 'vardag',
    inDrawer: false,
    fyrenHomeQuick: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'vardagen_kompasser',
    label: 'Kompasser',
    path: '/vardagen?tab=kompasser',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_ekonomi',
    label: 'Ekonomi',
    path: '/vardagen?tab=ekonomi',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'mabra',
    label: 'MåBra',
    path: '/mabra',
    section: 'vardag',
    inDrawer: false,
    fyrenHomeQuick: true,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'familjen',
    label: 'Familjen',
    path: '/familjen',
    section: 'vardag',
    inDrawer: false,
    inDock: true,
    themeId: 'J-familjen-varm',
  },
  {
    id: 'familjen_reflektion',
    label: 'Reflektion',
    path: '/familjen?tab=reflektion',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'familjen_livslogg',
    label: 'Livslogg',
    path: '/familjen?tab=livslogg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'familjen_tillsammans',
    label: 'Tillsammans',
    path: '/familjen?tab=tillsammans',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'familjen_barnporten',
    label: 'Barnporten',
    path: '/familjen?tab=barnporten',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'gora',
    label: 'Göra',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: false,
    fyrenHomeQuick: true,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'gora_handling',
    label: 'Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'gora_projekt',
    label: 'Projekt',
    path: '/projekt',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'gora_inkorg',
    label: 'Inkorg',
    path: '/planering?tab=inkorg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'planering',
    label: 'Planering',
    path: '/planering?tab=hub',
    section: 'vardag',
    inDrawer: false,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'planering_handling',
    label: 'Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'planering_fokus',
    label: 'Fokus',
    path: '/planering?tab=fokus',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'planering_framsteg',
    label: 'Framsteg',
    path: '/planering?tab=framsteg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'planering_regler',
    label: 'Regler',
    path: '/planering?tab=regler',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'planering_inkorg',
    label: 'Inkorg',
    path: '/planering?tab=inkorg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'gora',
  },
  {
    id: 'arbetsliv',
    label: 'Arbetsliv',
    path: '/arbetsliv',
    section: 'vardag',
    inDrawer: false,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'arbetsliv_stampla',
    label: 'Stämpel',
    path: '/arbetsliv?tab=stampla',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_tid',
    label: 'Tid & flex',
    path: '/arbetsliv?tab=tid',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_logg',
    label: 'Ekonomilogg',
    path: '/arbetsliv?tab=logg',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },
  {
    id: 'hamn',
    label: 'Trygg hamn',
    path: '/hamn',
    section: 'vardag',
    inDrawer: false,
    themeId: 'J-hamn-greyrock',
  },
  {
    id: 'hamn_oversikt',
    label: 'Översikt',
    path: '/hamn?tab=oversikt',
    section: 'vardag',
    inDrawer: false,
    parentId: 'hamn',
  },
  {
    id: 'hamn_biff',
    label: 'BIFF',
    path: '/hamn?tab=biff',
    section: 'vardag',
    inDrawer: false,
    parentId: 'hamn',
  },
  {
    id: 'hamn_speglar',
    label: 'Till Speglar',
    path: '/hamn?tab=speglar',
    section: 'vardag',
    inDrawer: false,
    parentId: 'hamn',
  },
  {
    id: 'hamn_barn',
    label: 'Barnfokus',
    path: '/hamn?tab=barn',
    section: 'vardag',
    inDrawer: false,
    parentId: 'hamn',
  },
  {
    id: 'projekt',
    label: 'Projekt',
    path: '/projekt',
    section: 'vardag',
    inDrawer: false,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'projekt_ny',
    label: 'Nytt projekt',
    path: '/admin/projects/ny',
    section: 'vardag',
    inDrawer: false,
    parentId: 'projekt',
  },
  {
    id: 'projekt_handling',
    label: 'Till Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: false,
    parentId: 'projekt',
  },
  {
    id: 'drogfrihet',
    label: 'Drogfrihet',
    path: '/drogfrihet',
    section: 'vardag',
    inDrawer: false,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'drogfrihet_idag',
    label: 'Idag',
    path: '/drogfrihet?tab=idag',
    section: 'vardag',
    inDrawer: false,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_resurser',
    label: 'Akut & stöd',
    path: '/drogfrihet?tab=resurser',
    section: 'vardag',
    inDrawer: false,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_reflektion',
    label: 'Reflektion',
    path: '/drogfrihet?tab=reflektion',
    section: 'vardag',
    inDrawer: false,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_kunskap',
    label: 'Kunskap',
    path: '/drogfrihet?tab=kunskap',
    section: 'vardag',
    inDrawer: false,
    parentId: 'drogfrihet',
  },
  {
    id: 'installningar',
    label: 'Inställningar',
    path: '/installningar',
    section: 'vardag',
    inDrawer: true,
  },
  {
    id: 'installningar_allmant',
    label: 'Allmänt',
    path: '/installningar?tab=allmant',
    section: 'vardag',
    inDrawer: false,
    parentId: 'installningar',
  },
  {
    id: 'installningar_drogfrihet',
    label: 'Drogfrihet',
    path: '/installningar?tab=drogfrihet',
    section: 'vardag',
    inDrawer: false,
    parentId: 'installningar',
  },

  // —— Valv (PIN) — platta drawer-rader + legacy deep links ——
  {
    id: 'valv_samla',
    label: VALV_ZONE_LABELS.samla,
    path: vaultDrawerPath('logga'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    themeId: 'J-valv-pansar',
    drawerHint: VALV_DRAWER_HINTS.samla,
  },
  {
    id: 'valv_analysera',
    label: VALV_ZONE_LABELS.analysera,
    path: vaultDrawerPath('monster'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.analysera,
  },
  {
    id: 'valv_kunskap_nav',
    label: VALV_ZONE_LABELS.kunskap,
    path: vaultDrawerPath('kunskapsbank'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.kunskap,
  },
  {
    id: 'valv_exportera',
    label: VALV_ZONE_LABELS.exportera,
    path: vaultDrawerPath('dossier'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.exportera,
  },
  {
    id: 'valv_forensik',
    label: VALV_ZONE_LABELS.forensik,
    path: vaultDrawerPath('hamn_analys'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.forensik,
  },
  // Legacy grupp + blad (deep links, ej drawer)
  {
    id: 'valv_grp_samla',
    label: VALV_ZONE_LABELS.samla,
    path: '',
    section: 'valv',
    inDrawer: false,
    isGroupHeader: true,
    requiresVaultPin: true,
    themeId: 'J-valv-pansar',
    drawerHint: VALV_DRAWER_HINTS.samla,
  },
  valvLeaf('valv_arkiv', 'logga', 'valv_grp_samla'),
  valvLeaf('valv_triage', 'sok', 'valv_grp_samla'),
  {
    id: 'valv_grp_analysera',
    label: VALV_ZONE_LABELS.analysera,
    path: '',
    section: 'valv',
    inDrawer: false,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.analysera,
  },
  valvLeaf('valv_monster', 'monster', 'valv_grp_analysera'),
  valvLeaf('valv_orkester', 'orkester', 'valv_grp_analysera'),
  {
    id: 'valv_grp_exportera',
    label: VALV_ZONE_LABELS.exportera,
    path: '',
    section: 'valv',
    inDrawer: false,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.exportera,
  },
  valvLeaf('valv_dossier', 'dossier', 'valv_grp_exportera'),
  {
    id: 'valv_dossier_export',
    label: 'Dossier · full vy',
    path: '/dossier',
    section: 'valv',
    inDrawer: false,
    requiresVaultPin: true,
    parentId: 'valv_grp_exportera',
  },
  {
    id: 'valv_grp_kunskap',
    label: VALV_ZONE_LABELS.kunskap,
    path: '',
    section: 'valv',
    inDrawer: false,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.kunskap,
  },
  valvLeaf(
    'valv_kunskapsbank',
    'kunskapsbank',
    'valv_grp_kunskap',
    VALV_KUNSKAP_DRAWER_LEAF.kunskapsbank,
  ),
  valvLeaf(
    'valv_aktorskarta',
    'aktorskarta',
    'valv_grp_kunskap',
    VALV_KUNSKAP_DRAWER_LEAF.aktorskarta,
  ),
  {
    id: 'valv_grp_forensik',
    label: VALV_ZONE_LABELS.forensik,
    path: '',
    section: 'valv',
    inDrawer: false,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.forensik,
  },
  ...FORENSIC_VAULT_TAB_IDS.map((tab) => ({
    id: `valv_${tab}`,
    label: forensicVaultTabLabel(tab),
    path: vaultDrawerPath(tab),
    section: 'valv' as const,
    inDrawer: false,
    requiresVaultPin: true,
    parentId: 'valv_grp_forensik',
  })),
];

export const DRAWER_NAV_TRUTH = NAV_TRUTH.filter((e) => e.inDrawer);

export function isDrawerEntryVisible(entry: NavTruthEntry): boolean {
  if (entry.omitWhenHideBevis && HIDE_BEVIS_TAB) return false;
  return true;
}

export function getVisibleDrawerTruth(section: NavDrawerSection): NavTruthEntry[] {
  return DRAWER_NAV_TRUTH.filter((e) => e.section === section && isDrawerEntryVisible(e));
}

export const DRAWER_VARDAG_ENTRIES = getVisibleDrawerTruth('vardag');

export const DRAWER_VALV_ENTRIES = getVisibleDrawerTruth('valv');

/** Hub-rader utan parentId (legacy drawerNav). */
export const DRAWER_HUB_TRUTH = DRAWER_NAV_TRUTH.filter((e) => !e.parentId && isDrawerEntryVisible(e));

export function getNavTruthById(id: string): NavTruthEntry | undefined {
  return NAV_TRUTH.find((e) => e.id === id);
}

export function getDrawerChildren(parentId: string, section: NavDrawerSection): NavTruthEntry[] {
  return getVisibleDrawerTruth(section).filter((e) => e.parentId === parentId);
}

/** All hub-underflikar (även dolda i drawer) — för TabBar i sidor. */
export function getNavChildren(parentId: string, section: NavDrawerSection): NavTruthEntry[] {
  return NAV_TRUTH.filter((e) => e.section === section && e.parentId === parentId);
}

/** Vardag: hubbar utan parent. Valv: platta rader utan parent. */
export function getDrawerRoots(section: NavDrawerSection): NavTruthEntry[] {
  const visible = getVisibleDrawerTruth(section);
  if (section === 'valv') return visible.filter((e) => !e.parentId && !e.isGroupHeader);
  return visible.filter((e) => !e.parentId);
}

export function drawerHubHasChildren(hubId: string, section: NavDrawerSection): boolean {
  return getDrawerChildren(hubId, section).length > 0;
}
