/** Valv-zoner — samma PIN, separat session per känsligt område. */
export type VaultZoneId =
  | 'valv_core'
  | 'hamn_forensic'
  | 'speglar_forensic'
  | 'familjen_forensic'
  | 'dagbok_forensic'
  | 'arbetsliv_forensic';

const ZONE_KEYS: Record<VaultZoneId, string> = {
  valv_core: 'livskompassen_vault_gate',
  hamn_forensic: 'livskompassen_vault_zone_hamn',
  speglar_forensic: 'livskompassen_vault_zone_speglar',
  familjen_forensic: 'livskompassen_vault_zone_familjen',
  dagbok_forensic: 'livskompassen_vault_zone_dagbok',
  arbetsliv_forensic: 'livskompassen_vault_zone_arbetsliv',
};

export function vaultZoneStorageKey(zone: VaultZoneId): string {
  return ZONE_KEYS[zone];
}

export const ALL_VAULT_ZONE_IDS: VaultZoneId[] = [
  'valv_core',
  'hamn_forensic',
  'speglar_forensic',
  'familjen_forensic',
  'dagbok_forensic',
  'arbetsliv_forensic',
];
