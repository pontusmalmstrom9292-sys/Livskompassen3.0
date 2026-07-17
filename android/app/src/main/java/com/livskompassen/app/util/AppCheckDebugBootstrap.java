package com.livskompassen.app.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.livskompassen.app.BuildConfig;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Injicerar App Check debug-token i debug-byggen (Android Studio / sideload).
 * Play Integrity fungerar inte på vanliga debug-APK — token måste matcha Firebase Console.
 *
 * MUST: no-op i release ({@link BuildConfig#DEBUG} false). Release nollställer även
 * {@code FIREBASE_APP_CHECK_DEBUG_TOKEN} i {@code android/app/build.gradle}.
 *
 * SharedPreferences-nycklar enligt Firebase Android SDK StorageHelper
 * ({@code persistenceKey = urlEncode(appName) + "+" + urlEncode(appId)}).
 */
public final class AppCheckDebugBootstrap {

    private static final String PREFS_TEMPLATE = "com.google.firebase.appcheck.debug.store.%s";
    private static final String DEBUG_SECRET_KEY = "com.google.firebase.appcheck.debug.DEBUG_SECRET";
    /** mobilesdk_app_id från android/app/google-services.json — måste matcha smoke. */
    private static final String ANDROID_APP_ID = "1:1084026575972:android:a64e211553821b3fdbd371";
    private static final String DEFAULT_APP_NAME = "[DEFAULT]";

    private AppCheckDebugBootstrap() {}

    /**
     * Idempotent. Anropa före WebView boot så secret finns innan JS getToken.
     */
    public static void applyIfDebug(Context context) {
        if (!BuildConfig.DEBUG) {
            return;
        }
        String token = BuildConfig.FIREBASE_APP_CHECK_DEBUG_TOKEN;
        if (token == null || token.isEmpty() || "null".equals(token)) {
            LCLog.w("App Check: FIREBASE_APP_CHECK_DEBUG_TOKEN saknas i debug-build — Valv-callables kan nekas.");
            return;
        }

        String persistenceKey = encode(DEFAULT_APP_NAME) + "+" + encode(ANDROID_APP_ID);
        String prefsName = String.format(PREFS_TEMPLATE, persistenceKey);
        SharedPreferences prefs = context.getSharedPreferences(prefsName, Context.MODE_PRIVATE);
        // commit (sync): undvik race mot tidig getToken från WebView.
        prefs.edit().putString(DEBUG_SECRET_KEY, token).commit();

        LCLog.d(
            "App Check debug-token injicerad (prefs="
                + prefsName
                + "). Token måste finnas i Firebase Console → App Check → Manage debug tokens."
        );
    }

    private static String encode(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return value;
        }
    }
}
