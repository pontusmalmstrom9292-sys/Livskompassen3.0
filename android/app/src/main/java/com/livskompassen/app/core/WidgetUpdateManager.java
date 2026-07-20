package com.livskompassen.app.core;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import com.livskompassen.app.util.SecurePrefs;
import com.livskompassen.app.widgets.RecordWidgetProvider;
import com.livskompassen.app.widgets.UtvecklingskortWidgetProvider;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Manages the dynamic data flow from Web/Native to Home Screen Widgets.
 */
public class WidgetUpdateManager {
    private static final String PREF_WIDGET_DATA_PREFIX = "dynamic_data_";
    
    /**
     * Uppdaterar lagrad data för en specifik widget-typ.
     */
    public static void updateWidgetContent(Context context, String key, String value) {
        SharedPreferences prefs = SecurePrefs.get(context);
        prefs.edit().putString(PREF_WIDGET_DATA_PREFIX + key, value).apply();
        
        // Triggera en omedelbar visuell uppdatering av alla widgets
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, RecordWidgetProvider.class));
        
        Intent intent = new Intent(context, RecordWidgetProvider.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);

        // Also update Utvecklingskort if key matches
        if ("utv_kort_body".equals(key)) {
            int[] utvIds = manager.getAppWidgetIds(new ComponentName(context, UtvecklingskortWidgetProvider.class));
            Intent utvIntent = new Intent(context, UtvecklingskortWidgetProvider.class);
            utvIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            utvIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, utvIds);
            context.sendBroadcast(utvIntent);
        }
    }

    public static String getWidgetContent(Context context, String key) {
        return SecurePrefs.get(context).getString(PREF_WIDGET_DATA_PREFIX + key, "");
    }
}
