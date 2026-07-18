package com.livskompassen.app.core;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyPermanentlyInvalidatedException;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricPrompt;
import androidx.fragment.app.FragmentActivity;
import com.livskompassen.app.util.LCLog;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * SACRED BACKUP - Våg 26.
 * Manages biometric-protected encryption for data exports.
 */
public class BackupManager {
    private static final String KEY_ALIAS = "sacred_backup_key";
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";

    private final FragmentActivity activity;

    public BackupManager(FragmentActivity activity) {
        this.activity = activity;
    }

    /**
     * Genererar en nyckel som KRÄVER biometrisk autentisering vid varje användning.
     */
    private void generateBiometricKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
        
        keyGenerator.init(new KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setUserAuthenticationRequired(true) // DETTA ÄR NYCKELN TILL SÄKERHETEN
                .setInvalidatedByBiometricEnrollment(true)
                .build());
        keyGenerator.generateKey();
    }

    private SecretKey getKey() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
        keyStore.load(null);
        if (!keyStore.containsAlias(KEY_ALIAS)) {
            generateBiometricKey();
        }
        return (SecretKey) keyStore.getKey(KEY_ALIAS, null);
    }

    public void encryptData(String plainText, BiometricEncryptionCallback callback) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            try {
                cipher.init(Cipher.ENCRYPT_MODE, getKey());
            } catch (KeyPermanentlyInvalidatedException e) {
                LCLog.e("BackupManager: Key invalidated by system (e.g. new biometric added).");
                KeyRecoveryManager.markKeyAsInvalid(activity);
                callback.onError("BIOMETRIC_CHANGE_DETECTED");
                return;
            }

            BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(cipher);
            
            BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                    .setTitle("Exportera Säkert")
                    .setSubtitle("Autentisera för att låsa exporten med din biometri")
                    .setNegativeButtonText("Avbryt")
                    .build();

            BiometricPrompt biometricPrompt = new BiometricPrompt(activity, 
                androidx.core.content.ContextCompat.getMainExecutor(activity),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        try {
                            Cipher authenticatedCipher = result.getCryptoObject().getCipher();
                            byte[] encrypted = authenticatedCipher.doFinal(plainText.getBytes("UTF-8"));
                            byte[] iv = authenticatedCipher.getIV();
                            
                            // Paketera IV + Data för att kunna dekryptera senare
                            String combined = Base64.encodeToString(iv, Base64.DEFAULT) + ":" + 
                                             Base64.encodeToString(encrypted, Base64.DEFAULT);
                            callback.onSuccess(combined);
                        } catch (Exception e) {
                            callback.onError(e.getMessage());
                        }
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        callback.onError(errString.toString());
                    }
                });

            biometricPrompt.authenticate(promptInfo, cryptoObject);
        } catch (Exception e) {
            callback.onError(e.getMessage());
        }
    }

    public interface BiometricEncryptionCallback {
        void onSuccess(String encryptedData);
        void onError(String error);
    }
}
