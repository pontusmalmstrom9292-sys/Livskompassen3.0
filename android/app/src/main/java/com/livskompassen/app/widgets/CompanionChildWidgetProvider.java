package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Barnfokus on home screen.
 * Opens /widget/companion-child. No core manager changes.
 */
public class CompanionChildWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_child,
                    R.string.widget_companion_child_title,
                    R.string.widget_companion_child_sub,
                    "/widget/companion-child?focus=1",
                    "last_action_child"
                )
            );
        }
    }
}
