package com.livskompassen.app.widgets;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.livskompassen.app.MainActivity;

/** Deep-link från hemskärms-widget → Capacitor WebView route. */
public final class WidgetLaunch {

    public static final String EXTRA_WIDGET_PATH = "widget_path";

    private WidgetLaunch() {}

    public static PendingIntent pendingIntent(Context context, String path) {
        String safePath = path == null || path.isEmpty() ? "/" : path;
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.putExtra(EXTRA_WIDGET_PATH, safePath);
        /*
         * Unique data URI per path so FLAG_IMMUTABLE + UPDATE_CURRENT keeps distinct
         * PendingIntents (extras alone are unreliable across OEM launchers).
         * WidgetNavigator reads getData() path+query when present.
         */
        intent.setData(Uri.parse("livskompassen://launch" + (safePath.startsWith("/") ? safePath : "/" + safePath)));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        int requestCode = safePath.hashCode();
        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }
}
