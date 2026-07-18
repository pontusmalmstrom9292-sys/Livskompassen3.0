package com.livskompassen.app.core;

import android.content.Context;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * RESILIENCE ENGINE - Våg 31.
 * Manages recovery processes when hardware security states change.
 */
public class KeyRecoveryManager {
    private static final String PREF_KEY_NEEDS_RECOVERY = "key_needs_recovery";

    public static void markKeyAsInvalid(Context context) {
        SecurePrefs.get(context).edit().putBoolean(PREF_KEY_NEEDS_RECOVERY, true).apply();
        LCLog.w("KeyRecoveryManager: Critical keys invalidated. Recovery required.");
    }

    public static boolean needsRecovery(Context context) {
        return SecurePrefs.get(context).getBoolean(PREF_KEY_NEEDS_RECOVERY, false);
    }

    public static void clearRecoveryStatus(Context context) {
        SecurePrefs.get(context).edit().putBoolean(PREF_KEY_NEEDS_RECOVERY, false).apply();
        LCLog.d("KeyRecoveryManager: Keys recovered and secured.");
    }
}
