import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { guardSensitiveCallableV2 } from "../lib/callableGuards";
import { assertVaultSession } from "../lib/vaultSessionGate";

/**
 * Sätter JWT `vaultUnlocked` — kräver giltig Valv-session (WebAuthn/biometri via issueVaultSession).
 *
 * TTL-lager (medvetet asymmetriskt tills synk beslutas):
 * - Server session (`vaultSessionToken` i Firestore) — 1 h idle, se `VAULT_SESSION_IDLE_MS`
 * - JWT claims (`vaultUnlocked` / `vaultExpiresAt`) — 15 min, styr direkt Firestore-läs på `reality_vault`
 *
 * Callables använder server session; klient-Firestore använder JWT. Synka TTL endast efter PMIR.
 */
export const unlockVault = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'unlockVault', 10);
  await assertVaultSession(uid, request.data);

  // JWT vaultExpiresAt — 15 min (kortare än server session 1 h)
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000;

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
