package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Uppgifter on home screen.
 * Opens /widget/companion-tasks. No core manager changes.
 */
public class CompanionTasksWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_wh7_actions,
                    R.string.widget_companion_tasks_title,
                    R.string.widget_companion_tasks_sub,
                    "/widget/companion-tasks?focus=1",
                    "last_action_tasks"
                )
            );
        }
    }
}
