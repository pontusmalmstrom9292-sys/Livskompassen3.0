package com.livskompassen.app.widgets;

import android.content.Context;

import com.livskompassen.app.util.SecurePrefs;

/**
 * Companion Widget AI heuristics for RemoteViews (WIDGET_BIBLE 5.4).
 * Local SecurePrefs only — no LLM, no cross-RAG, no WORM writes.
 * Aligns with {@code src/widgets/smart/widgetAiContext.ts}.
 * Pref keys use widget_ prefix so NativeInterface.setWidgetData can write them.
 */
public final class WidgetAiModes {

    public static final String PREF_AI_ENABLED = "widget_ai_enabled";
    public static final String PREF_MODE = "widget_ai_mode";
    public static final String PREF_BANNER = "widget_ai_banner";
    public static final String PREF_DIM = "widget_ai_dim";
    public static final String PREF_PAUSE = "widget_ai_pause";

    public enum AiMode {
        NORMAL,
        HARBOR,
        SINGLE_TASK,
        FAMILY,
        ANCHOR_ONLY
    }

    private WidgetAiModes() {}

    public static boolean isEnabled(Context context) {
        String v = SecurePrefs.get(context).getString(PREF_AI_ENABLED, "0");
        return "1".equals(v) || "true".equalsIgnoreCase(v);
    }

    public static AiMode resolveMode(Context context) {
        if (!isEnabled(context)) return AiMode.NORMAL;
        String raw = SecurePrefs.get(context).getString(PREF_MODE, "normal");
        if (raw == null) return AiMode.NORMAL;
        switch (raw) {
            case "harbor":
                return AiMode.HARBOR;
            case "single_task":
                return AiMode.SINGLE_TASK;
            case "family":
                return AiMode.FAMILY;
            case "anchor_only":
                return AiMode.ANCHOR_ONLY;
            default:
                return AiMode.NORMAL;
        }
    }

    public static String banner(Context context) {
        if (!isEnabled(context)) return "";
        String b = SecurePrefs.get(context).getString(PREF_BANNER, "");
        return b != null ? b.trim() : "";
    }

    public static boolean dimVisual(Context context) {
        if (!isEnabled(context)) return false;
        String v = SecurePrefs.get(context).getString(PREF_DIM, "0");
        return "1".equals(v) || "true".equalsIgnoreCase(v);
    }

    public static boolean pauseProactive(Context context) {
        if (!isEnabled(context)) return false;
        String v = SecurePrefs.get(context).getString(PREF_PAUSE, "0");
        return "1".equals(v) || "true".equalsIgnoreCase(v);
    }
}
