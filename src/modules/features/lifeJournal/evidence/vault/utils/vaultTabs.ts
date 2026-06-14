import { BookOpen, Users } from 'lucide-react';
import { FORENSIC_VAULT_TAB_LABELS } from '@/core/copy/valvNavCopy';

export { VALV_ZONE_INGRESS, FORENSIC_TAB_INGRESS } from '@/core/copy/valvNavCopy';

/** Samla — arkiv + triage/chat. */
export const SAMLA_VAULT_TAB_IDS = ['logga', 'sok'] as const;

/** Analysera — mönster + orkester (locked UX). */
export const ANALYSERA_VAULT_TAB_IDS = ['monster', 'orkester'] as const;

/** Exportera — dossier. */
export const EXPORTERA_VAULT_TAB_IDS = ['dossier'] as const;

/** Legacy union — alla huvudflikar utom kunskap/forensik. */
export const PANSARET_VAULT_TAB_IDS = [
  ...SAMLA_VAULT_TAB_IDS,
  ...ANALYSERA_VAULT_TAB_IDS,
  ...EXPORTERA_VAULT_TAB_IDS,
] as const;

export type SamlaVaultTab = (typeof SAMLA_VAULT_TAB_IDS)[number];
export type AnalyseraVaultTab = (typeof ANALYSERA_VAULT_TAB_IDS)[number];
export type ExporteraVaultTab = (typeof EXPORTERA_VAULT_TAB_IDS)[number];

export const KUNSKAP_VAULT_TAB = 'kunskapsbank' as const;
export const AKTORSKARTA_VAULT_TAB = 'aktorskarta' as const;

export const KUNSKAP_VAULT_TAB_IDS = [KUNSKAP_VAULT_TAB, AKTORSKARTA_VAULT_TAB] as const;
export type KunskapVaultTab = (typeof KUNSKAP_VAULT_TAB_IDS)[number];

/** Utvecklingszon (Vit) — separat från bevis-WORM. */
export const VIT_VAULT_TAB = 'mitt_vit' as const;
export const VIT_VAULT_TAB_IDS = [VIT_VAULT_TAB] as const;
export type VitVaultTab = (typeof VIT_VAULT_TAB_IDS)[number];

/** Synliga zoner i TabBar / ValvInputSuperModule (inbox borttagen — granska-läge i samla). */
export const VALV_ZONE_VISIBLE_IDS = [
  'samla',
  'analysera',
  'kunskap',
  'vit',
  'exportera',
  'forensik',
] as const;

/** Legacy drawer/deep link — mappa till `valvMode=granska`, inte forensic tab. */
export const LEGACY_INBOX_VAULT_TAB = 'inbox' as const;

/** @deprecated inbox-zon — använd granska-läge i ValvInputSuperModule. */
export const VALV_ZONE_IDS = [...VALV_ZONE_VISIBLE_IDS] as const;

export type ValvZone = (typeof VALV_ZONE_VISIBLE_IDS)[number];

export type PansaretVaultTab = (typeof PANSARET_VAULT_TAB_IDS)[number];

export const MAIN_VAULT_TAB_IDS = [...PANSARET_VAULT_TAB_IDS, ...KUNSKAP_VAULT_TAB_IDS] as const;

export const FORENSIC_VAULT_TAB_IDS = [
  'hamn_analys',
  'speglar_fordjupat',
  'dagbok_arkiv',
  'familjen_monster',
  'arbetsliv_franvaro',
  'arbetsliv_lon',
] as const;

export type MainVaultTab = (typeof MAIN_VAULT_TAB_IDS)[number];
export type ForensicVaultTab = (typeof FORENSIC_VAULT_TAB_IDS)[number];
export type VaultTab = MainVaultTab | ForensicVaultTab | VitVaultTab;

export function resolveValvZone(tab: VaultTab): ValvZone {
  if (isVitVaultTab(tab)) return 'vit';
  if (isKunskapVaultTab(tab)) return 'kunskap';
  if (isForensicVaultTab(tab)) return 'forensik';
  if ((EXPORTERA_VAULT_TAB_IDS as readonly string[]).includes(tab)) return 'exportera';
  if ((ANALYSERA_VAULT_TAB_IDS as readonly string[]).includes(tab)) return 'analysera';
  return 'samla';
}

export function isSamlaVaultTab(tab: VaultTab): tab is SamlaVaultTab {
  return (SAMLA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isAnalyseraVaultTab(tab: VaultTab): tab is AnalyseraVaultTab {
  return (ANALYSERA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isExporteraVaultTab(tab: VaultTab): tab is ExporteraVaultTab {
  return (EXPORTERA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isKunskapVaultTab(tab: VaultTab): tab is KunskapVaultTab {
  return (KUNSKAP_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isVitVaultTab(tab: VaultTab): tab is VitVaultTab {
  return (VIT_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isPansaretVaultTab(tab: VaultTab): tab is PansaretVaultTab {
  return (PANSARET_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

const ALL_VAULT_TABS = new Set<string>([
  ...MAIN_VAULT_TAB_IDS,
  ...FORENSIC_VAULT_TAB_IDS,
  ...VIT_VAULT_TAB_IDS,
]);

export function parseVaultTab(raw: string | null): VaultTab {
  if (raw && ALL_VAULT_TABS.has(raw)) return raw as VaultTab;
  return 'logga';
}

export function isForensicVaultTab(tab: VaultTab): tab is ForensicVaultTab {
  return (FORENSIC_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function forensicVaultTabLabel(tab: ForensicVaultTab): string {
  return FORENSIC_VAULT_TAB_LABELS[tab];
}

export const VAULT_TAB_ICONS = {
  kunskapsbank: BookOpen,
  aktorskarta: Users,
} as const;
