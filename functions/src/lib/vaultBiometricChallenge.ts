import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

/** Kortlivad server-utmaning — klient måste konsumera inom fönstret efter OS-biometri. */
export const VAULT_BIOMETRIC_CHALLENGE_TTL_MS = 90 * 1000;

function challengeRef(uid: string) {
  return admin.firestore().doc(`users/${uid}/private/vault_biometric_challenge`);
}

function hashProof(proof: string): string {
  return createHash('sha256').update(proof, 'utf8').digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function beginVaultBiometricChallenge(uid: string): Promise<{
  challengeId: string;
  challengeProof: string;
  expiresAt: string;
}> {
  const challengeId = randomBytes(16).toString('hex');
  const challengeProof = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + VAULT_BIOMETRIC_CHALLENGE_TTL_MS).toISOString();

  await challengeRef(uid).set({
    challengeId,
    proofHash: hashProof(challengeProof),
    expiresAt,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { challengeId, challengeProof, expiresAt };
}

export async function consumeVaultBiometricChallenge(
  uid: string,
  input: {
    challengeId: unknown;
    challengeProof: unknown;
    platform: 'android' | 'ios';
  },
): Promise<void> {
  const challengeId =
    typeof input.challengeId === 'string' ? input.challengeId.trim() : '';
  const challengeProof =
    typeof input.challengeProof === 'string' ? input.challengeProof.trim() : '';

  if (!challengeId || !challengeProof) {
    throw new HttpsError(
      'permission-denied',
      'Biometri-utmaning krävs. Börja om från Fyren.',
    );
  }

  const ref = challengeRef(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpsError(
      'permission-denied',
      'Biometri-utmaning saknas eller har redan använts.',
    );
  }

  const data = snap.data();
  const storedId = typeof data?.challengeId === 'string' ? data.challengeId : '';
  const storedHash = typeof data?.proofHash === 'string' ? data.proofHash : '';
  const expiresAt = typeof data?.expiresAt === 'string' ? data.expiresAt : '';

  if (storedId !== challengeId) {
    throw new HttpsError('permission-denied', 'Ogiltig biometri-utmaning.');
  }

  const proofHash = hashProof(challengeProof);
  if (!safeEqualHex(proofHash, storedHash)) {
    throw new HttpsError('permission-denied', 'Ogiltig biometri-bevis.');
  }

  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    await ref.delete().catch(() => undefined);
    throw new HttpsError(
      'permission-denied',
      'Biometri-utmaning har gått ut. Försök igen.',
    );
  }

  await ref.delete();

  console.info('[VaultSession] Biometric challenge consumed:', {
    uid,
    platform: input.platform,
    ts: new Date().toISOString(),
  });
}
