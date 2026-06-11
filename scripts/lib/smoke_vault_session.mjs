/**
 * Vault session helpers for prod callable smokes (generateDossier, valvChatQuery E2E).
 * Prefers Admin SDK seed when ADC/service account is available; falls back to issueVaultSession callable.
 */
import { randomBytes } from 'crypto';
import { initFirebaseAdmin } from './seedAdmin.mjs';

const VAULT_SESSION_IDLE_MS = 60 * 60 * 1000;

/**
 * Seed vault_session via Admin SDK (bypasses WebAuthn — gate tested separately in smoke:valv-gate).
 * @returns {Promise<string | null>}
 */
export async function seedSmokeVaultSession(uid, projectId) {
  try {
    const admin = await initFirebaseAdmin(projectId);
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + VAULT_SESSION_IDLE_MS).toISOString();
    await admin.firestore().doc(`users/${uid}/private/vault_session`).set({
      token,
      expiresAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return token;
  } catch {
    return null;
  }
}

/**
 * @param {import('firebase/functions').Functions} functions
 * @returns {Promise<{ token: string | null; webAuthnGateLive: boolean }>}
 */
export async function obtainSmokeVaultSession(functions, uid, projectId) {
  const adminToken = await seedSmokeVaultSession(uid, projectId);
  if (adminToken) {
    return { token: adminToken, webAuthnGateLive: true };
  }

  const { httpsCallable } = await import('firebase/functions');
  const issueVault = httpsCallable(functions, 'issueVaultSession');
  try {
    const session = await issueVault({});
    const token = session.data?.vaultSessionToken;
    if (typeof token === 'string' && token.length >= 32) {
      return { token, webAuthnGateLive: false };
    }
  } catch (err) {
    const code = err?.code ?? '';
    const msg = String(err?.message ?? '');
    const denied =
      code === 'permission-denied' ||
      code === 'functions/permission-denied' ||
      code === 'invalid-argument' ||
      code === 'functions/invalid-argument' ||
      msg.includes('WebAuthn krävs') ||
      msg.includes('origin och rpID') ||
      msg.includes('App Check-verifiering krävs');
    if (denied) {
      return { token: null, webAuthnGateLive: true };
    }
    throw err;
  }

  return { token: null, webAuthnGateLive: true };
}
