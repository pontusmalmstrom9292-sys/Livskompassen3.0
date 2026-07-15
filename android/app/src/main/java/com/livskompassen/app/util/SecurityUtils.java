package com.livskompassen.app.util;

import java.io.File;

/**
 * Native säkerhetskontroller för Livskompassen.
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    /**
     * Enkel kontroll för att se om enheten är rootad.
     * Används endast för att varna i loggar, inte för att blockera användaren.
     */
    public static boolean isRooted() {
        String[] paths = {
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su"
        };
        for (String path : paths) {
            if (new File(path).exists()) return true;
        }
        return false;
    }
}
