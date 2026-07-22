package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Snabba anteckningar on home screen.
 * Rich RemoteViews: compose / photo / voice / + with separate PendingIntents.
 * No core manager changes.
 */
public class CompanionNoteWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionNote(context));
        }
    }
}
