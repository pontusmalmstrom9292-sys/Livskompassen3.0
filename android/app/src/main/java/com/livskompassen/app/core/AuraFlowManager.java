package com.livskompassen.app.core;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import com.livskompassen.app.util.LCLog;

/**
 * THE AURA FLOW (ZENITH BREATHING) - Våg 112.
 * Synchronizes visual edge-glow and haptic waves for guided breathing.
 */
public class AuraFlowManager {
    private final Context context;
    private final HapticManager hapticManager;
    private final SystemUiManager systemUiManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    private boolean isRunning = false;
    private int breathCycle = 0; // 0=In, 1=Hold, 2=Out, 3=Hold
    
    public AuraFlowManager(Context context, HapticManager hapticManager, SystemUiManager systemUiManager) {
        this.context = context;
        this.hapticManager = hapticManager;
        this.systemUiManager = systemUiManager;
    }

    public void startFlow() {
        if (isRunning) return;
        isRunning = true;
        LCLog.d("AuraFlow: Starting immersive breathing guidance.");
        runCycle();
    }

    public void stopFlow() {
        isRunning = false;
        mainHandler.removeCallbacksAndMessages(null);
        systemUiManager.setStatusBarTheme("#0D0B09", true); // Reset to standard
    }

    private void runCycle() {
        if (!isRunning) return;

        long duration;
        switch (breathCycle) {
            case 0: // Inhale (4s)
                systemUiManager.setStatusBarTheme("#FDE68A", false); // Pulse Gold
                hapticManager.liquidPulse();
                duration = 4000;
                break;
            case 1: // Hold (2s)
                duration = 2000;
                break;
            case 2: // Exhale (4s)
                systemUiManager.setStatusBarTheme("#7BA3C9", false); // Pulse Ethereal Blue
                hapticManager.liquidPulse();
                duration = 4000;
                break;
            case 3: // Hold (2s)
                duration = 2000;
                break;
            default:
                duration = 1000;
        }

        mainHandler.postDelayed(() -> {
            breathCycle = (breathCycle + 1) % 4;
            runCycle();
        }, duration);
    }
}
