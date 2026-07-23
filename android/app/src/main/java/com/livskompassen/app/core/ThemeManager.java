package com.livskompassen.app.core;

import java.util.Calendar;
import androidx.annotation.NonNull;
import com.livskompassen.app.util.LCLog;

/**
 * THEME ENGINE - Aura Phase.
 * Manages circadian rhythm-based themes and UI synchronization.
 */
public class ThemeManager {
    public enum CircadianPhase {
        MORNING("#1A1816", false), // Gryning: Svagt guld/brun-svart
        DAY("#0D0B09", false),     // Dag: Klassisk Obsidian
        DUSK("#0A0908", false),    // Skymning: Djupare Obsidian
        NIGHT("#000000", false);   // Natt: Absolut svart

        public final String colorHex;
        public final boolean lightIcons;

        CircadianPhase(String colorHex, boolean lightIcons) {
            this.colorHex = colorHex;
            this.lightIcons = lightIcons;
        }
    }

    public interface OnPhaseChangeListener {
        void onPhaseChanged(CircadianPhase newPhase);
    }

    private final SystemUiManager systemUiManager;
    private OnPhaseChangeListener listener;

    public ThemeManager(SystemUiManager systemUiManager) {
        this.systemUiManager = systemUiManager;
    }

    public void setOnPhaseChangeListener(OnPhaseChangeListener listener) {
        this.listener = listener;
    }

    /**
     * Beräknar aktuell dygnsfas baserat på klockslag.
     */
    public CircadianPhase getCurrentPhase() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        
        if (hour >= 5 && hour < 9) return CircadianPhase.MORNING;
        if (hour >= 9 && hour < 18) return CircadianPhase.DAY;
        if (hour >= 18 && hour < 22) return CircadianPhase.DUSK;
        return CircadianPhase.NIGHT;
    }

    /**
     * Applicerar temat på hela system-UI:t.
     */
    public void applyCircadianTheme() {
        CircadianPhase phase = getCurrentPhase();
        LCLog.d("ThemeManager: Applying circadian phase: " + phase.name());
        
        systemUiManager.setStatusBarTheme(phase.colorHex, true); // true = dark mode (light icons)
        systemUiManager.setNavigationBarTheme(phase.colorHex, true);
        
        if (listener != null) {
            listener.onPhaseChanged(phase);
        }
    }

    /**
     * Returnerar accentfärg baserat på dygnsfas för Widgets.
     */
    public String getWidgetAccentColor() {
        CircadianPhase phase = getCurrentPhase();
        switch (phase) {
            case MORNING: return "#FDE68A"; // Guld-ljus
            case DAY:     return "#D4AF37"; // Standard guld
            case DUSK:    return "#9A7B2F"; // Dovt guld
            case NIGHT:   return "#7BA3C9"; // Ethereal blå (nattvänlig)
            default:      return "#D4AF37";
        }
    }
}
