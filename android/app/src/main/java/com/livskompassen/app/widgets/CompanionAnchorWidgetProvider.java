package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Ankare on home screen.
 * Opens /widget/companion-anchor. No core manager changes.
 */
public class CompanionAnchorWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_anchor,
                    R.string.widget_companion_anchor_title,
                    R.string.widget_companion_anchor_sub,
                    "/widget/companion-anchor?focus=1",
                    "last_action_anchor"
                )
            );
        }
    }
}
