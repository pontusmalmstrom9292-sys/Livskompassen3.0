package com.livskompassen.app.core;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.HapticFeedbackConstants;
import android.view.View;

/**
 * THE TACTILE SENTRY - Våg 15.
 * @locked TITANIUM-BASE-CORE
 * Manages premium tactile feedback (haptics) across the app.
 */
public class HapticManager {
    private final Context context;
    private final Vibrator vibrator;
    private BatteryManager batteryManager;

    public HapticManager(Context context) {
        this.context = context;
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
    }

    public void setBatteryManager(BatteryManager batteryManager) {
        this.batteryManager = batteryManager;
    }

    public Context getContext() {
        return context;
    }

    public boolean isLowPower() {
        return batteryManager != null && batteryManager.shouldReducePerformance();
    }

    /** Mjuk bekräftelse (t.ex. vid lyckad upplåsning) */
    public void success() {
        if (isLowPower()) {
            // Förenklad haptik vid lågt batteri
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(10, 50));
            }
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            long[] pattern = {0, 10, 40, 20}; // Dubbel mjuk puls
            int[] amplitudes = {0, 50, 0, 80};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        }
    }

    /** Varning/Fel (t.ex. vid misslyckad biometri) */
    public void error() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
        }
    }

    /** Lätt klick-feedback för knappar */
    public void lightClick(View view) {
        if (view != null) {
            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP);
        }
    }

    /** Mekaniskt klick-känsla (t.ex. för emojier i Check-in) */
    public void mechanicalClick(View view) {
        if (view != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM);
            } else {
                view.performHapticFeedback(HapticFeedbackConstants.CONTEXT_CLICK);
            }
            return;
        }
        // No view — fall back to short vibration (BatteryManager gated)
        if (isLowPower()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(12, 80));
        }
    }

    /** Flytande, mjuk vibration (t.ex. för andningsövningar) */
    public void liquidPulse() {
        if (isLowPower()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            long[] pattern = {0, 100, 50, 100};
            int[] amplitudes = {0, 30, 0, 45};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        }
    }

    /** Skarp markering (t.ex. när ett värde ändras i en slider) */
    public void tick(View view) {
        if (view != null) {
            view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK);
        }
    }

    /** Våg 145: Tematisk haptik baserat på dygnsrytm */
    public void triggerThematic(String theme) {
        if (isLowPower()) return;
        
        switch (theme != null ? theme.toUpperCase() : "DAY") {
            case "MORNING":
                success(); // Light and energetic
                break;
            case "DAY":
                mechanicalClick(null); // Sharp and focused
                break;
            case "DUSK":
                liquidPulse(); // Soft and transitioning
                break;
            case "NIGHT":
                reminderGentle(); // Very subtle
                break;
            default:
                lightClick(null);
        }
    }
    
    /** Dubbelpuls för navigering */
    public void navigate() {
        if (isLowPower()) return; // Skippa navigations-haptik vid lågt batteri

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            long[] pattern = {0, 5, 20, 5}; 
            int[] amplitudes = {0, 30, 0, 40};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        }
    }

    /** Rytmisk puls för pågående inspelning */
    public void recordingPulse() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(10, 30));
        }
    }

    /** Unikt mönster för Valv-notiser */
    public void vaultAlert() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            long[] pattern = {0, 50, 100, 50, 100, 50}; // Tre skarpa pulser
            int[] amplitudes = {0, 255, 0, 255, 0, 255};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        }
    }

    /** Mjukare mönster för dagliga påminnelser */
    public void reminderGentle() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(100, 100)); // En mjukare puls
        }
    }

    /** Våg 175: Heartbeat double-pulse for Aura Flow */
    public void heartbeatPulse() {
        if (isLowPower()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            long[] pattern = {0, 10, 50, 10}; 
            int[] amplitudes = {0, 100, 0, 160};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        }
    }

    /** Våg 235: UI Echo — ultra-subtle tactile material feel */
    public void uiEcho() {
        if (isLowPower()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // One-shot, very low amplitude
            vibrator.vibrate(VibrationEffect.createOneShot(5, 30));
        }
    }
}
