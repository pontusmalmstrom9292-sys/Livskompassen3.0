package com.livskompassen.app.util;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class SecurePrefs {
    private static final String SECURE_PREFS_NAME = "secure_livskompassen_prefs";
    private static final String PREF_KEY_GENERATION = "key_generation";

    public static SharedPreferences get(Context context) {
        try {
            int currentGen = context.getSharedPreferences("system_meta", Context.MODE_PRIVATE).getInt(PREF_KEY_GENERATION, 1);
            String alias = MasterKey.DEFAULT_MASTER_KEY_ALIAS + "_gen" + currentGen;
            
            MasterKey masterKey = new MasterKey.Builder(context, alias)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            return EncryptedSharedPreferences.create(
                    context,
                    SECURE_PREFS_NAME + "_gen" + currentGen,
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (GeneralSecurityException | IOException e) {
            LCLog.e("Failed to create SecurePrefs: " + e.getMessage());
            return context.getSharedPreferences(SECURE_PREFS_NAME, Context.MODE_PRIVATE);
        }
    }

    /**
     * Triggar en rotation av krypteringsnycklar. 
     * Kräv biometri innan du anropar detta i produktion!
     */
    public static void rotateKeys(Context context) {
        SharedPreferences meta = context.getSharedPreferences("system_meta", Context.MODE_PRIVATE);
        int currentGen = meta.getInt(PREF_KEY_GENERATION, 1);
        meta.edit().putInt(PREF_KEY_GENERATION, currentGen + 1).apply();
        LCLog.w("SecurePrefs: Key rotation triggered. New generation: " + (currentGen + 1));
    }
}
