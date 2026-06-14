import { getAuth } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { authenticateVaultGateUniversal } from '../auth/webauthn';
import { hasVaultGate, setVaultGate } from '../auth/sessionService';
import { functions } from '../firebase/init';
import { useStore } from '../store';
import { syncVaultUnlockedFromGate } from './vaultSessionLifecycle';

export type VaultWriteUnlockResult =
  | { ok: true; refreshed: boolean }
  | { ok: false; message: string };

async function isJwtVaultWriteAllowed(): Promise<boolean> {
  const user = getAuth().currentUser;
  if (!user) return false;
  try {
    const result = await user.getIdTokenResult();
    const unlocked = result.claims.vaultUnlocked === true;
    const expiresAt = result.claims.vaultExpiresAt;
    if (!unlocked || typeof expiresAt !== 'number') return false;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

/** Sätter vaultUnlocked JWT-claim via unlockVault + tvingar token-förnyelse. */
export async function applyVaultJwtClaim(): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const unlockVault = httpsCallable(functions, 'unlockVault');
    await unlockVault();
    const auth = getAuth();
    if (!auth.currentUser) {
      return { ok: false, message: 'Ingen inloggad användare.' };
    }
    await auth.currentUser.getIdToken(true);
    return { ok: true };
  } catch (err) {
    console.error('[vaultWriteUnlock] applyVaultJwtClaim:', err);
    return { ok: false, message: 'Kunde inte verifiera Valv-upplåsning via servern.' };
  }
}

/**
 * Säkerställer JWT vaultUnlocked + client-gate innan direkt Firestore-skriv till reality_vault.
 * Kräver biometri om claim saknas eller har gått ut (15 min).
 */
export async function ensureVaultWriteReady(): Promise<VaultWriteUnlockResult> {
  const { isAuthenticated } = useStore.getState();
  if (!isAuthenticated) {
    return { ok: false, message: 'Logga in för att spara i Valvet.' };
  }

  const jwtOk = await isJwtVaultWriteAllowed();
  if (jwtOk) {
    if (!hasVaultGate()) setVaultGate();
    syncVaultUnlockedFromGate();
    return { ok: true, refreshed: false };
  }

  const bio = await authenticateVaultGateUniversal();
  if (!bio.ok) {
    return { ok: false, message: 'Biometrisk verifiering avbröts eller misslyckades.' };
  }

  const claim = await applyVaultJwtClaim();
  if (claim.ok === false) {
    return { ok: false, message: claim.message };
  }

  setVaultGate();
  useStore.getState().setVaultUnlocked(true);

  const verified = await isJwtVaultWriteAllowed();
  if (!verified) {
    return { ok: false, message: 'Valv-upplåsning verifierades inte. Försök igen.' };
  }

  return { ok: true, refreshed: true };
}
