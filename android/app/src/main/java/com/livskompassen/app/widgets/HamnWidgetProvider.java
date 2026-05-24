package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/** WH4 — BIFF / Hamn */
public class HamnWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_tile);
            views.setTextViewText(R.id.widget_title, context.getString(R.string.widget_hamn_title));
            views.setTextViewText(R.id.widget_subtitle, context.getString(R.string.widget_hamn_sub));
            views.setOnClickPendingIntent(
                R.id.widget_root,
                WidgetLaunch.pendingIntent(context, "/widget/hamn")
            );
            manager.updateAppWidget(widgetId, views);
        }
    }
}
