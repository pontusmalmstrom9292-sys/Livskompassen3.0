package com.livskompassen.app.widgets;

import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

import com.livskompassen.app.R;

/** Shared Obsidian Calm chip layout for hemskärms-widgets (guldkrets-ikoner). */
public final class WidgetViews {

    private WidgetViews() {}

    public static RemoteViews chip(
        Context context,
        int iconResId,
        int titleResId,
        int subtitleResId,
        String path
    ) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_chip);
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
