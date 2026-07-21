package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Inkast on home screen.
 * Opens /widget/companion-inbox. No core manager changes.
 */
public class CompanionInboxWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_inbox,
                    R.string.widget_companion_inbox_title,
                    R.string.widget_companion_inbox_sub,
                    "/widget/companion-inbox?focus=1",
                    "last_action_inbox"
                )
            );
        }
    }
}
