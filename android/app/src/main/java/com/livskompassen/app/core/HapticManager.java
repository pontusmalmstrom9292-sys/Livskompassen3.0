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
    private final Vibrator vibrator;

    public HapticManager(Context context) {
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
    }

    /** Mjuk bekräftelse (t.ex. vid lyckad upplåsning) */
    public void success() {
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
    
    /** Kraftigare feedback för viktiga val */
    public void confirm(View view) {
        if (view != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM);
            } else {
                view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
            }
        }
    }
}
