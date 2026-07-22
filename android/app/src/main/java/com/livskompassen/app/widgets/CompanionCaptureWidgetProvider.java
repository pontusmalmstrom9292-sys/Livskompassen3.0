package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Hemlig inspelning on home screen (WIS).
 * Mic → FG {@link WidgetCaptureService} (background + locked screen). Status key last_action_capture.
 * Second tap / notification Stoppa → save. Sync via SecurePrefs queue — no full app chrome.
 */
public class CompanionCaptureWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionCapture(context));
        }
    }
}
