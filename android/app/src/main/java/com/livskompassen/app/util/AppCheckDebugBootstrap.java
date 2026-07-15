package com.livskompassen.app.util;

import android.content.Context;

import com.livskompassen.app.BuildConfig;

/**
 * Injicerar App Check debug-token i debug-byggen (Android Studio / sideload).
 * Play Integrity fungerar inte på vanliga debug-APK — token måste matcha Firebase Console.
 */
public final class AppCheckDebugBootstrap {

    private static final String PREFS_TEMPLATE = "com.google.firebase.appcheck.debug.store.%s";
    private static final String DEBUG_SECRET_KEY = "debug-secret";
    private static final String DEFAULT_APP_NAME = "[DEFAULT]";

    private AppCheckDebugBootstrap() {}

    public static void applyIfDebug(Context context) {
        if (!BuildConfig.DEBUG) {
            return;
        }
        String token = BuildConfig.FIREBASE_APP_CHECK_DEBUG_TOKEN;
        if (token == null || token.isEmpty() || "null".equals(token)) {
            LCLog.w("App Check: FIREBASE_APP_CHECK_DEBUG_TOKEN saknas i debug-build — Valv-callables kan nekas.");
            return;
        }

        String prefsName = String.format(PREFS_TEMPLATE, DEFAULT_APP_NAME);
        context
            .getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .edit()
            .putString(DEBUG_SECRET_KEY, token)
            .apply();

        LCLog.d("App Check debug-token injicerad (BuildConfig) — registrera samma token i Firebase Console om Valvet nekas.");
    }
}
