package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/** WH8 — Mina moduler (nedräkning, checklista, sparmål, notis) */
public class ModulerWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_wh8_moduler,
                    R.string.widget_moduler_title,
                    R.string.widget_moduler_sub,
                    "/widget/moduler"
                )
            );
        }
    }
}
