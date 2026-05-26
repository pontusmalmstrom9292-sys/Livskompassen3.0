package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/** WH6 — Stämpel in/ut (Motorola hemskärm). */
public class StampWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_stamp);

            views.setOnClickPendingIntent(
                R.id.widget_stamp_in,
                WidgetLaunch.pendingIntent(context, "/widget/stampla?action=in")
            );
            views.setOnClickPendingIntent(
                R.id.widget_stamp_out,
                WidgetLaunch.pendingIntent(context, "/widget/stampla?action=out")
            );

            manager.updateAppWidget(widgetId, views);
        }
    }
}
