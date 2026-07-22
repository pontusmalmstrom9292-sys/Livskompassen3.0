package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Trygg Hamn rich RemoteViews. No core manager changes.
 */
public class CompanionHarborWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionHarbor(context));
        }
    }
}
