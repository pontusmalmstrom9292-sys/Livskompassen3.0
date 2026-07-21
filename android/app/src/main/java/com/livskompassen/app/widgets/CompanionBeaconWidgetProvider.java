package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Fyren on home screen.
 * Opens /widget/companion-beacon. No core manager changes.
 */
public class CompanionBeaconWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_beacon,
                    R.string.widget_companion_beacon_title,
                    R.string.widget_companion_beacon_sub,
                    "/widget/companion-beacon?focus=1",
                    "last_action_beacon"
                )
            );
        }
    }
}
