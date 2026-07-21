package com.livskompassen.app.widgets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

import com.livskompassen.app.R;

/** Hemwidget — one-tap SOS Ankare → /widget/drogfrihet-akut */
public class DrogfrihetAkutWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            manager.updateAppWidget(
                widgetId,
                WidgetViews.chip(
                    context,
                    R.drawable.widget_ic_drogfrihet_akut,
                    R.string.widget_drogfrihet_akut_title,
                    R.string.widget_drogfrihet_akut_sub,
                    "/widget/drogfrihet-akut"
                )
            );
        }
    }
}
