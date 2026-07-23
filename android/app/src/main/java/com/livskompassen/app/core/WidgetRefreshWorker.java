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
}
