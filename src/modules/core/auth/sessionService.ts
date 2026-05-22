import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/init';

const invalidateSessionCallable = httpsCallable(functions, 'invalidateSession');

/** Rensar server-side Vertex-cache (Zero Footprint). Tyst fel om offline. */
export async function invalidateServerSession(): Promise<void> {
  try {
    await invalidateSessionCallable();
  } catch (err) {
    console.warn('[ZeroFootprint] invalidateSession misslyckades:', err);
  }
}

export const VAULT_GATE_KEY = 'livskompassen_vault_gate';

export function setVaultGate(): void {
  sessionStorage.setItem(VAULT_GATE_KEY, '1');
}

export function clearVaultGate(): void {
  sessionStorage.removeItem(VAULT_GATE_KEY);
}

export function hasVaultGate(): boolean {
  return sessionStorage.getItem(VAULT_GATE_KEY) === '1';
}
