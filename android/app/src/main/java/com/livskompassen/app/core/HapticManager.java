package com.livskompassen.app.core;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.HapticFeedbackConstants;
import android.view.View;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
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

    /** Mjuk bekräftelse (t.ex. vid lyckad upplåsning) */
    public void success() {
        if (batteryManager != null && batteryManager.shouldReducePerformance()) return;

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
    
    /** Dubbelpuls för navigering */
    public void navigate() {
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
}
