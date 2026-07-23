package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.livskompassen.app.core.WidgetUpdateManager;
import com.livskompassen.app.util.SecurePrefs;

/**
 * @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET*.md
 *
 * In-place Companion widget actions — updates RemoteViews without opening MainActivity.
 */
public class WidgetActionReceiver extends BroadcastReceiver {

    private static final String PREF_TASK_DONE_PREFIX = "widget_state_task_done_";
    private static final String PREF_NOTE_CATEGORY = "widget_state_note_category";
    private static final String PREF_TASKS_EXPANDED = "widget_state_tasks_expanded";
    private static final String PREF_HARBOR_MODE = "widget_state_harbor_mode";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getStringExtra(WidgetInteract.EXTRA_ACTION);
        if (action == null || action.isEmpty()) return;
        String param = intent.getStringExtra(WidgetInteract.EXTRA_PARAM);

        SharedPreferences prefs = SecurePrefs.get(context);

        switch (action) {
            case WidgetInteract.ACT_TASK_TOGGLE:
                toggleTask(context, prefs, param);
                break;
            case WidgetInteract.ACT_NOTE_CATEGORY:
                setNoteCategory(context, prefs, param);
                break;
            case WidgetInteract.ACT_HARBOR_MODE:
                setHarborMode(context, prefs, param);
                break;
            case WidgetInteract.ACT_ANCHOR_DONE:
                markAnchorDone(context, prefs);
                break;
            case WidgetInteract.ACT_TASKS_EXPAND:
                toggleTasksExpand(context, prefs);
                break;
            case WidgetInteract.ACT_CAPTURE_STATUS:
                // Status-only refresh hook
                WidgetUpdateManager.updateWidgetContent(context, "last_action_capture",
                    param == null || param.isEmpty() ? "Redo att spela in" : param);
                break;
            case WidgetInteract.ACT_CAPTURE_STOP:
                WidgetCaptureService.stop(context, true);
                break;
            case WidgetInteract.ACT_CAPTURE_TOGGLE:
                if (WidgetCaptureService.isRecording()
                        || SecurePrefs.get(context).getBoolean(WidgetCaptureService.PREF_RECORDING, false)) {
                    WidgetCaptureService.stop(context, true);
                } else {
                    WidgetCaptureService.start(context);
                }
                break;
            case WidgetInteract.ACT_CAPTURE_DOWNLOAD:
                WidgetCaptureStore.downloadToDownloads(context, param);
                break;
            case WidgetInteract.ACT_CAPTURE_SHARE:
                WidgetCaptureStore.shareToDevice(context, param);
                break;
            case WidgetInteract.ACT_MOOD_CHECK:
                setMoodCheck(context, prefs, param);
                break;
            case WidgetInteract.ACT_POMODORO_TOGGLE:
                togglePomodoro(context, prefs);
                break;
            default:
                break;
        }
    }

    private static void togglePomodoro(Context context, SharedPreferences prefs) {
        boolean active = prefs.getBoolean("widget_pomodoro_active", false);
        long base = prefs.getLong("widget_pomodoro_base", 0);
        SharedPreferences.Editor ed = prefs.edit();
        if (!active) {
            // 25 min countdown from now
            base = System.currentTimeMillis() + 25L * 60L * 1000L;
            ed.putLong("widget_pomodoro_base", base);
            ed.putBoolean("widget_pomodoro_active", true);
            WidgetUpdateManager.updateWidgetContent(context, "last_action_compass", "Fokuspass igång");
        } else {
            ed.putBoolean("widget_pomodoro_active", false);
            WidgetUpdateManager.updateWidgetContent(context, "last_action_compass", "Fokuspass pausat");
        }
        ed.apply();
        refreshProvider(context, CompanionCompassWidgetProvider.class);
    }

    private static void setMoodCheck(Context context, SharedPreferences prefs, String param) {
        prefs.edit().putString("widget_state_mood", param).apply();
        
        // Våg 91: Mechanical haptics for mood selection
        new com.livskompassen.app.core.HapticManager(context).mechanicalClick(null);

        WidgetUpdateManager.updateWidgetContent(context, "last_action_mood", "Humör valt: " + param);
        refreshProvider(context, CompanionCheckInWidgetProvider.class);
        refreshProvider(context, CompanionJournalWidgetProvider.class);
    }

    private static void toggleTask(Context context, SharedPreferences prefs, String param) {
        int index = 0;
        try {
            index = Integer.parseInt(param == null ? "0" : param);
        } catch (NumberFormatException ignored) {
            index = 0;
        }
        String key = PREF_TASK_DONE_PREFIX + index;
        boolean done = prefs.getBoolean(key, false);
        prefs.edit().putBoolean(key, !done).apply();
        String label = !done ? "Uppgift " + (index + 1) + " klar" : "Uppgift " + (index + 1) + " återställd";
        WidgetUpdateManager.updateWidgetContent(context, "last_action_tasks", label);
        refreshProvider(context, CompanionTasksWidgetProvider.class);
    }

    private static void setNoteCategory(Context context, SharedPreferences prefs, String param) {
        String cat = param == null || param.isEmpty() ? "tanke" : param;
        prefs.edit().putString(PREF_NOTE_CATEGORY, cat).apply();
        WidgetUpdateManager.updateWidgetContent(context, "last_action_note", "Kategori: " + cat);
        refreshProvider(context, CompanionNoteWidgetProvider.class);
    }

    private static void setHarborMode(Context context, SharedPreferences prefs, String param) {
        String mode = param == null || param.isEmpty() ? "breath" : param;
        prefs.edit().putString(PREF_HARBOR_MODE, mode).apply();
        
        // Våg 90: Liquid haptics for Harbor transitions
        new com.livskompassen.app.core.HapticManager(context).liquidPulse();
        
        String label;
        switch (mode) {
            case "focus":
                label = "Läge: Fokus";
                break;
            case "thanks":
                label = "Läge: Tacksamhet";
                break;
            case "sleep":
                label = "Läge: Sömn";
                break;
            default:
                label = "Läge: Andning";
                break;
        }
        WidgetUpdateManager.updateWidgetContent(context, "last_action_harbor", label);
        refreshProvider(context, CompanionHarborWidgetProvider.class);
    }

    private static void markAnchorDone(Context context, SharedPreferences prefs) {
        prefs.edit().putBoolean("widget_state_anchor_done", true)
            .putLong("widget_state_anchor_done_at", System.currentTimeMillis())
            .apply();
            
        new com.livskompassen.app.core.HapticManager(context).success();
        
        WidgetUpdateManager.updateWidgetContent(context, "last_action_anchor", "Ankare markerat ✓");
        refreshProvider(context, CompanionAnchorWidgetProvider.class);
    }

    private static void toggleTasksExpand(Context context, SharedPreferences prefs) {
        boolean expanded = prefs.getBoolean(PREF_TASKS_EXPANDED, false);
        prefs.edit().putBoolean(PREF_TASKS_EXPANDED, !expanded).apply();
        
        new com.livskompassen.app.core.HapticManager(context).navigate();
        
        WidgetUpdateManager.updateWidgetContent(context, "last_action_tasks",
            !expanded ? "Visar uppgifter" : "Kompakt lista");
        refreshProvider(context, CompanionTasksWidgetProvider.class);
    }

    static boolean isTaskDone(Context context, int index) {
        return SecurePrefs.get(context).getBoolean(PREF_TASK_DONE_PREFIX + index, false);
    }

    static String noteCategory(Context context) {
        return SecurePrefs.get(context).getString(PREF_NOTE_CATEGORY, "tanke");
    }

    static String harborMode(Context context) {
        return SecurePrefs.get(context).getString(PREF_HARBOR_MODE, "breath");
    }

    static boolean isAnchorDone(Context context) {
        return SecurePrefs.get(context).getBoolean("widget_state_anchor_done", false);
    }

    private static void refreshProvider(Context context, Class<?> provider) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, provider));
        if (ids == null || ids.length == 0) return;
        Intent intent = new Intent(context, provider);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }
}
