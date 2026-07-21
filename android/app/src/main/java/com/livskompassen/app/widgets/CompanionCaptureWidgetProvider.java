package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Hemlig inspelning on home screen.
 * Rich RemoteViews (status key last_action_capture): mic → /widget/companion-capture?autostart=1 (web starts recording).
 * No core manager changes.
 */
public class CompanionCaptureWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionCapture(context));
        }
    }
}
