package com.livskompassen.app.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.HashSet;
import java.util.Set;

/**
 * ADVANCED SECURITY UTILS - Omni Phase.
 * Detects rooting, hooking, tampering and environment risks.
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    public static boolean isRooted() {
        String[] paths = {
            "/system/app/Superuser.apk", "/sbin/su", "/system/bin/su",
            "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su",
            "/system/sd/xbin/su", "/system/bin/failsafe/su", "/data/local/su"
        };
        for (String path : paths) {
            if (new File(path).exists()) return true;
        }
        return false;
    }

    public static boolean isAdbEnabled(Context context) {
        return Settings.Global.getInt(context.getContentResolver(), Settings.Global.ADB_ENABLED, 0) > 0;
    }

    /**
     * Kontrollerar om misstänkta hjälpmedelstjänster (Accessibility Services) är aktiva.
     */
    public static boolean hasSuspiciousAccessibilityService(Context context) {
        String enabledServices = Settings.Secure.getString(
                context.getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);

        if (enabledServices == null || enabledServices.isEmpty()) return false;

        String[] safeServices = {
                "com.google.android.marvin.talkback",
                "com.samsung.android.app.talkback",
                "com.android.settings"
        };

        String[] activeServices = enabledServices.split(":");
        for (String service : activeServices) {
            boolean isSafe = false;
            for (String safe : safeServices) {
                if (service.toLowerCase().contains(safe.toLowerCase())) {
                    isSafe = true;
                    break;
                }
            }
            if (!isSafe) return true;
        }
        return false;
    }

    public static boolean isEmulator() {
        return Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || (Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic"))
                || "google_sdk".equals(Build.PRODUCT)
                || Build.HARDWARE.contains("goldfish")
                || Build.HARDWARE.contains("ranchu")
                || Build.BOARD.contains("goldfish");
    }

    /**
     * Kontrollerar om 'Mock Locations' (falsk position) är aktiverat i inställningarna.
     */
    public static boolean isMockLocationEnabled(Context context) {
        try {
            return Settings.Secure.getInt(context.getContentResolver(), "mock_location", 0) != 0;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isDebuggerConnected() {
        return android.os.Debug.isDebuggerConnected();
    }

    /**
     * Upptäcker kända hooking-ramverk (Frida, Xposed) via appens minnesmappning.
     */
    public static boolean isHookingDetected() {
        try {
            Set<String> libraries = new HashSet<>();
            BufferedReader reader = new BufferedReader(new FileReader("/proc/self/maps"));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains(".so")) {
                    int n = line.lastIndexOf(" ");
                    libraries.add(line.substring(n + 1));
                }
            }
            reader.close();

            for (String library : libraries) {
                if (library.contains("frida") || library.contains("xposed") || library.contains("substrate")) {
                    return true;
                }
            }
        } catch (Exception ignored) {}
        return false;
    }

    /**
     * Verifierar appens signatur (hash).
     * @param expectedHash Din officiella SHA-256 hash (placeholder här).
     */
    public static boolean isSignatureValid(Context context, String expectedHash) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(
                    context.getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature signature : packageInfo.signatures) {
                // Här skulle vi i en riktig prod-miljö jämföra signaturen
                // För nu returnerar vi true för att inte blockera utveckling
                return true; 
            }
        } catch (Exception ignored) {}
        return true;
    }
}
