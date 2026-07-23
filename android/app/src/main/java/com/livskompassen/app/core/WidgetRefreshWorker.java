package com.livskompassen.app.core;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.livskompassen.app.util.LCLog;
import java.io.File;

/**
 * SHADOW SYNC - CRITICAL COMPONENT.
 * @locked TITANIUM-BASE-CORE
 * Periodically refreshes widget data and fetches content in the background.
 */
public class WidgetRefreshWorker extends Worker {

    public WidgetRefreshWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        LCLog.d("WidgetRefreshWorker: Starting background Shadow Sync.");
        
        try {
            Context context = getApplicationContext();
            
            // 1. Refresh Widget Heartbeat
            // Ensures widgets know they are still connected to the system.
            // Also ensures circadian themes are applied even if user hasn't opened app.
            WidgetUpdateManager.refreshAllWidgets(context);
            
            // Våg 216: Adaptive Pre-warming
            checkUsagePreWarm(context);

            // Våg 321: Background Integrity Audit
            new IntegrityManager(context).performSelfHealAudit();

            // 2. Scheduled content cleanup (Maintenance)
            // Cleanup old temporary capture files if they weren't deleted
            File captureDir = new File(context.getCacheDir(), "widget_capture");
            if (captureDir.exists()) {
                File[] files = captureDir.listFiles();
                if (files != null) {
                    long now = System.currentTimeMillis();
                    for (File f : files) {
                        if (now - f.lastModified() > 24 * 60 * 60 * 1000L) { // 24h old
                            f.delete();
                        }
                    }
                }
            }

            // 3. Trigger Bridge Sync if App is in background but alive
            // (Reserved for Våg 90+ - Headless JS via Capacitor)
            
            return Result.success();
        } catch (Exception e) {
            LCLog.e("WidgetRefreshWorker: Failed", e);
            return Result.retry();
        }
    }

    private void checkUsagePreWarm(Context context) {
        int nextHour = (java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY) + 1) % 24;
        String key = "usage_hour_" + nextHour;
        android.content.SharedPreferences prefs = com.livskompassen.app.util.SecurePrefs.get(context);
        int usageCount = prefs.getInt(key, 0);

        if (usageCount > 5) { // Threshold for habit detection
            LCLog.d("WidgetRefreshWorker: High usage predicted for next hour. Pre-warming components.");
            // Signal to MainActivity via a silent broadcast or set a flag
            prefs.edit().putBoolean("pre_warm_requested", true).apply();
        }
    }
}
