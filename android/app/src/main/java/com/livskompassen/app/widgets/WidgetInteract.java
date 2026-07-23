package com.livskompassen.app.widgets;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

/**
 * @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET*.md
 *
 * Widget Interaction Surface (WIS) — primary path for Companion homescreen widgets.
 * Broadcast = in-place RemoteViews. Overlay = translucent input (no full app chrome).
 * {@link WidgetLaunch} remains legacy deep-link fallback only.
 */
public final class WidgetInteract {

    public static final String ACTION_WIDGET = "com.livskompassen.app.action.WIDGET_INTERACT";
    public static final String EXTRA_ACTION = "widget_action";
    public static final String EXTRA_PARAM = "widget_param";
    public static final String EXTRA_MODE = "overlay_mode";
    public static final String EXTRA_WIDGET_ID = "appWidgetId";

    /** Overlay modes */
    public static final String MODE_CAPTURE = "capture";
    public static final String MODE_CAPTURE_LIBRARY = "capture_library";
    public static final String MODE_NOTE = "note";
    public static final String MODE_MOOD = "mood";
    public static final String MODE_INTENTION = "intention";
    public static final String MODE_JOURNAL = "journal";
    public static final String MODE_INBOX_TEXT = "inbox_text";
    public static final String MODE_CHILD = "child";
    public static final String MODE_BEACON = "beacon";

    /** Broadcast actions */
    public static final String ACT_TASK_TOGGLE = "task.toggle";
    public static final String ACT_NOTE_CATEGORY = "note.category";
    public static final String ACT_HARBOR_MODE = "harbor.mode";
    public static final String ACT_ANCHOR_DONE = "anchor.done";
    public static final String ACT_TASKS_EXPAND = "tasks.expand";
    public static final String ACT_CAPTURE_STATUS = "capture.status";
    public static final String ACT_CAPTURE_STOP = "capture.stop";
    public static final String ACT_CAPTURE_TOGGLE = "capture.toggle";
    public static final String ACT_CAPTURE_DOWNLOAD = "capture.download";
    public static final String ACT_CAPTURE_SHARE = "capture.share";
    public static final String ACT_MOOD_CHECK = "mood.check";

    private WidgetInteract() {}

    public static PendingIntent broadcastPendingIntent(Context context, String action, String param) {
        Intent intent = new Intent(context, WidgetActionReceiver.class);
        intent.setAction(ACTION_WIDGET);
        intent.putExtra(EXTRA_ACTION, action == null ? "" : action);
        intent.putExtra(EXTRA_PARAM, param == null ? "" : param);
        String safeAction = action == null ? "none" : action;
        String safeParam = param == null ? "" : param;
        intent.setData(Uri.parse("livskompassen://widget-action/" + safeAction + "/" + Uri.encode(safeParam)));
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        int requestCode = (safeAction + "|" + safeParam).hashCode();
        return PendingIntent.getBroadcast(context, requestCode, intent, flags);
    }

    public static PendingIntent overlayPendingIntent(Context context, String mode) {
        return overlayPendingIntent(context, mode, null);
    }

    public static PendingIntent overlayPendingIntent(Context context, String mode, String param) {
        Intent intent = new Intent(context, WidgetOverlayActivity.class);
        intent.putExtra(EXTRA_MODE, mode == null ? MODE_NOTE : mode);
        if (param != null) {
            intent.putExtra(EXTRA_PARAM, param);
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        String safeMode = mode == null ? "note" : mode;
        String safeParam = param == null ? "" : param;
        intent.setData(Uri.parse("livskompassen://widget-overlay/" + safeMode + "/" + Uri.encode(safeParam)));
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        int requestCode = ("overlay|" + safeMode + "|" + safeParam).hashCode();
        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }

    /** Legacy deep-link — secondary “öppna modul” only. */
    public static PendingIntent legacyAppPendingIntent(Context context, String path) {
        return WidgetLaunch.pendingIntent(context, path);
    }
}
