/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { HIDE_BEVIS_TAB } from './navFlags';

/** Kärn-sanning för routes — inga överlappande paths tillåtna. */
export const NAV_PATHS = {
  HOME: '/',
  HJARTAT: '/hjartat',
  VALVET: '/valvet',
  VARDAGEN: '/vardagen',
  FAMILJEN: '/familjen',
  BARNEN: '/barnen',
} as const;
import {
  FORENSIC_VAULT_TAB_IDS,
  forensicVaultTabLabel,
  LEGACY_INBOX_VAULT_TAB,
  MAIN_VAULT_TAB_IDS,
  parseVaultTab,
} from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import {
  resolveValvInputModeFromVaultTab,
  vaultTabForValvInputMode,
} from '@/features/lifeJournal/evidence/vault/supermodule/valvInputModes';
import {
  DAGBOK_BEVIS_DRAWER_LABEL,
  VALV_DRAWER_HINTS,
  VALV_KUNSKAP_DRAWER_LEAF,
  VALV_ZONE_LABELS,
  VAULT_MAIN_TAB_LABELS,
} from '../copy/valvNavCopy';

/** Bevis-etikett — endast Valv-drawer; Hjärtat har ingen bevis-flik. */
export { DAGBOK_BEVIS_DRAWER_LABEL };

export type NavDrawerSection = 'vardag' | 'valv';

export type NavTruthEntry = {
  id: string;
  label: string;
  path: string;
  section: NavDrawerSection;
  inDrawer: boolean;
  requiresVaultPin?: boolean;
  parentId?: string;
  isGroupHeader?: boolean;
  drawerHint?: string;
  omitWhenHideBevis?: boolean;
  inDock?: boolean;
  fyrenHomeQuick?: boolean;
  themeId?: string;
};

export function vaultDrawerPath(vaultTab: string): string {
  if (vaultTab === LEGACY_INBOX_VAULT_TAB) {
    return `${NAV_PATHS.VALVET}?valvMode=granska&vaultTab=logga`;
  }
  const tab = parseVaultTab(vaultTab);
  const mode = resolveValvInputModeFromVaultTab(tab);
  const canonicalTab = vaultTabForValvInputMode(mode, tab);
  return `${NAV_PATHS.VALVET}?vaultTab=${canonicalTab}&valvMode=${mode}`;
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
  // —— Vardag ——
  { id: 'hem', label: 'Hem — Skriv', path: '/', section: 'vardag', inDrawer: true, themeId: 'J-fyren-hem' },
  {
    id: 'vardagen',
    label: 'Liv och göra',
    path: '/vardagen',
    section: 'vardag',
    inDrawer: true,
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
    id: 'vardagen_mabra',
    label: 'MåBra',
    path: '/mabra',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_handling',
    label: 'Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_arbetsliv',
    label: 'Arbetsliv',
    path: '/arbetsliv/input',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_ekonomi',
    label: 'Plånbok',
    path: '/vardagen?tab=ekonomi',
    section: 'vardag',
    inDrawer: false,
    parentId: 'vardagen',
  },
  {
    id: 'familjen',
    label: 'Familj och gränser',
    path: '/familj',
    section: 'vardag',
    inDrawer: true,
    inDock: true,
    themeId: 'J-familjen-varm',
  },
  {
    id: 'familjen_reflektion',
    label: 'Barnfokus',
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
    id: 'familjen_hamn',
    label: 'Trygg hamn',
    path: '/familjen?tab=hamn',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'familjen_drogfrihet',
    label: 'Drogfrihet',
    path: '/familjen?tab=drogfrihet',
    section: 'vardag',
    inDrawer: false,
    parentId: 'familjen',
  },
  {
    id: 'dagbok',
    label: 'Hjärtat',
    path: NAV_PATHS.HJARTAT,
    section: 'vardag',
    inDrawer: false,
    fyrenHomeQuick: true,
    themeId: 'J-valv-pansar',
  },
  {
    id: 'dagbok_reflektion',
    label: 'Reflektion',
    path: `${NAV_PATHS.HJARTAT}?tab=reflektion`,
    section: 'vardag',
    inDrawer: false,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_speglar',
    label: 'Speglar',
    path: `${NAV_PATHS.HJARTAT}?tab=speglar`,
    section: 'vardag',
    inDrawer: false,
    parentId: 'dagbok',
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
    id: 'installningar_naring',
    label: 'Näring',
    path: '/installningar?tab=naring',
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
  {
    id: 'arbetsliv',
    label: 'Arbetsliv',
    path: '/arbetsliv/input',
    section: 'vardag',
    inDrawer: false,
  },
  {
    id: 'arbetsliv_stampla',
    label: 'Stämpel',
    path: '/arbetsliv/input',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_tid',
    label: 'Tid',
    path: '/arbetsliv/input?inputMode=tid',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_inkomster',
    label: 'Inkomster',
    path: '/arbetsliv/input?inputMode=inkomster',
    section: 'vardag',
    inDrawer: false,
    parentId: 'arbetsliv',
  },

  // —— Valv (PIN) ——
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
    id: 'valv_vit',
    label: VALV_ZONE_LABELS.vit,
    path: vaultDrawerPath('mitt_vit'),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.vit,
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
  {
    id: 'valv_granska',
    label: 'Granska',
    path: `${NAV_PATHS.VALVET}?valvMode=granska&vaultTab=logga`,
    section: 'valv',
    inDrawer: false,
    requiresVaultPin: true,
    parentId: 'valv_grp_samla',
  },
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
  valvLeaf('valv_docs', 'docs', 'valv_grp_kunskap', VALV_KUNSKAP_DRAWER_LEAF.docs),
  {
    id: 'valv_grp_forensik',
    label: VALV_ZONE_LABELS.forensik,
    path: '',
    section: 'valv',
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: VALV_DRAWER_HINTS.forensik,
    inDrawer: false,
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

export function isDrawerEntryVisible(entry: NavTruthEntry, vaultSessionOpen = false): boolean {
  if (entry.omitWhenHideBevis && HIDE_BEVIS_TAB && !vaultSessionOpen) return false;
  return true;
}

export function getVisibleDrawerTruth(section: NavDrawerSection, vaultSessionOpen = false): NavTruthEntry[] {
  return DRAWER_NAV_TRUTH.filter((e) => e.section === section && isDrawerEntryVisible(e, vaultSessionOpen));
}

export const DRAWER_VARDAG_ENTRIES = getVisibleDrawerTruth('vardag');
export const DRAWER_VALV_ENTRIES = getVisibleDrawerTruth('valv');

export const DRAWER_HUB_TRUTH = DRAWER_NAV_TRUTH.filter((e) => !e.parentId && isDrawerEntryVisible(e));

export function getNavTruthById(id: string): NavTruthEntry | undefined {
  return NAV_TRUTH.find((e) => e.id === id);
}

export function getDrawerChildren(parentId: string, section: NavDrawerSection, vaultSessionOpen = false): NavTruthEntry[] {
  return getVisibleDrawerTruth(section, vaultSessionOpen).filter((e) => e.parentId === parentId);
}

export function getNavChildren(parentId: string, section: NavDrawerSection): NavTruthEntry[] {
  return NAV_TRUTH.filter((e) => e.section === section && e.parentId === parentId);
}

export function getDrawerRoots(section: NavDrawerSection, vaultSessionOpen = false): NavTruthEntry[] {
  const visible = getVisibleDrawerTruth(section, vaultSessionOpen);
  if (section === 'valv') return visible.filter((e) => !e.parentId && !e.isGroupHeader);
  return visible.filter((e) => !e.parentId);
}

export function drawerHubHasChildren(hubId: string, section: NavDrawerSection, vaultSessionOpen = false): boolean {
  return getDrawerChildren(hubId, section, vaultSessionOpen).length > 0;
}
