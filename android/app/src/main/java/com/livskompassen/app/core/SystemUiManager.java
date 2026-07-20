package com.livskompassen.app.core;

import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import androidx.annotation.NonNull;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.fragment.app.FragmentActivity;

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
    private AudioFocusRequest lockFocusRequest;

    public SystemUiManager(FragmentActivity activity) {
        this.activity = activity;
        this.window = activity.getWindow();
        this.audioManager = (AudioManager) activity.getSystemService(android.content.Context.AUDIO_SERVICE);
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
