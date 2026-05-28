import { BookOpen } from 'lucide-react';

/** Pansaret — bevis, triage, mönster, orkester, dossier (ej Kunskapsbank). */
export const PANSARET_VAULT_TAB_IDS = ['logga', 'sok', 'monster', 'orkester', 'dossier'] as const;

export const KUNSKAP_VAULT_TAB = 'kunskapsbank' as const;

export const VALV_ZONE_IDS = ['pansaret', 'kunskap', 'forensik'] as const;

export type ValvZone = (typeof VALV_ZONE_IDS)[number];
export type PansaretVaultTab = (typeof PANSARET_VAULT_TAB_IDS)[number];

export const MAIN_VAULT_TAB_IDS = [...PANSARET_VAULT_TAB_IDS, KUNSKAP_VAULT_TAB] as const;

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
  if (tab === KUNSKAP_VAULT_TAB) return 'kunskap';
  if (isForensicVaultTab(tab)) return 'forensik';
  return 'pansaret';
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

export const VAULT_TAB_ICONS = {
  kunskapsbank: BookOpen,
} as const;
