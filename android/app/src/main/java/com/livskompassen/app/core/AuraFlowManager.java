package com.livskompassen.app.core;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;
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
    private ValueAnimator colorAnimator;
    
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
        if (colorAnimator != null) colorAnimator.cancel();
        mainHandler.removeCallbacksAndMessages(null);
        systemUiManager.setStatusBarTheme("#0D0B09", true); // Reset to standard
        systemUiManager.setEdgeGlow("#000000", 0f); // Disable glow
    }

    private void animateStatusColor(String fromHex, String toHex, long duration) {
        if (colorAnimator != null) colorAnimator.cancel();
        
        int colorFrom = Color.parseColor(fromHex);
        int colorTo = Color.parseColor(toHex);
        
        colorAnimator = ValueAnimator.ofObject(new ArgbEvaluator(), colorFrom, colorTo);
        colorAnimator.setDuration(duration);
        colorAnimator.addUpdateListener(animator -> {
            int color = (int) animator.getAnimatedValue();
            String hex = String.format("#%06X", (0xFFFFFF & color));
            systemUiManager.setStatusBarTheme(hex, false);
            
            // Våg 143: Sync Edge Glow alpha with color transition
            float fraction = animator.getAnimatedFraction();
            float alpha = (breathCycle == 0) ? (fraction * 0.3f) : ((1f - fraction) * 0.3f);
            systemUiManager.setEdgeGlow(hex, alpha);
        });
        colorAnimator.start();
    }

    private void runCycle() {
        if (!isRunning) return;

        boolean lowPower = hapticManager.isLowPower();
        long inhale = lowPower ? 5000 : 4000; // Slower in low power
        long hold = 2000;
        long exhale = lowPower ? 5000 : 4000;

        long duration;
        switch (breathCycle) {
            case 0: // Inhale
                animateStatusColor("#0D0B09", "#FDE68A", inhale); 
                hapticManager.liquidPulse();
                duration = inhale;
                break;
            case 1: // Hold
                duration = hold;
                break;
            case 2: // Exhale
                animateStatusColor("#FDE68A", "#7BA3C9", exhale);
                hapticManager.liquidPulse();
                duration = exhale;
                break;
            case 3: // Hold
                animateStatusColor("#7BA3C9", "#0D0B09", hold);
                duration = hold;
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
