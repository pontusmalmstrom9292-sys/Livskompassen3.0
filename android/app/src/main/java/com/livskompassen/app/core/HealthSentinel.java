package com.livskompassen.app.core;

import android.content.Context;
import android.content.SharedPreferences;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * APP HEALTH SENTINEL - Våg 43.
 * Monitors and repairs internal app state and security integrity.
 */
public class HealthSentinel {
    private static final String PREF_HEALTH_CHECK = "last_health_check";
    private static final String PREF_INTEGRITY_BACKUP = "integrity_backup_hash";
    
    private final Context context;
    private final IntegrityManager integrityManager;

    public HealthSentinel(Context context, IntegrityManager integrityManager) {
        this.context = context;
        this.integrityManager = integrityManager;
    }

    /**
     * Genomför en fullständig hälsokontroll av appens interna lager.
     */
    public void performHealthCheck() {
        try {
            SharedPreferences prefs = SecurePrefs.get(context);
            int score = integrityManager.getSecurityScore();
            
            // Logga hälsostatus
            LCLog.d("HealthSentinel: System health score is " + score);
            
            // Kontrollera om lagringen fungerar (läs/skriv test)
            long now = System.currentTimeMillis();
            prefs.edit().putLong(PREF_HEALTH_CHECK, now).apply();
            
            if (prefs.getLong(PREF_HEALTH_CHECK, 0) != now) {
                LCLog.e("HealthSentinel: Secure storage corruption detected!");
                // Här kan vi trigga en reparation i framtiden
            }
        } catch (Exception e) {
            LCLog.e("HealthSentinel: Critical health check failure: " + e.getMessage());
        }
    }

    public String getHealthSummary() {
        int score = integrityManager.getSecurityScore();
        if (score >= 90) return "EXCELLENT";
        if (score >= 70) return "GOOD";
        if (score >= 50) return "WARNING";
        return "CRITICAL";
    }
}
