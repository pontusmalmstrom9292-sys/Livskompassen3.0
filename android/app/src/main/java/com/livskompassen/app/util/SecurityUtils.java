package com.livskompassen.app.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.pm.SigningInfo;
import android.os.Build;
import android.provider.Settings;
import android.util.Base64;

import com.livskompassen.app.BuildConfig;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
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
                if (service.toLowerCase(Locale.US).contains(safe.toLowerCase(Locale.US))) {
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
     * SHA-256 (Base64, no wrap) of each signing certificate currently attached to the APK.
     */
    public static List<String> getAppSignatureSha256Base64(Context context) {
        List<String> hashes = new ArrayList<>();
        try {
            for (Signature signature : getSigningSignatures(context)) {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] digest = md.digest(signature.toByteArray());
                hashes.add(Base64.encodeToString(digest, Base64.NO_WRAP).trim());
            }
        } catch (Exception e) {
            LCLog.e("SecurityUtils: failed to read app signatures: " + e.getMessage());
        }
        return hashes;
    }

    /**
     * True if any current signing cert matches the expected Base64 SHA-256 hash.
     */
    public static boolean isSignatureValid(Context context, String expectedHash) {
        if (expectedHash == null || expectedHash.trim().isEmpty()) {
            return false;
        }
        String expected = expectedHash.trim();
        for (String actual : getAppSignatureSha256Base64(context)) {
            if (expected.equals(actual)) {
                return true;
            }
        }
        return false;
    }

    /**
     * True if the APK is signed with any cert listed in {@link BuildConfig#ALLOWED_SIGNATURE_SHA256}.
     * Empty allowlist → invalid (fail-closed).
     */
    public static boolean isSignatureAllowlisted(Context context) {
        String allowlist = BuildConfig.ALLOWED_SIGNATURE_SHA256;
        if (allowlist == null || allowlist.trim().isEmpty()) {
            return false;
        }
        for (String allowed : allowlist.split(",")) {
            String pin = allowed.trim();
            if (!pin.isEmpty() && isSignatureValid(context, pin)) {
                return true;
            }
        }
        return false;
    }

    @SuppressWarnings("deprecation")
    private static Signature[] getSigningSignatures(Context context) throws PackageManager.NameNotFoundException {
        PackageManager pm = context.getPackageManager();
        String packageName = context.getPackageName();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            PackageInfo packageInfo = pm.getPackageInfo(packageName, PackageManager.GET_SIGNING_CERTIFICATES);
            SigningInfo signingInfo = packageInfo.signingInfo;
            if (signingInfo == null) {
                return new Signature[0];
            }
            if (signingInfo.hasMultipleSigners()) {
                return signingInfo.getApkContentsSigners();
            }
            return signingInfo.getSigningCertificateHistory();
        }
        PackageInfo packageInfo = pm.getPackageInfo(packageName, PackageManager.GET_SIGNATURES);
        Signature[] signatures = packageInfo.signatures;
        return signatures != null ? signatures : new Signature[0];
    }
}
