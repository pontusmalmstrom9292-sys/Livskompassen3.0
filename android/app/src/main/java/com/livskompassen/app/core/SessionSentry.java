package com.livskompassen.app.core;

import android.os.Handler;
import android.os.Looper;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.livskompassen.app.util.LCLog;

/**
 * SESSION SENTRY - Våg 17.
 * Monitors the active Vault session and enforces "Safe Harbor" policies.
 *
 * Idle timeout MUST match JS VAULT_SESSION_IDLE_MS (1 h). A 3‑minute timer that
 * never resets while the user scrolls Arkiv/Valvet caused false Sacred Lock kickouts
 * after Titanium Aura Omni (a752cbc12).
 */
public class SessionSentry {
    /** Align with src/.../sessionService.ts VAULT_SESSION_IDLE_MS */
    private static final long INACTIVITY_LOCK_MS = 60 * 60 * 1000L;

    private final Bridge bridge;
    private final SacredLockManager sacredLockManager;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable inactivityTask;
    private boolean touchListenerAttached = false;

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
     * Called from JS (LivskompassenNative.userInteracted) and native WebView touch.
     */
    public void userInteracted() {
        handler.removeCallbacks(inactivityTask);
        if (!sacredLockManager.isLocked()) {
            handler.postDelayed(inactivityTask, INACTIVITY_LOCK_MS);
        }
    }

    public void startMonitoring() {
        attachWebViewActivityListener();
        userInteracted();
    }

    public void stopMonitoring() {
        handler.removeCallbacks(inactivityTask);
    }

    /**
     * Defense in depth: reset idle even if JS never calls userInteracted().
     * Returns false so Capacitor/WebView still receive the event.
     */
    private void attachWebViewActivityListener() {
        if (touchListenerAttached || bridge == null) return;
        WebView webView = bridge.getWebView();
        if (webView == null) return;

        webView.setOnTouchListener((View v, MotionEvent event) -> {
            int action = event.getActionMasked();
            if (action == MotionEvent.ACTION_DOWN
                    || action == MotionEvent.ACTION_MOVE
                    || action == MotionEvent.ACTION_UP) {
                userInteracted();
            }
            return false;
        });
        touchListenerAttached = true;
        LCLog.d("SessionSentry: WebView activity listener attached.");
    }
}
