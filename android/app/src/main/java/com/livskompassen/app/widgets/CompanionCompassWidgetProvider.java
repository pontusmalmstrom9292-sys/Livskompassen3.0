package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Kompassen Large on home screen (rich Gold RemoteViews).
 * Intention CTA → WIS overlay (MODE_INTENTION). No Sacred core/** changes.
 */
public class CompanionCompassWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.largeCompass(context));
        }
    }
}
