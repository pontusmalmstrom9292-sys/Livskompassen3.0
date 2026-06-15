import { randomBytes } from 'crypto';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

/**
 * Server Valv-session TTL (1 h idle, sliding refresh on each assert).
 * Match client `VAULT_SESSION_IDLE_MS`.
 *
 * JWT-lager (`unlockVault` → `vaultUnlocked` / `vaultExpiresAt`) använder samma TTL vid unlock.
 * Callables: `vaultSessionToken`; klient-Firestore: JWT claims i `isVaultUnlocked()` rules.
 */
export const VAULT_SESSION_IDLE_MS = 60 * 60 * 1000;

function sessionRef(uid: string) {
  return admin.firestore().doc(`users/${uid}/private/vault_session`);
}

export function readVaultSessionToken(data: unknown): string | null {
  const token = (data as { vaultSessionToken?: unknown })?.vaultSessionToken;
  if (typeof token !== 'string') return null;
  const trimmed = token.trim();
  return trimmed.length >= 32 ? trimmed : null;
}

export async function issueVaultSession(
  uid: string,
): Promise<{ vaultSessionToken: string; expiresAt: string }> {
  const vaultSessionToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + VAULT_SESSION_IDLE_MS).toISOString();

  await sessionRef(uid).set({
    token: vaultSessionToken,
    expiresAt,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { vaultSessionToken, expiresAt };
}

export async function revokeVaultSession(uid: string): Promise<void> {
  try {
    await sessionRef(uid).delete();
  } catch {
    // Idempotent — session may already be cleared.
  }
}

/**
 * When `vaultSessionToken` is absent — skip Valv reads (journal-only).
 * When present — validate via assertVaultSession before touching `reality_vault`.
 */
export async function vaultSessionGrantsVaultRead(uid: string, data: unknown): Promise<boolean> {
  if (!readVaultSessionToken(data)) return false;
  await assertVaultSession(uid, data);
  return true;
}

export async function assertVaultSession(uid: string, data: unknown): Promise<void> {
  const token = readVaultSessionToken(data);
  if (!token) {
    throw new HttpsError(
      'permission-denied',
      'Valv-session krävs. Lås upp Valvet via Fyren och biometri.',
    );
  }

  const snap = await sessionRef(uid).get();
  if (!snap.exists) {
    throw new HttpsError('permission-denied', 'Valv-session saknas. Lås upp Valvet igen.');
  }

  const stored = snap.data()?.token;
  const expiresAt = snap.data()?.expiresAt;

  if (typeof stored !== 'string' || stored !== token) {
    throw new HttpsError('permission-denied', 'Ogiltig Valv-session.');
  }

  if (typeof expiresAt === 'string' && new Date(expiresAt).getTime() < Date.now()) {
    await revokeVaultSession(uid);
    throw new HttpsError('permission-denied', 'Valv-session har gått ut. Lås upp igen.');
  }

  await sessionRef(uid).update({
    expiresAt: new Date(Date.now() + VAULT_SESSION_IDLE_MS).toISOString(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
