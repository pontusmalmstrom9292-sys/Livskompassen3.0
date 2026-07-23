package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Fyren Medium on home screen (rich Gold RemoteViews).
 * Capacity CTA → WIS overlay (MODE_BEACON). No Sacred core/** changes.
 */
public class CompanionBeaconWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionBeacon(context));
        }
    }
}
