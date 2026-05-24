package com.livskompassen.app.widgets;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/**
 * WH1 — Inspelning → /widget/inspelning?autostart=1
 */
public class RecordWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_tile);
            views.setTextViewText(R.id.widget_title, context.getString(R.string.widget_record_title));
            views.setTextViewText(R.id.widget_subtitle, context.getString(R.string.widget_record_sub));
            views.setOnClickPendingIntent(
                R.id.widget_root,
                WidgetLaunch.pendingIntent(context, "/widget/inspelning?autostart=1")
            );
            manager.updateAppWidget(widgetId, views);
        }
    }
}
