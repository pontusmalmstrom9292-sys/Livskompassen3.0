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

/** Primära Valv-lägen — ersätter synlig 7-zons TabBar (inkl. borttagen inbox-zon). */
export const VALV_INPUT_MODE_IDS = [
  'spara',
  'granska',
  'analysera',
  'kunskap',
  'vit',
  'rapporter',
  'mer',
] as const;

export type ValvInputMode = (typeof VALV_INPUT_MODE_IDS)[number];

export const DEFAULT_VALV_INPUT_MODE: ValvInputMode = 'spara';

export type ValvInputModeDef = {
  id: ValvInputMode;
  label: string;
  description: string;
  /** Primär rad vs native «Mer…» (Fas 1B). */
  tier: 'primary' | 'more';
  zone: ValvZone;
  defaultVaultTab: VaultTab;
};

export const VALV_INPUT_MODES: ValvInputModeDef[] = [
  {
    id: 'spara',
    label: 'Inkast',
    description: 'Släpp fil eller text — spara till arkiv',
    tier: 'primary',
    zone: 'samla',
    defaultVaultTab: 'logga',
  },
  {
    id: 'granska',
    label: 'Granska',
    description: 'Godkänn inkommande till WORM',
    tier: 'primary',
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
    description: 'Kunskapsbank och personer',
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

const MODE_BY_ID = Object.fromEntries(VALV_INPUT_MODES.map((m) => [m.id, m])) as Record<
  ValvInputMode,
  ValvInputModeDef
>;

export function valvInputModeDef(mode: ValvInputMode): ValvInputModeDef {
  return MODE_BY_ID[mode];
}

export function parseValvInputMode(raw: string | null): ValvInputMode {
  if (raw && (VALV_INPUT_MODE_IDS as readonly string[]).includes(raw)) {
    return raw as ValvInputMode;
  }
  return DEFAULT_VALV_INPUT_MODE;
}

/** Legacy `?samlaView=granska` · `?vaultTab=inbox` → granska-läge. */
export function parseValvInputModeFromSearch(
  valvMode: string | null,
  samlaView: string | null,
  vaultTabRaw?: string | null,
): ValvInputMode {
  if (samlaView === 'granska') return 'granska';
  if (vaultTabRaw === LEGACY_INBOX_VAULT_TAB) return 'granska';
  if (valvMode && (VALV_INPUT_MODE_IDS as readonly string[]).includes(valvMode)) {
    return valvMode as ValvInputMode;
  }
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
  return valvInputModeDef(mode).zone === resolveValvZone(tab);
}

export function vaultTabForValvInputMode(mode: ValvInputMode, currentTab?: VaultTab): VaultTab {
  const def = valvInputModeDef(mode);
  if (mode === 'granska') return 'logga';
  if (mode === 'spara' && currentTab === 'sok') return 'sok';
  if (currentTab && resolveValvZone(currentTab) === def.zone) {
    return currentTab;
  }
  return def.defaultVaultTab;
}

/** Kanon URL-par — valvMode vinner (Fas 1B). */
export function canonicalValvRoute(
  valvModeRaw: string | null,
  vaultTabRaw?: string | null,
  samlaViewRaw?: string | null,
): { vaultTab: VaultTab; valvMode: ValvInputMode } {
  const mode = parseValvInputModeFromSearch(valvModeRaw, samlaViewRaw ?? null, vaultTabRaw ?? null);
  const parsedTab = parseVaultTab(vaultTabRaw === LEGACY_INBOX_VAULT_TAB ? null : (vaultTabRaw ?? null));
  const tab = vaultTabForValvInputMode(mode, parsedTab);
  return { vaultTab: tab, valvMode: mode };
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
