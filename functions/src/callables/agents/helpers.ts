import { HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../../lib/firebaseAdmin';

export function invalidBankIdError(message: string): HttpsError {
  return new HttpsError('invalid-argument', message);
}

/** Zero Footprint: rensa JWT vault-claims så cachad ID-token inte läser reality_vault efter logout/idle. */
export async function clearVaultJwtClaims(uid: string): Promise<void> {
  const userRecord = await admin.auth().getUser(uid);
  const currentClaims = userRecord.customClaims ?? {};
  await admin.auth().setCustomUserClaims(uid, {
    ...currentClaims,
    vaultUnlocked: false,
    vaultExpiresAt: 0,
  });
}
