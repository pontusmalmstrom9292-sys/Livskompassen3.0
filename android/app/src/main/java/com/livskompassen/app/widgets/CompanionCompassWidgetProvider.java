package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Kompassen on home screen.
 * Opens /widget/companion-compass. No core manager changes.
 */
public class CompanionCompassWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_chip_kompass,
                    R.string.widget_companion_compass_title,
                    R.string.widget_companion_compass_sub,
                    "/widget/companion-compass?focus=1",
                    "last_action_compass"
                )
            );
        }
    }
}
