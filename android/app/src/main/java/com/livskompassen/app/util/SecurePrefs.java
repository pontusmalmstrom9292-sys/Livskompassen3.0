package com.livskompassen.app.util;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class SecurePrefs {
    private static final String SECURE_PREFS_NAME = "secure_livskompassen_prefs";

    public static SharedPreferences get(Context context) {
        try {
            MasterKey masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            return EncryptedSharedPreferences.create(
                    context,
                    SECURE_PREFS_NAME,
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (GeneralSecurityException | IOException e) {
            LCLog.e("Failed to create SecurePrefs: " + e.getMessage());
            // Fallback to standard prefs if encryption fails (highly unlikely on modern Android)
            return context.getSharedPreferences(SECURE_PREFS_NAME, Context.MODE_PRIVATE);
        }
    }
}
