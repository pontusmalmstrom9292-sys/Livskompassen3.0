package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/** WH7 — Åtgärder (Locked UX §13 dashboard) */
public class ActionDashboardWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_wh7_actions,
                    R.string.widget_action_title,
                    R.string.widget_action_sub,
                    "/widget/aktioner"
                )
            );
        }
    }
}
