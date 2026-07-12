package com.livskompassen.app.widgets;

import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/** Executive Midnight dock-style hemskärms-widgets (navy glass + guldkrets). */
public final class WidgetViews {

    private WidgetViews() {}

    /** WH1 diskret — horisontell dock-kapsel, «Anteckningar» utåt. */
    public static RemoteViews discreetNote(Context context, int titleResId, String path) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_dock_strip);
        views.setImageViewResource(R.id.widget_icon, R.drawable.widget_ic_note_discreet);
        views.setTextViewText(R.id.widget_title, context.getString(titleResId));
        views.setViewVisibility(R.id.widget_subtitle, View.GONE);
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetLaunch.pendingIntent(context, path)
        );
        return views;
    }

    /** WH2 m.fl. — vertikal dock-ruta med ikonring + titel. */
    public static RemoteViews chip(
        Context context,
        int iconResId,
        int titleResId,
        int subtitleResId,
        String path
    ) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_dock_tile);
        views.setImageViewResource(R.id.widget_icon, iconResId);
        views.setTextViewText(R.id.widget_title, context.getString(titleResId));

        if (subtitleResId != 0) {
            views.setTextViewText(R.id.widget_subtitle, context.getString(subtitleResId));
            views.setViewVisibility(R.id.widget_subtitle, View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.widget_subtitle, View.GONE);
        }

        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetLaunch.pendingIntent(context, path)
        );
        return views;
    }
}
