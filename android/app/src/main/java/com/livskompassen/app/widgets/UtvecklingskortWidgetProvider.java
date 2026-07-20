package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;

/** WH9 — Dagens Utvecklingskort (Bento-mix) */
public class UtvecklingskortWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        String cardText = WidgetUpdateManager.getWidgetContent(context, "utv_kort_body");
        if (cardText == null || cardText.isEmpty()) {
            cardText = "Dra ner i appen för att blanda din mix.";
        }

        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_utv_kort);
            views.setTextViewText(R.id.widget_body, cardText);
            
            views.setOnClickPendingIntent(
                R.id.widget_root,
                WidgetLaunch.pendingIntent(context, "/?expand_dev=true")
            );
            
            manager.updateAppWidget(widgetId, views);
        }
    }
}
