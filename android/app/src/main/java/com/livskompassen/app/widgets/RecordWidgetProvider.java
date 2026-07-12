package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * WH1 — Diskret «Anteckningar» på hemskärmen → /widget/inspelning?autostart=1&discreet=1
 * Guldkrets-ikon (anteckning) — ingen synlig «Inspelning»-text.
 */
public class RecordWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.discreetNote(
                    context,
                    R.string.widget_discreet_title,
                    "/widget/inspelning?autostart=1&discreet=1"
                )
            );
        }
    }
}
