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

const VAULT_MAIN_LABELS: Record<(typeof MAIN_VAULT_TAB_IDS)[number], string> = {
  logga: 'Arkiv',
  sok: 'Triage',
  monster: 'Mönster',
  orkester: 'Orkester',
  dossier: 'Dossier',
  kunskapsbank: 'Kunskapsbank',
};

function valvLeaf(
  id: string,
  vaultTab: string,
  parentId: string,
  label?: string,
): NavTruthEntry {
  return {
    id,
    label: label ?? VAULT_MAIN_LABELS[vaultTab as keyof typeof VAULT_MAIN_LABELS] ?? vaultTab,
    path: vaultDrawerPath(vaultTab),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    parentId,
  };
}

export const NAV_TRUTH: NavTruthEntry[] = [
  // —— Vardag —— (hub-ordning: Dagbok → Vardagen → MåBra → Familjen → verktyg → Hamn → Projekt → Drogfrihet → Inställningar)
  { id: 'hem', label: 'Hem Kompass', path: '/', section: 'vardag', inDrawer: true, themeId: 'J-fyren-hem' },
  {
    id: 'hem_inkast',
    label: 'Inkast',
    path: '/#inkast-lite',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hem',
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    path: '/dagbok',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-valv-pansar',
  },
  {
    id: 'dagbok_reflektion',
    label: 'Reflektion',
    path: '/dagbok?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_speglar',
    label: 'Speglar',
    path: '/dagbok?tab=speglar',
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_bevis',
    label: 'Bevis (Valv)',
    path: vaultDrawerPath('logga'),
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
    requiresVaultPin: true,
    omitWhenHideBevis: true,
  },
  {
    id: 'vardagen',
    label: 'Vardagen',
    path: '/vardagen',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'vardagen_kompasser',
    label: 'Kompasser',
    path: '/vardagen?tab=kompasser',
    section: 'vardag',
    inDrawer: true,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_ekonomi',
    label: 'Ekonomi',
    path: '/vardagen?tab=ekonomi',
    section: 'vardag',
    inDrawer: true,
    parentId: 'vardagen',
  },
  {
    id: 'mabra',
    label: 'MåBra',
    path: '/mabra',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'familjen',
    label: 'Familjen',
    path: '/familjen',
    section: 'vardag',
    inDrawer: true,
    inDock: true,
    themeId: 'J-familjen-varm',
  },
  {
    id: 'familjen_reflektion',
    label: 'Reflektion',
    path: '/familjen?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'familjen_livslogg',
    label: 'Livslogg',
    path: '/familjen?tab=livslogg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'familjen_tillsammans',
    label: 'Tillsammans',
    path: '/familjen?tab=tillsammans',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'planering',
    label: 'Planering',
    path: '/planering',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'planering_handling',
    label: 'Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'planering_fokus',
    label: 'Fokus',
    path: '/planering?tab=fokus',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'planering_inkorg',
    label: 'Inkorg',
    path: '/planering?tab=inkorg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'arbetsliv',
    label: 'Arbetsliv',
    path: '/arbetsliv',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'arbetsliv_stampla',
    label: 'Stämpel',
    path: '/arbetsliv?tab=stampla',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_tid',
    label: 'Tid & flex',
    path: '/arbetsliv?tab=tid',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_logg',
    label: 'Logg',
    path: '/arbetsliv?tab=logg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'hamn',
    label: 'Trygg hamn',
    path: '/hamn',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-hamn-greyrock',
  },
  {
    id: 'hamn_oversikt',
    label: 'Översikt',
    path: '/hamn?tab=oversikt',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_biff',
    label: 'BIFF',
    path: '/hamn?tab=biff',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_speglar',
    label: 'Speglar',
    path: '/hamn?tab=speglar',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_barn',
    label: 'Barnfokus',
    path: '/hamn?tab=barn',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'projekt',
    label: 'Projekt',
    path: '/projekt',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'projekt_ny',
    label: 'Nytt projekt',
    path: '/admin/projects/ny',
    section: 'vardag',
    inDrawer: true,
    parentId: 'projekt',
  },
  {
    id: 'projekt_handling',
    label: 'Till Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: true,
    parentId: 'projekt',
  },
  {
    id: 'drogfrihet',
    label: 'Drogfrihet',
    path: '/drogfrihet',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'drogfrihet_idag',
    label: 'Idag',
    path: '/drogfrihet?tab=idag',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_resurser',
    label: 'Stöd',
    path: '/drogfrihet?tab=resurser',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_reflektion',
    label: 'Reflektion',
    path: '/drogfrihet?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_kunskap',
    label: 'Stöd & resurser',
    path: '/drogfrihet?tab=kunskap',
    section: 'vardag',
    inDrawer: true,
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
    inDrawer: true,
    parentId: 'installningar',
  },
  {
    id: 'installningar_drogfrihet',
    label: 'Drogfrihet',
    path: '/installningar?tab=drogfrihet',
    section: 'vardag',
    inDrawer: true,
    parentId: 'installningar',
  },

  // —— Valv (PIN) — grupperade accordion ——
  {
    id: 'valv_grp_pansaret',
    label: 'Pansaret',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    themeId: 'J-valv-pansar',
  },
  valvLeaf('valv_arkiv', 'logga', 'valv_grp_pansaret'),
  valvLeaf('valv_triage', 'sok', 'valv_grp_pansaret'),
  valvLeaf('valv_monster', 'monster', 'valv_grp_pansaret'),
  valvLeaf('valv_orkester', 'orkester', 'valv_grp_pansaret'),
  valvLeaf('valv_dossier', 'dossier', 'valv_grp_pansaret'),
  {
    id: 'valv_dossier_export',
    label: 'Dossier · full vy',
    path: '/dossier',
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    parentId: 'valv_grp_pansaret',
  },
  {
    id: 'valv_grp_kunskap',
    label: 'Kunskap',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
  },
  valvLeaf('valv_kunskapsbank', 'kunskapsbank', 'valv_grp_kunskap'),
  {
    id: 'valv_grp_forensik',
    label: 'Forensik',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
  },
  ...FORENSIC_VAULT_TAB_IDS.map((tab) => ({
    id: `valv_${tab}`,
    label: forensicVaultTabLabel(tab),
    path: vaultDrawerPath(tab),
    section: 'valv' as const,
    inDrawer: true,
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

/** Vardag: hubbar utan parent. Valv: grupp-rubriker. */
export function getDrawerRoots(section: NavDrawerSection): NavTruthEntry[] {
  const visible = getVisibleDrawerTruth(section);
  if (section === 'valv') return visible.filter((e) => e.isGroupHeader);
  return visible.filter((e) => !e.parentId);
}

export function drawerHubHasChildren(hubId: string, section: NavDrawerSection): boolean {
  return getDrawerChildren(hubId, section).length > 0;
}
