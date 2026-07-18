package com.livskompassen.app.core;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.livskompassen.app.util.LCLog;

/**
 * SHADOW SYNC - CRITICAL COMPONENT.
 * Periodically refreshes widget data in the background.
 */
public class WidgetRefreshWorker extends Worker {

    public WidgetRefreshWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        LCLog.d("WidgetRefreshWorker: Starting background heartbeat.");
        
        try {
            // Här kan vi i framtiden anropa en Firebase Function eller läsa Firestore direkt.
            // För nu säkerställer vi att alla widgets ritas om med senaste lokala cachen.
            Context context = getApplicationContext();
            
            // Vi triggar en uppdatering via vår befintliga manager
            String lastAction = WidgetUpdateManager.getWidgetContent(context, "last_action");
            WidgetUpdateManager.updateWidgetContent(context, "last_action", lastAction);
            
            return Result.success();
        } catch (Exception e) {
            LCLog.e("WidgetRefreshWorker: Failed", e);
            return Result.retry();
        }
    }
}
