import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin } from '../lib/firebaseAdmin';
import { guardSensitiveCallableV2 } from "../lib/callableGuards";
import { assertVaultSession, VAULT_SESSION_IDLE_MS } from "../lib/vaultSessionGate";

/**
 * Sätter JWT `vaultUnlocked` — kräver giltig Valv-session (WebAuthn/biometri via issueVaultSession).
 *
 * TTL synkad med server session: båda `VAULT_SESSION_IDLE_MS` (1 h från unlock).
 * Server-session får sliding refresh via `assertVaultSession`; JWT förnyas vid ny `unlockVault`.
 */
export const unlockVault = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'unlockVault', 10);
  await assertVaultSession(uid, request.data);

  const now = Date.now();
  const expiresAt = now + VAULT_SESSION_IDLE_MS;

  try {
    // 3. Hämta befintliga custom claims för att inte skriva över eventuella andra rättigheter
    const userRecord = await admin.auth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};

    // 4. Stämpla den nya biometriska valv-rättigheten i JWT-tokenen
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      vaultUnlocked: true,
      vaultExpiresAt: expiresAt,
    });

    return { 
      success: true, 
      message: "Vault unlocked securely.",
      expiresAt 
    };
  } catch (error) {
    console.error("Fel vid upplåsning av valv:", error);
    throw new HttpsError("internal", "Kunde inte applicera säkerhetsanspråk för valvet.");
  }
});
