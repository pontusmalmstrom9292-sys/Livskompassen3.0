package com.livskompassen.app.util;

import android.util.Log;
import com.livskompassen.app.BuildConfig;
import com.livskompassen.app.core.DiagnosticManager;

/**
 * Sekretess-medveten logger för Livskompassen.
 */
public final class LCLog {
    private static final String DEFAULT_TAG = "Livskompassen";
    
    private LCLog() {}

    public static void d(String message, Object... args) {
        if (BuildConfig.DEBUG) {
            String formatted = format(message, args);
            Log.d(DEFAULT_TAG, formatted);
            writeToBlackBox("DEBUG", formatted);
        }
    }

    public static void w(String message, Object... args) {
        String formatted = format(message, args);
        Log.w(DEFAULT_TAG, formatted);
        writeToBlackBox("WARN", formatted);
    }

    public static void e(String message, Object... args) {
        String formatted = format(message, args);
        Log.e(DEFAULT_TAG, formatted);
        writeToBlackBox("ERROR", formatted);
    }

    public static void e(String message, Throwable t) {
        Log.e(DEFAULT_TAG, message, t);
        writeToBlackBox("ERROR", message + " | " + t.getMessage());
    }

    public static void i(String message, Object... args) {
        String formatted = format(message, args);
        Log.i(DEFAULT_TAG, formatted);
        writeToBlackBox("INFO", formatted);
    }

    private static String format(String message, Object... args) {
        return (args == null || args.length == 0) ? message : String.format(message, args);
    }

    private static void writeToBlackBox(String level, String message) {
        DiagnosticManager diag = DiagnosticManager.getInstance();
        if (diag != null) {
            diag.writeLog(level, message);
        }
    }
}
