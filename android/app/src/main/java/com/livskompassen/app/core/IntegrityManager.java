package com.livskompassen.app.core;

import android.content.Context;
import com.livskompassen.app.util.SecurityUtils;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Calculates security integrity scores and manages adaptive security policies.
 */
public class IntegrityManager {
    private final Context context;
    private ZoneManager zoneManager;

    public IntegrityManager(Context context) {
        this.context = context;
    }

    public void setZoneManager(ZoneManager zoneManager) {
        this.zoneManager = zoneManager;
    }

    /**
     * Beräknar en säkerhetspoäng (0-100).
     * 100 = Helt säker miljö.
     * < 50 = Potentiellt osäker miljö.
     */
    public int getSecurityScore() {
        int score = 100;
        StringBuilder auditTrail = new StringBuilder("Security Audit: ");

        if (SecurityUtils.isRooted()) {
            score -= 40;
            auditTrail.append("[ROOT] ");
        }

        if (zoneManager != null && !zoneManager.isInsideSafeZone()) {
            score -= 10;
            auditTrail.append("[OUTSIDE_SAFE_ZONE] ");
        }

        if (SecurityUtils.isHookingDetected()) {
            score -= 50;
            auditTrail.append("[HOOKING_DETECTED] ");
        }

        if (SecurityUtils.hasSuspiciousAccessibilityService(context)) {
            score -= 30;
            auditTrail.append("[SUSPICIOUS_ACCESSIBILITY] ");
        }

        if (SecurityUtils.isAdbEnabled(context)) {
            score -= 20;
            auditTrail.append("[ADB_ENABLED] ");
        }

        if (SecurityUtils.isDebuggerConnected()) {
            score -= 30;
            auditTrail.append("[DEBUGGER_CONNECTED] ");
        }

        if (SecurityUtils.isEmulator()) {
            score -= 20;
            auditTrail.append("[EMULATOR] ");
        }

        if (!AttestationManager.isHardwareBacked(context)) {
            score -= 20;
            auditTrail.append("[NO_TEE_HARDWARE] ");
        }

        int finalScore = Math.max(0, score);
        if (finalScore < 70) {
            com.livskompassen.app.util.LCLog.w("IntegrityManager: LOW SECURITY SCORE (" + finalScore + "): " + auditTrail.toString());
        }

        return finalScore;
    }

    public boolean isTampered() {
        return SecurityUtils.isHookingDetected();
    }

    /**
     * Returnerar en rekommenderad timeout för Sacred Lock baserat på risk.
     * @return millisekunder
     */
    public long getRecommendedLockTimeout() {
        int score = getSecurityScore();
        // Floor 3s even when "tampered"/debug — BiometricPrompt + shade need grace
        // (matches JS NATIVE_BACKGROUND_LOCK_MS). True lock still via SacredLock UI.
        if (isTampered()) return 3_000L;
        if (score < 50) return 60 * 1000L; // 1 minut vid hög risk
        if (score < 80) return 3 * 60 * 1000L; // 3 minuter vid medium risk
        return 5 * 60 * 1000L; // 5 minuter (standard)
    }

    public boolean isEnvironmentHighRisk() {
        return getSecurityScore() < 50;
    }

    /**
     * Våg 320: Self-Healing Integrity Audit.
     * Performs a background check of critical system state and pro-actively
     * resets non-sensitive metadata if it appears inconsistent.
     */
    public void performSelfHealAudit() {
        com.livskompassen.app.util.LCLog.d("IntegrityManager: Starting Self-Healing Audit.");
        
        // 1. Check if Sacred Lock state is inconsistent
        android.content.SharedPreferences prefs = com.livskompassen.app.util.SecurePrefs.get(context);
        boolean locked = prefs.getBoolean("sacred_lock_state", false);
        
        if (isTampered() && !locked) {
            com.livskompassen.app.util.LCLog.e("IntegrityManager: TAMPERING DETECTED while unlocked. Forcing HEAL (Lockdown).");
            prefs.edit().putBoolean("sacred_lock_state", true).apply();
            WidgetUpdateManager.refreshAllWidgets(context);
        }

        // 2. Audit usage patterns (reset if corrupted)
        try {
            int currentHour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
            String key = "usage_hour_" + currentHour;
            if (prefs.getInt(key, 0) < 0) {
                com.livskompassen.app.util.LCLog.w("IntegrityManager: Negative usage count detected. Healing state.");
                prefs.edit().putInt(key, 0).apply();
            }
        } catch (Exception ignored) {}
    }
}
