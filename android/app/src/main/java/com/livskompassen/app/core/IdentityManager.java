package com.livskompassen.app.core;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;
import java.security.MessageDigest;

/**
 * THE ULTIMATE GUARD - Våg 16.
 * Ensures the app's identity and signature haven't been tampered with.
 */
public class IdentityManager {
    // PLACEHOLDER: I produktion ersätts detta med din faktiska SHA-256 hash
    private static final String OFFICIAL_SIGNATURE_HASH = "DEBUG_PLACEHOLDER_SIGNATURE";

    public static void verifyAppIntegrity(Context context) {
        try {
            String currentHash = getAppSignatureHash(context);
            LCLog.d("IdentityManager: Verifying signature...");

            // Under utveckling tillåter vi matchning mot debug-nycklar
            if (!OFFICIAL_SIGNATURE_HASH.equals("DEBUG_PLACEHOLDER_SIGNATURE") && 
                !OFFICIAL_SIGNATURE_HASH.equals(currentHash)) {
                
                LCLog.e("FATAL: App signature mismatch! Possible tampering detected.");
                performEmergencyWipe(context);
            }
        } catch (Exception e) {
            LCLog.e("IdentityManager: Error during verification: " + e.getMessage());
        }
    }

    private static String getAppSignatureHash(Context context) throws Exception {
        PackageInfo packageInfo = context.getPackageManager().getPackageInfo(
                context.getPackageName(), PackageManager.GET_SIGNATURES);
        
        for (Signature signature : packageInfo.signatures) {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(signature.toByteArray());
            return Base64.encodeToString(md.digest(), Base64.DEFAULT).trim();
        }
        return "";
    }

    private static void performEmergencyWipe(Context context) {
        LCLog.w("IDENTITY BREACH: Wiping all secure preferences!");
        SecurePrefs.get(context).edit().clear().commit();
        // Här skulle vi även kunna trigga en app-exit
    }
}
