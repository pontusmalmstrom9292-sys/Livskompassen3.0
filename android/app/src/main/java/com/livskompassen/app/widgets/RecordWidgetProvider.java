package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/**
 * WH1 — Diskret «Anteckningar» på hemskärmen → /widget/inspelning?autostart=1&discreet=1
 * Ingen synlig «Inspelning»-text — neutral anteckningsikon.
 */
public class RecordWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_discreet_note);
            views.setTextViewText(R.id.widget_title, context.getString(R.string.widget_discreet_title));
            views.setViewVisibility(R.id.widget_subtitle, View.GONE);
            views.setOnClickPendingIntent(
                R.id.widget_root,
                WidgetLaunch.pendingIntent(context, "/widget/inspelning?autostart=1&discreet=1")
            );
            manager.updateAppWidget(widgetId, views);
        }
    }
}
