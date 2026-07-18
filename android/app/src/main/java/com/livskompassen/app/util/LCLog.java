package com.livskompassen.app.util;

import android.util.Log;
import com.livskompassen.app.core.DiagnosticManager;

/**
 * Sekretess-medveten logger för Livskompassen.
 */
public final class LCLog {
    private static final String TAG = "Livskompassen";
    
    // Ändra till false vid release-bygge om BuildConfig.DEBUG inte kan användas automatiskt.
    private static final boolean DEBUG_MODE = true;

    private LCLog() {}

    public static void d(String message) {
        if (DEBUG_MODE) {
            Log.d(TAG, message);
            DiagnosticManager diag = DiagnosticManager.getInstance();
            if (diag != null) diag.writeLog("DEBUG", message);
        }
    }

    public static void w(String message) {
        if (DEBUG_MODE) {
            Log.w(TAG, message);
            DiagnosticManager diag = DiagnosticManager.getInstance();
            if (diag != null) diag.writeLog("WARN", message);
        }
    }

    public static void e(String message) {
        Log.e(TAG, message);
        DiagnosticManager diag = DiagnosticManager.getInstance();
        if (diag != null) diag.writeLog("ERROR", message);
    }

    public static void e(String message, Throwable t) {
        Log.e(TAG, message, t);
        DiagnosticManager diag = DiagnosticManager.getInstance();
        if (diag != null) diag.writeLog("ERROR", message + " | " + t.getMessage());
    }
}
