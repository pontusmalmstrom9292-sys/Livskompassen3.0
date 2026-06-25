import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import {
  KUNSKAP_VAULT_TAB,
  LEGACY_INBOX_VAULT_TAB,
  VIT_VAULT_TAB,
  parseVaultTab,
  resolveValvZone,
  type ValvZone,
  type VaultTab,
} from '../utils/vaultTabs';

/** Legacy URL — `?valvMode=spara` mappas till arkiv. */
export const LEGACY_SPARA_VALV_MODE = 'spara' as const;

/** Primära Valv-lägen — 3 synliga pills + «Mer…» (granska = deeplink). */
export const VALV_INPUT_MODE_IDS = [
  'arkiv',
  'granska',
  'analysera',
  'kunskap',
  'vit',
  'rapporter',
  'mer',
] as const;

export type ValvInputMode = (typeof VALV_INPUT_MODE_IDS)[number];

export const DEFAULT_VALV_INPUT_MODE: ValvInputMode = 'arkiv';

export type ValvInputModeTier = 'primary' | 'more' | 'deeplink';

export type ValvInputModeDef = {
  id: ValvInputMode;
  label: string;
  description: string;
  /** Primär rad · «Mer…» · endast deeplink (ej i picker). */
  tier: ValvInputModeTier;
  zone: ValvZone;
  defaultVaultTab: VaultTab;
};

export const VALV_INPUT_MODES: ValvInputModeDef[] = [
  {
    id: 'arkiv',
    label: 'Arkiv',
    description: 'Inkast, granska och sök — allt samlat',
    tier: 'primary',
    zone: 'samla',
    defaultVaultTab: 'logga',
  },
  {
    id: 'granska',
    label: 'Granska',
    description: 'Godkänn inkommande till WORM',
    tier: 'deeplink',
    zone: 'samla',
    defaultVaultTab: 'logga',
  },
  {
    id: 'analysera',
    label: 'Analysera',
    description: 'Mönster och meddelanden',
    tier: 'primary',
    zone: 'analysera',
    defaultVaultTab: 'monster',
  },
  {
    id: 'kunskap',
    label: 'Kunskap',
    description: 'Kunskapsbank, personer och kanon',
    tier: 'primary',
    zone: 'kunskap',
    defaultVaultTab: KUNSKAP_VAULT_TAB,
  },
  {
    id: 'vit',
    label: VIT_VAULT_TAB_LABEL,
    description: 'Frågekort och reflektioner — personlig utveckling',
    tier: 'more',
    zone: 'vit',
    defaultVaultTab: VIT_VAULT_TAB,
  },
  {
    id: 'rapporter',
    label: 'Rapporter',
    description: 'Dossier och export',
    tier: 'more',
    zone: 'exportera',
    defaultVaultTab: 'dossier',
  },
  {
    id: 'mer',
    label: 'Mer',
    description: 'Hamn, Speglar och djupare vyer',
    tier: 'more',
    zone: 'forensik',
    defaultVaultTab: 'hamn_analys',
  },
];

export const VALV_INPUT_MODES_PRIMARY = VALV_INPUT_MODES.filter((m) => m.tier === 'primary');
export const VALV_INPUT_MODES_MORE = VALV_INPUT_MODES.filter((m) => m.tier === 'more');
export const VALV_INPUT_MODES_PICKER = VALV_INPUT_MODES.filter((m) => m.tier !== 'deeplink');

const MODE_BY_ID = Object.fromEntries(VALV_INPUT_MODES.map((m) => [m.id, m])) as Record<
  ValvInputMode,
  ValvInputModeDef
>;

export function valvInputModeDef(mode: ValvInputMode): ValvInputModeDef {
  return MODE_BY_ID[mode];
}

/** Normalisera legacy `spara` → arkiv. */
export function normalizeValvInputMode(raw: string | null): ValvInputMode | null {
  if (raw === LEGACY_SPARA_VALV_MODE) return 'arkiv';
  if (raw && (VALV_INPUT_MODE_IDS as readonly string[]).includes(raw)) {
    return raw as ValvInputMode;
  }
  return null;
}

export function parseValvInputMode(raw: string | null): ValvInputMode {
  return normalizeValvInputMode(raw) ?? DEFAULT_VALV_INPUT_MODE;
}

/** Legacy `?samlaView=granska` · `?vaultTab=inbox` → granska-läge. */
export function parseValvInputModeFromSearch(
  valvMode: string | null,
  samlaView: string | null,
  vaultTabRaw?: string | null,
): ValvInputMode {
  if (samlaView === 'granska') return 'granska';
  if (vaultTabRaw === LEGACY_INBOX_VAULT_TAB) return 'granska';
  const normalized = normalizeValvInputMode(valvMode);
  if (normalized) return normalized;
  if (vaultTabRaw) {
    return resolveValvInputModeFromVaultTab(parseVaultTab(vaultTabRaw));
  }
  return DEFAULT_VALV_INPUT_MODE;
}

export function resolveValvInputModeFromVaultTab(tab: VaultTab): ValvInputMode {
  const zone = resolveValvZone(tab);
  if (zone === 'samla') {
    return DEFAULT_VALV_INPUT_MODE;
  }
  const match = VALV_INPUT_MODES.find((m) => m.zone === zone);
  return match?.id ?? DEFAULT_VALV_INPUT_MODE;
}

export function valvModeMatchesVaultTab(mode: ValvInputMode, tab: VaultTab): boolean {
  if (mode === 'granska') {
    return resolveValvZone(tab) === 'samla';
  }
  if (mode === 'arkiv') {
    return resolveValvZone(tab) === 'samla';
  }
  return valvInputModeDef(mode).zone === resolveValvZone(tab);
}

export function vaultTabForValvInputMode(mode: ValvInputMode, currentTab?: VaultTab): VaultTab {
  const def = valvInputModeDef(mode);
  if (mode === 'granska') return 'logga';
  if (mode === 'arkiv' && currentTab === 'sok') return 'sok';
  if (currentTab && resolveValvZone(currentTab) === def.zone) {
    return currentTab;
  }
  return def.defaultVaultTab;
}

/** Kanon URL-par — valvMode vinner (Fas 1B). Legacy spara → arkiv. */
export function canonicalValvRoute(
  valvModeRaw: string | null,
  vaultTabRaw?: string | null,
  samlaViewRaw?: string | null,
): { vaultTab: VaultTab; valvMode: ValvInputMode } {
  const mode = parseValvInputModeFromSearch(valvModeRaw, samlaViewRaw ?? null, vaultTabRaw ?? null);
  const parsedTab = parseVaultTab(vaultTabRaw === LEGACY_INBOX_VAULT_TAB ? null : (vaultTabRaw ?? null));
  const tab = vaultTabForValvInputMode(mode, parsedTab);
  const canonMode = mode === 'granska' ? mode : normalizeValvInputMode(valvModeRaw) ?? mode;
  return { vaultTab: tab, valvMode: canonMode };
}

export function buildValvSearchParams(
  valvMode: ValvInputMode,
  vaultTab?: VaultTab,
): URLSearchParams {
  const { vaultTab: tab, valvMode: mode } = canonicalValvRoute(valvMode, vaultTab);
  const params = new URLSearchParams();
  params.set('valvMode', mode);
  params.set('vaultTab', tab);
  return params;
}
