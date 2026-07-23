package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

/** Companion Check-in — Dagens check-in med emojis */
public class CompanionCheckInWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionCheckIn(context));
        }
    }
}
