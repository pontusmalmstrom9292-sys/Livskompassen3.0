package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Ankare XS rich RemoteViews. No core manager changes.
 */
public class CompanionAnchorWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionAnchor(context));
        }
    }
}
