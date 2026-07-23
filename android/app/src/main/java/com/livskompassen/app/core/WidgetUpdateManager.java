package com.livskompassen.app.core;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import com.livskompassen.app.util.SecurePrefs;
import com.livskompassen.app.widgets.CompanionAnchorWidgetProvider;
import com.livskompassen.app.widgets.CompanionBeaconWidgetProvider;
import com.livskompassen.app.widgets.CompanionCaptureWidgetProvider;
import com.livskompassen.app.widgets.CompanionChildWidgetProvider;
import com.livskompassen.app.widgets.CompanionCheckInWidgetProvider;
import com.livskompassen.app.widgets.CompanionCompassWidgetProvider;
import com.livskompassen.app.widgets.CompanionFamilyWidgetProvider;
import com.livskompassen.app.widgets.CompanionHarborWidgetProvider;
import com.livskompassen.app.widgets.CompanionInboxWidgetProvider;
import com.livskompassen.app.widgets.CompanionJournalWidgetProvider;
import com.livskompassen.app.widgets.CompanionNoteWidgetProvider;
import com.livskompassen.app.widgets.CompanionTasksWidgetProvider;
import com.livskompassen.app.widgets.RecordWidgetProvider;
import com.livskompassen.app.widgets.UtvecklingskortWidgetProvider;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Manages the dynamic data flow from Web/Native to Home Screen Widgets.
 */
public class WidgetUpdateManager {
    private static final String PREF_WIDGET_DATA_PREFIX = "dynamic_data_";

    @SuppressWarnings("rawtypes")
    private static final Class[] LIVE_STATUS_WIDGETS = {
        RecordWidgetProvider.class,
        CompanionCaptureWidgetProvider.class,
        CompanionInboxWidgetProvider.class,
        CompanionNoteWidgetProvider.class,
        CompanionHarborWidgetProvider.class,
        CompanionCompassWidgetProvider.class,
        CompanionChildWidgetProvider.class,
        CompanionBeaconWidgetProvider.class,
        CompanionJournalWidgetProvider.class,
        CompanionAnchorWidgetProvider.class,
        CompanionTasksWidgetProvider.class,
        CompanionCheckInWidgetProvider.class,
        CompanionFamilyWidgetProvider.class,
    };
    
    /**
     * Uppdaterar lagrad data för en specifik widget-typ.
     */
    public static void updateWidgetContent(Context context, String key, String value) {
        SharedPreferences prefs = SecurePrefs.get(context);
        prefs.edit().putString(PREF_WIDGET_DATA_PREFIX + key, value).apply();

        // Prefer scoped refresh (battery) — full refresh only for global last_action / unknown keys.
        Class<?> scoped = companionProviderForStatusKey(key);
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        if (scoped != null) {
            refreshProvider(context, manager, scoped);
            return;
        }
        if ("last_action".equals(key)) {
            refreshAllWidgets(context);
            return;
        }
        // AI / misc SecurePrefs-driven keys: refresh live Companion pack once.
        refreshAllWidgets(context);
    }

    /**
     * Tvingar fram en uppdatering av alla widgets (t.ex. vid dygnsrytmsbyte).
     */
    public static void refreshAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        for (Class<?> provider : LIVE_STATUS_WIDGETS) {
            refreshProvider(context, manager, provider);
        }
        refreshProvider(context, manager, UtvecklingskortWidgetProvider.class);
        refreshProvider(context, manager, RecordWidgetProvider.class);
    }

    /** Map last_action_* → Companion AppWidgetProvider. */
    private static Class<?> companionProviderForStatusKey(String key) {
        switch (key) {
            case "last_action_capture":
                return CompanionCaptureWidgetProvider.class;
            case "last_action_inbox":
                return CompanionInboxWidgetProvider.class;
            case "last_action_note":
                return CompanionNoteWidgetProvider.class;
            case "last_action_harbor":
                return CompanionHarborWidgetProvider.class;
            case "last_action_compass":
                return CompanionCompassWidgetProvider.class;
            case "last_action_child":
                return CompanionChildWidgetProvider.class;
            case "last_action_beacon":
                return CompanionBeaconWidgetProvider.class;
            case "last_action_journal":
                return CompanionJournalWidgetProvider.class;
            case "last_action_anchor":
                return CompanionAnchorWidgetProvider.class;
            case "last_action_tasks":
                return CompanionTasksWidgetProvider.class;
            case "last_action_mood":
            case "last_action_checkin":
                return CompanionCheckInWidgetProvider.class;
            case "last_action_family":
                return CompanionFamilyWidgetProvider.class;
            default:
                return null;
        }
    }

    private static void refreshProvider(Context context, AppWidgetManager manager, Class<?> provider) {
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, provider));
        if (ids == null || ids.length == 0) return;
        Intent intent = new Intent(context, provider);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }

    public static String getWidgetContent(Context context, String key) {
        return SecurePrefs.get(context).getString(PREF_WIDGET_DATA_PREFIX + key, "");
    }
}
