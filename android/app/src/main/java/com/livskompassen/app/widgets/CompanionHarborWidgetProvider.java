package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Trygg Hamn on home screen.
 * Opens /widget/companion-harbor. No core manager changes.
 */
public class CompanionHarborWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_harbor,
                    R.string.widget_companion_harbor_title,
                    R.string.widget_companion_harbor_sub,
                    "/widget/companion-harbor?focus=1",
                    "last_action_harbor"
                )
            );
        }
    }
}
