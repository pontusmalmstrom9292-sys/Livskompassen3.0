package com.livskompassen.app.core;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.os.Looper;
import com.livskompassen.app.util.LCLog;

/**
 * THE AURA FLOW (ZENITH BREATHING) - Våg 112 / Våg 280 (Ambient).
 * Synchronizes visual edge-glow and haptic waves for guided breathing.
 * Now light-aware: dims visuals in dark environments.
 */
public class AuraFlowManager implements SensorEventListener {
    private final Context context;
    private final HapticManager hapticManager;
    private final SystemUiManager systemUiManager;
    private final AuraAudioManager audioManager;
    private final SensorManager sensorManager;
    private final Sensor lightSensor;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private ValueAnimator colorAnimator;
    
    private boolean isRunning = false;
    private int breathCycle = 0; // 0=In, 1=Hold, 2=Out, 3=Hold
    private float ambientLightLux = 100f; // Default room light

    public AuraFlowManager(Context context, HapticManager hapticManager, SystemUiManager systemUiManager) {
        this.context = context;
        this.hapticManager = hapticManager;
        this.systemUiManager = systemUiManager;
        this.audioManager = new AuraAudioManager();
        this.sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        this.lightSensor = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
    }

    public void startFlow() {
        if (isRunning) return;
        isRunning = true;
        LCLog.d("AuraFlow: Starting immersive breathing guidance.");
        try {
            if (lightSensor != null && sensorManager != null) {
                sensorManager.registerListener(this, lightSensor, SensorManager.SENSOR_DELAY_NORMAL);
            }
            audioManager.start();
            runCycle();
        } catch (Exception e) {
            isRunning = false;
            LCLog.e("AuraFlow: startFlow failed: " + e.getMessage());
        }
    }

    /**
     * Stop breathing guidance. Must never throw into the WebView bridge —
     * JS calls this on every inactive breathing mount/cleanup.
     * Do NOT scrub MemoryManager here (WebView clearCache off UI thread crashed auth boot).
     */
    public void stopFlow() {
        isRunning = false;
        try {
            if (sensorManager != null) {
                sensorManager.unregisterListener(this);
            }
        } catch (Exception ignored) {}
        try {
            if (colorAnimator != null) colorAnimator.cancel();
        } catch (Exception ignored) {}
        try {
            audioManager.stop();
        } catch (Exception ignored) {}
        mainHandler.removeCallbacksAndMessages(null);
        mainHandler.post(() -> {
            try {
                systemUiManager.setStatusBarTheme("#0D0B09", true);
                systemUiManager.setEdgeGlow("#000000", 0f);
            } catch (Exception e) {
                LCLog.e("AuraFlow: stopFlow UI reset failed: " + e.getMessage());
            }
        });
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_LIGHT) {
            ambientLightLux = event.values[0];
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

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
            
            // Våg 281: Ambient-aware Edge Glow intensity
            float fraction = animator.getAnimatedFraction();
            float baseAlpha = (breathCycle == 0) ? (fraction * 0.3f) : ((1f - fraction) * 0.3f);
            
            // Dim in dark rooms (Lux < 10) to avoid blinding
            float ambientScale = ambientLightLux < 10f ? 0.35f : 1.0f;
            systemUiManager.setEdgeGlow(hex, baseAlpha * ambientScale);
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
                hapticManager.heartbeatPulse();
                audioManager.setBreathingState(true);
                duration = inhale;
                break;
            case 1: // Hold
                duration = hold;
                break;
            case 2: // Exhale
                animateStatusColor("#FDE68A", "#7BA3C9", exhale);
                hapticManager.heartbeatPulse();
                audioManager.setBreathingState(false);
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
