package com.livskompassen.app.core;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.annotation.NonNull;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.fragment.app.FragmentActivity;

import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;

/**
 * THE CHROME FUSION - Våg 25.
 * @locked TITANIUM-BASE-CORE
 * Manages the seamless integration between the Web UI and Android System UI.
 */
public class SystemUiManager {
    private final FragmentActivity activity;
    private final Window window;
    private final AudioManager audioManager;
    private final View edgeGlowL;
    private final View edgeGlowR;
    private AudioFocusRequest lockFocusRequest;

    public SystemUiManager(FragmentActivity activity) {
        this.activity = activity;
        this.window = activity.getWindow();
        this.audioManager = (AudioManager) activity.getSystemService(android.content.Context.AUDIO_SERVICE);
        this.edgeGlowL = activity.findViewById(R.id.edge_glow_left);
        this.edgeGlowR = activity.findViewById(R.id.edge_glow_right);
        
        // Våg 250: Immersive Cutout Mastery
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.getAttributes().layoutInDisplayCutoutMode = 
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }
    }

    /**
     * Våg 150: Soft gradient aura on screen edges.
     */
    public void setEdgeGlow(String colorHex, float alpha) {
        activity.runOnUiThread(() -> {
            if (edgeGlowL == null || edgeGlowR == null) return;
            
            if (alpha <= 0) {
                edgeGlowL.setVisibility(View.GONE);
                edgeGlowR.setVisibility(View.GONE);
            } else {
                try {
                    int color = Color.parseColor(colorHex);
                    int transparent = Color.argb(0, Color.red(color), Color.green(color), Color.blue(color));
                    
                    // Left Gradient
                    GradientDrawable leftGrad = new GradientDrawable(
                        GradientDrawable.Orientation.LEFT_RIGHT,
                        new int[] {color, transparent}
                    );
                    edgeGlowL.setBackground(leftGrad);
                    
                    // Right Gradient
                    GradientDrawable rightGrad = new GradientDrawable(
                        GradientDrawable.Orientation.RIGHT_LEFT,
                        new int[] {color, transparent}
                    );
                    edgeGlowR.setBackground(rightGrad);

                    edgeGlowL.setAlpha(alpha);
                    edgeGlowR.setAlpha(alpha);
                    edgeGlowL.setVisibility(View.VISIBLE);
                    edgeGlowR.setVisibility(View.VISIBLE);
                } catch (Exception ignored) {}
            }
        });
    }

    /**
     * Dynamiskt justerar statusfältets färg och ikon-tema.
     * @param colorHex HEX-färgkod (t.ex. "#0D0B09")
     * @param isDark Om ikonerna ska vara ljusa (för mörk bakgrund) eller mörka.
     */
    public void setStatusBarTheme(@NonNull String colorHex, boolean isDark) {
        activity.runOnUiThread(() -> {
            try {
                int color = Color.parseColor(colorHex);
                window.setStatusBarColor(color);
                
                WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                if (controller != null) {
                    controller.setAppearanceLightStatusBars(!isDark);
                }
            } catch (Exception e) {
                LCLog.e("Failed to set status bar theme: " + e.getMessage());
            }
        });
    }

    /**
     * Gör navigationsfältet (längst ner) genomskinligt eller matchande.
     */
    public void setNavigationBarTheme(@NonNull String colorHex, boolean isDark) {
        activity.runOnUiThread(() -> {
            try {
                int color = Color.parseColor(colorHex);
                window.setNavigationBarColor(color);
                
                WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                if (controller != null) {
                    controller.setAppearanceLightNavigationBars(!isDark);
                }
            } catch (Exception e) {
                LCLog.e("Failed to set nav bar theme: " + e.getMessage());
            }
        });
    }

    public void setSystemTheme(@NonNull String colorHex, boolean isDark) {
        setStatusBarTheme(colorHex, isDark);
        setNavigationBarTheme(colorHex, isDark);
    }

    /**
     * Skapar en snabb visuell puls i statusfältet för att bekräfta en native-handling.
     */
    public void triggerFlashPulse() {
        activity.runOnUiThread(() -> {
            int originalColor = window.getStatusBarColor();
            int pulseColor = Color.argb(100, 253, 230, 138); // Guld-transparent
            
            window.setStatusBarColor(pulseColor);
            new android.os.Handler().postDelayed(() -> window.setStatusBarColor(originalColor), 100);
        });
    }

    /**
     * Aktiverar eller inaktiverar skydd mot skärmdumpar och låser ljudmiljön.
     */
    public void setSacredZone(boolean isSacred) {
        activity.runOnUiThread(() -> {
            if (isSacred) {
                window.addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                lockdownAudio();
                LCLog.d("SystemUiManager: Sacred Zone active. Screenshots & Audio locked.");
            } else {
                window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                releaseAudioLockdown();
                LCLog.d("SystemUiManager: Sacred Zone inactive. Screenshots & Audio released.");
            }
        });
    }

    private void lockdownAudio() {
        if (audioManager == null) return;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build();
            
            lockFocusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE)
                    .setAudioAttributes(attrs)
                    .setAcceptsDelayedFocusGain(true)
                    .setOnAudioFocusChangeListener(focusChange -> {
                        // Focus changed
                    })
                    .build();
            
            audioManager.requestAudioFocus(lockFocusRequest);
        } else {
            audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE);
        }
    }

    private void releaseAudioLockdown() {
        if (audioManager == null) return;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && lockFocusRequest != null) {
            audioManager.abandonAudioFocusRequest(lockFocusRequest);
        } else {
            audioManager.abandonAudioFocus(null);
        }
    }
}
