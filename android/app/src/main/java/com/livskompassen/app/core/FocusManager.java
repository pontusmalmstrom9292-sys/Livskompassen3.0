package com.livskompassen.app.core;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import com.livskompassen.app.util.LCLog;

/**
 * THE SILENCE GUARD - Våg 27.
 * Manages app behavior in relation to Android's Do Not Disturb (DND) and Focus modes.
 */
public class FocusManager {
    private final Context context;
    private final NotificationManager notificationManager;

    public FocusManager(Context context) {
        this.context = context;
        this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    /**
     * Kontrollerar om 'Stör ej' (DND) är aktivt på systemnivå.
     */
    public boolean isDoNotDisturbActive() {
        if (notificationManager == null) return false;
        
        int filter = notificationManager.getCurrentInterruptionFilter();
        return filter != NotificationManager.INTERRUPTION_FILTER_ALL;
    }

    /**
     * Loggar aktuell fokus-status för diagnostik.
     */
    public void logFocusStatus() {
        boolean dnd = isDoNotDisturbActive();
        LCLog.d("FocusManager: DND Status is " + (dnd ? "ACTIVE" : "INACTIVE"));
    }
}
