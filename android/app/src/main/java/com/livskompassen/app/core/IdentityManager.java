package com.livskompassen.app.core;

import android.content.Context;

import com.livskompassen.app.BuildConfig;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;
import com.livskompassen.app.util.SecurityUtils;

import java.util.List;

/**
 * THE ULTIMATE GUARD - Våg 16.
 * Ensures the app's identity and signature haven't been tampered with.
 * Titanium: real allowlist check — no placeholder bypass.
 */
public class IdentityManager {

    public static void verifyAppIntegrity(Context context) {
        try {
            List<String> currentHashes = SecurityUtils.getAppSignatureSha256Base64(context);
            LCLog.d("IdentityManager: Verifying signature against BuildConfig allowlist...");

            if (!BuildConfig.SIGNATURE_PINNED) {
                LCLog.e("FATAL: SIGNATURE_PINNED=false — release pin missing. Treating as integrity failure.");
                performEmergencyWipe(context);
                return;
            }

            if (currentHashes.isEmpty()) {
                LCLog.e("FATAL: No signing certificates readable on package.");
                performEmergencyWipe(context);
                return;
            }

            if (!SecurityUtils.isSignatureAllowlisted(context)) {
                LCLog.e("FATAL: App signature mismatch! Possible tampering. hashes=" + currentHashes);
                if (!currentHashes.isEmpty()) {
                    LCLog.e(
                            "Fix (debug only): add to android/local.properties → "
                                    + "LK_DEBUG_SIGNATURE_SHA256=" + currentHashes.get(0)
                                    + "  (or run: ./gradlew :app:printDebugSignaturePin)"
                    );
                }
                performEmergencyWipe(context);
                return;
            }

            LCLog.d("IdentityManager: Signature OK. hashes=" + currentHashes);
        } catch (Exception e) {
            LCLog.e("IdentityManager: Error during verification: " + e.getMessage());
            // Fail-closed on unexpected errors in release; debug logs only.
            if (!BuildConfig.DEBUG) {
                performEmergencyWipe(context);
            }
        }
    }

    private static void performEmergencyWipe(Context context) {
        LCLog.w("IDENTITY BREACH: Triggering emergency wipe!");
        try {
            new EmergencyManager(context).performEmergencyWipe();
        } catch (Exception e) {
            LCLog.e("IdentityManager: emergency wipe failed: " + e.getMessage());
            try {
                SecurePrefs.get(context).edit().clear().commit();
            } catch (Exception ignored) {
                // Last-resort path already logged above.
            }
        }
    }
}