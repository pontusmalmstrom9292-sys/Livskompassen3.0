import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/init';
import type { VaultZoneId } from '../security/vaultZones';
import { vaultZoneStorageKey, ALL_VAULT_ZONE_IDS } from '../security/vaultZones';

const invalidateSessionCallable = httpsCallable(functions, 'invalidateSession');

/** Ett Valv-PIN (Fyren) — session varar 1 h vid aktivitet innan Zero Footprint. */
export const VAULT_SESSION_IDLE_MS = 60 * 60 * 1000;

/** Rensar server-side Vertex-cache (Zero Footprint). Tyst fel om offline. */
export async function invalidateServerSession(): Promise<void> {
  try {
    await invalidateSessionCallable();
  } catch (err) {
    console.warn('[ZeroFootprint] invalidateSession misslyckades:', err);
  }
}

/** @deprecated use vaultZoneStorageKey('valv_core') */
export const VAULT_GATE_KEY = vaultZoneStorageKey('valv_core');

export function setVaultGate(): void {
  setVaultZone('valv_core');
}

export function clearVaultGate(): void {
  clearVaultZone('valv_core');
}

export function hasVaultGate(): boolean {
  return hasVaultZone('valv_core');
}

export function setVaultZone(zone: VaultZoneId): void {
  sessionStorage.setItem(vaultZoneStorageKey(zone), '1');
}

export function clearVaultZone(zone: VaultZoneId): void {
  sessionStorage.removeItem(vaultZoneStorageKey(zone));
}

export function hasVaultZone(zone: VaultZoneId): boolean {
  return sessionStorage.getItem(vaultZoneStorageKey(zone)) === '1';
}

export function clearAllVaultZones(): void {
  for (const zone of ALL_VAULT_ZONE_IDS) {
    clearVaultZone(zone);
  }
}

export type { VaultZoneId };
