import { BookOpen, Users } from 'lucide-react';

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

export const VALV_ZONE_IDS = ['samla', 'analysera', 'kunskap', 'exportera', 'forensik'] as const;

export type ValvZone = (typeof VALV_ZONE_IDS)[number];

/** V1 — en rad lågaffektiv copy per zon (zon-byte i VaultPage). */
export const VALV_ZONE_INGRESS: Record<ValvZone, string> = {
  samla: 'Samla in bevis och sök i loggen.',
  analysera: 'Mönster och Orkester — över tid, inte i stunden.',
  kunskap: 'Fakta bakom PIN: Kunskapsbank och Aktörskarta.',
  exportera: 'Dossier för export och översikt.',
  forensik: 'Hamn och fördjupad analys — ett steg i taget.',
};
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
export type VaultTab = MainVaultTab | ForensicVaultTab;

export function resolveValvZone(tab: VaultTab): ValvZone {
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

export function isPansaretVaultTab(tab: VaultTab): tab is PansaretVaultTab {
  return (PANSARET_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

const ALL_VAULT_TABS = new Set<string>([...MAIN_VAULT_TAB_IDS, ...FORENSIC_VAULT_TAB_IDS]);

export function parseVaultTab(raw: string | null): VaultTab {
  if (raw && ALL_VAULT_TABS.has(raw)) return raw as VaultTab;
  return 'logga';
}

export function isForensicVaultTab(tab: VaultTab): tab is ForensicVaultTab {
  return (FORENSIC_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function forensicVaultTabLabel(tab: ForensicVaultTab): string {
  const labels: Record<ForensicVaultTab, string> = {
    hamn_analys: 'Hamn · Analys',
    speglar_fordjupat: 'Speglar · Fördjupat',
    dagbok_arkiv: 'Dagbok · Arkiv',
    familjen_monster: 'Familjen · Mönster',
    arbetsliv_franvaro: 'Arbetsliv · Frånvaro',
    arbetsliv_lon: 'Arbetsliv · Lön',
  };
  return labels[tab];
}

/** V2 — en rad ingress per forensik-underflik (ingen rules-ändring). */
export const FORENSIC_TAB_INGRESS: Record<ForensicVaultTab, string> = {
  hamn_analys: 'Full BIFF-triage och spara som bevis — bakom skölden.',
  speglar_fordjupat: 'Validering och jämförelse mot arkiv — inget auto-svar till ex.',
  dagbok_arkiv: 'Läsa journal — WORM, ingen redigering.',
  familjen_monster: 'Mönster i barnens loggar — separat silo.',
  arbetsliv_franvaro: 'Frånvaro och ekonomi under PIN.',
  arbetsliv_lon: 'Lön och period — forensik, inte vardagsvy.',
};

export const VAULT_TAB_ICONS = {
  kunskapsbank: BookOpen,
  aktorskarta: Users,
} as const;
