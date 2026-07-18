package com.livskompassen.app.core;

import android.content.Context;
import android.security.keystore.KeyInfo;
import android.security.keystore.KeyProperties;
import com.livskompassen.app.util.LCLog;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;

/**
 * THE ATTESTATION GUARD - Våg 23.
 * Verifies that the device security is backed by hardware (TEE/StrongBox).
 */
public class AttestationManager {
    private static final String TEMP_KEY_ALIAS = "attestation_temp_key";

    public static boolean isHardwareBacked(Context context) {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            
            keyGenerator.init(new android.security.keystore.KeyGenParameterSpec.Builder(
                    TEMP_KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .build());

            SecretKey key = keyGenerator.generateKey();
            SecretKeyFactory factory = SecretKeyFactory.getInstance(key.getAlgorithm(), "AndroidKeyStore");
            KeyInfo keyInfo = (KeyInfo) factory.getKeySpec(key, KeyInfo.class);

            boolean isHardware = keyInfo.isInsideSecureHardware();
            
            // Städa upp
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            keyStore.deleteEntry(TEMP_KEY_ALIAS);

            return isHardware;
        } catch (Exception e) {
            LCLog.w("AttestationManager: Failed to verify hardware backing: " + e.getMessage());
            return false;
        }
    }
}
