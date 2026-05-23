package com.livskompassen.app.widgets;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import com.livskompassen.app.MainActivity;

/** Deep-link från hemskärms-widget → Capacitor WebView route. */
public final class WidgetLaunch {

    public static final String EXTRA_WIDGET_PATH = "widget_path";

    private WidgetLaunch() {}

    public static PendingIntent pendingIntent(Context context, String path) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.putExtra(EXTRA_WIDGET_PATH, path);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getActivity(context, path.hashCode(), intent, flags);
    }
}
