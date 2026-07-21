package com.livskompassen.app.widgets;

import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;

/** Executive Midnight dock-style hemskärms-widgets (navy glass + guldkrets). */
public final class WidgetViews {

    private WidgetViews() {}

    /**
     * Prefer scoped last_action_* for Companion chips; fall back to global last_action.
     */
    private static void applyLiveSubtitle(Context context, RemoteViews views, String statusKey) {
        String dynamic = null;
        if (statusKey != null && !statusKey.isEmpty()) {
            dynamic = WidgetUpdateManager.getWidgetContent(context, statusKey);
        }
        if (dynamic == null || dynamic.trim().isEmpty()) {
            dynamic = WidgetUpdateManager.getWidgetContent(context, "last_action");
        }
        if (dynamic == null) return;
        String text = dynamic.trim();
        if (text.isEmpty()) return;
        if (text.length() > 40) {
            text = text.substring(0, 37) + "…";
        }
        views.setTextViewText(R.id.widget_subtitle, text);
        views.setViewVisibility(R.id.widget_subtitle, View.VISIBLE);
    }

    /** WH1 diskret — horisontell dock-kapsel, «Anteckningar» utåt. */
    public static RemoteViews discreetNote(Context context, int titleResId, String path) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_dock_strip);
        views.setImageViewResource(R.id.widget_icon, R.drawable.widget_ic_note_discreet);
        views.setTextViewText(R.id.widget_title, context.getString(titleResId));
        views.setViewVisibility(R.id.widget_subtitle, View.GONE);
        applyLiveSubtitle(context, views, null);
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
        return chip(context, iconResId, titleResId, subtitleResId, path, null);
    }

    /** Companion chip with scoped live subtitle key (e.g. last_action_capture). */
    public static RemoteViews chip(
        Context context,
        int iconResId,
        int titleResId,
        int subtitleResId,
        String path,
        String statusKey
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

        applyLiveSubtitle(context, views, statusKey);
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetLaunch.pendingIntent(context, path)
        );
        return views;
    }
}
