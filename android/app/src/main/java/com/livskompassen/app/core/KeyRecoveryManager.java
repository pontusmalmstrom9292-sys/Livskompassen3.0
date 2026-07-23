package com.livskompassen.app.core;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;
import java.security.KeyStore;
import javax.crypto.KeyGenerator;

/**
 * RESILIENCE ENGINE - Våg 31.
 * Manages recovery processes when hardware security states change.
 */
public class KeyRecoveryManager {
    private static final String PREF_KEY_NEEDS_RECOVERY = "key_needs_recovery";
    private static final String RECOVERY_ALIAS = "sacred_recovery_master";

    /**
     * Våg 165: Generates a hardware-backed recovery key in StrongBox if available.
     * This key does NOT invalidate on biometric change (no setUserAuthenticationRequired).
     */
    public static void prepareRecoveryHardware(android.content.Context context) {
        try {
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            if (keyStore.containsAlias(RECOVERY_ALIAS)) return;

            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            
            KeyGenParameterSpec.Builder builder = new KeyGenParameterSpec.Builder(
                    RECOVERY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE);

            // Attempt StrongBox for Zenith-level security
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                builder.setIsStrongBoxBacked(true);
            }

            try {
                keyGenerator.init(builder.build());
                keyGenerator.generateKey();
                LCLog.d("KeyRecoveryManager: Sacred Recovery Master initialized in StrongBox/TEE.");
            } catch (Exception strongBoxFail) {
                // Real TEE fallback — retry without StrongBox (do not leave alias missing).
                LCLog.w("KeyRecoveryManager: StrongBox unavailable, falling back to TEE: " + strongBoxFail.getMessage());
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                    builder.setIsStrongBoxBacked(false);
                }
                keyGenerator.init(builder.build());
                keyGenerator.generateKey();
                LCLog.d("KeyRecoveryManager: Sacred Recovery Master initialized in TEE.");
            }
        } catch (Exception e) {
            LCLog.e("KeyRecoveryManager: Recovery key init failed: " + e.getMessage());
        }
    }

    public static void markKeyAsInvalid(android.content.Context context) {
        SecurePrefs.get(context).edit().putBoolean(PREF_KEY_NEEDS_RECOVERY, true).apply();
        LCLog.w("KeyRecoveryManager: Critical keys invalidated. Recovery required.");
    }

    public static boolean needsRecovery(android.content.Context context) {
        return SecurePrefs.get(context).getBoolean(PREF_KEY_NEEDS_RECOVERY, false);
    }

    public static void clearRecoveryStatus(android.content.Context context) {
        SecurePrefs.get(context).edit().putBoolean(PREF_KEY_NEEDS_RECOVERY, false).apply();
        LCLog.d("KeyRecoveryManager: Keys recovered and secured.");
    }
}
