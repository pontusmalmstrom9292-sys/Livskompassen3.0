package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

public class RecordWidgetProvider extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        String path = WidgetConfigActivity.loadConfig(context, appWidgetId);
        
        RemoteViews views;
        if (path.contains("/valv")) {
            views = WidgetViews.discreetNote(context, R.string.widget_note_title, path);
        } else {
            views = WidgetViews.discreetNote(context, R.string.widget_discreet_title, path);
        }
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
