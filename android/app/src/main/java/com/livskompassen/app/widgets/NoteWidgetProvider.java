package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/** WH2 — Snabbanteckning */
public class NoteWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_wh2_note,
                    R.string.widget_note_title,
                    R.string.widget_note_sub,
                    "/widget/anteckning"
                )
            );
        }
    }
}
