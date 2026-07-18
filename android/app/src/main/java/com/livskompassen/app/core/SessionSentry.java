package com.livskompassen.app.core;

import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.Bridge;
import com.livskompassen.app.util.LCLog;

/**
 * SESSION SENTRY - Våg 17.
 * Monitors the active Vault session and enforces "Safe Harbor" policies.
 */
public class SessionSentry {
    private static final long INACTIVITY_LOCK_MS = 3 * 60 * 1000L; // 3 minuter inaktivitet i förgrunden

    private final Bridge bridge;
    private final SacredLockManager sacredLockManager;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable inactivityTask;

    public SessionSentry(Bridge bridge, SacredLockManager sacredLockManager) {
        this.bridge = bridge;
        this.sacredLockManager = sacredLockManager;
        this.inactivityTask = () -> {
            LCLog.w("SessionSentry: Foreground inactivity detected. Locking for safety.");
            sacredLockManager.showLock();
        };
    }

    /**
     * Anropas vid varje användarinteraktion för att nollställa timern.
     */
    public void userInteracted() {
        handler.removeCallbacks(inactivityTask);
        if (!sacredLockManager.isLocked()) {
            handler.postDelayed(inactivityTask, INACTIVITY_LOCK_MS);
        }
    }

    public void startMonitoring() {
        userInteracted();
    }

    public void stopMonitoring() {
        handler.removeCallbacks(inactivityTask);
    }
}
