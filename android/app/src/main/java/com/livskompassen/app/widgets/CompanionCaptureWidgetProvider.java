package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/**
 * Companion OS — Quick Capture on home screen.
 * Opens /widget/companion-capture (web QuickCaptureWidget). No core manager changes.
 */
public class CompanionCaptureWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_companion_mic,
                    R.string.widget_companion_capture_title,
                    R.string.widget_companion_capture_sub,
                    "/widget/companion-capture?autostart=1",
                    "last_action_capture"
                )
            );
        }
    }
}
