package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Quick Note on home screen.
 * Opens /widget/companion-note. No core manager changes.
 */
public class CompanionNoteWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_note,
                    R.string.widget_companion_note_title,
                    R.string.widget_companion_note_sub,
                    "/widget/companion-note?focus=1",
                    "last_action_note"
                )
            );
        }
    }
}
