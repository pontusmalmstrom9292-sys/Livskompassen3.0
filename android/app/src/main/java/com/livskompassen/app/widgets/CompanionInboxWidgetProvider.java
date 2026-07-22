package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/**
 * Companion OS — Inkast Small (4-btn rich RemoteViews). NOT XS.
 * text/foto/länk → Inkast; voice → app session. No core manager changes.
 */
public class CompanionInboxWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(widgetId, WidgetViews.companionInbox(context));
        }
    }
}
