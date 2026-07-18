package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;

public class RecordWidgetProvider extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        String path = WidgetConfigActivity.loadConfig(context, appWidgetId);
        String dynamicInfo = WidgetUpdateManager.getWidgetContent(context, "last_action");
        
        RemoteViews views;
        if (path.contains("/valv")) {
            views = WidgetViews.discreetNote(context, R.string.widget_note_title, path);
        } else {
            views = WidgetViews.discreetNote(context, R.string.widget_discreet_title, path);
        }

        if (dynamicInfo != null && !dynamicInfo.isEmpty()) {
            views.setTextViewText(R.id.widget_subtitle, dynamicInfo);
            views.setViewVisibility(R.id.widget_subtitle, android.view.View.VISIBLE);
        }
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
