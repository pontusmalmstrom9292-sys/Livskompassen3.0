import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { guardSensitiveCallableV2 } from "../lib/callableGuards";
import { assertVaultSession } from "../lib/vaultSessionGate";

/** Sätter JWT vaultUnlocked — kräver giltig Valv-session (WebAuthn/biometri via issueVaultSession). */
export const unlockVault = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'unlockVault', 10);
  await assertVaultSession(uid, request.data);
  
  // 2. Skapa tidsstämpel för förfallodatum (15 minuter framåt i millisekunder)
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
