package com.livskompassen.app.widgets;

import android.app.PendingIntent;
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

    /**
     * RemoteViews: taps on child ImageView/TextView often do not bubble to the root.
     * Bind the same PendingIntent on root + visible children (Stamp-pattern).
     */
    private static void bindClick(RemoteViews views, PendingIntent pendingIntent) {
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_icon, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_subtitle, pendingIntent);
    }

    private static String liveText(Context context, String statusKey, int maxLen) {
        String dynamic = null;
        if (statusKey != null && !statusKey.isEmpty()) {
            dynamic = WidgetUpdateManager.getWidgetContent(context, statusKey);
        }
        if (dynamic == null || dynamic.trim().isEmpty()) {
            dynamic = WidgetUpdateManager.getWidgetContent(context, "last_action");
        }
        if (dynamic == null) return null;
        String text = dynamic.trim();
        if (text.isEmpty()) return null;
        if (text.length() > maxLen) {
            text = text.substring(0, Math.max(0, maxLen - 1)) + "…";
        }
        return text;
    }

    /** WH1 diskret — horisontell dock-kapsel, «Anteckningar» utåt. */
    public static RemoteViews discreetNote(Context context, int titleResId, String path) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_dock_strip);
        views.setImageViewResource(R.id.widget_icon, R.drawable.widget_ic_note_discreet);
        views.setTextViewText(R.id.widget_title, context.getString(titleResId));
        views.setViewVisibility(R.id.widget_subtitle, View.GONE);
        applyLiveSubtitle(context, views, null);
        bindClick(views, WidgetLaunch.pendingIntent(context, path));
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
        bindClick(views, WidgetLaunch.pendingIntent(context, path));
        return views;
    }

    /**
     * Companion Capture — rich RemoteViews (Stamp pattern + Kap 6 Gold).
     * Mic + root → autostart; Senaste → focus open. No Sacred core / native ingest.
     */
    public static RemoteViews companionCapture(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_capture);
        String dynamic = liveText(context, "last_action_capture", 40);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_capture_sub, dynamic);
        }
        PendingIntent autostart = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-capture?autostart=1"
        );
        PendingIntent focus = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-capture?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_capture_mic, autostart);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_recent, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_root, autostart);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_title, autostart);
        return views;
    }

    /**
     * Companion Note — compose / pills / photo / voice / + with separate deep-links.
     * text/foto → Inkast; voice → Valv (web session).
     */
    public static RemoteViews companionNote(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_note);
        PendingIntent focus = WidgetLaunch.pendingIntent(context, "/widget/companion-note?focus=1");
        PendingIntent photo = WidgetLaunch.pendingIntent(context, "/widget/companion-note?photo=1");
        PendingIntent voice = WidgetLaunch.pendingIntent(context, "/widget/companion-note?voice=1");
        views.setOnClickPendingIntent(R.id.widget_companion_note_compose, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_pill_tanke, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_pill_ide, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_pill_paminnelse, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_pill_annat, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_photo, photo);
        views.setOnClickPendingIntent(R.id.widget_companion_note_voice, voice);
        views.setOnClickPendingIntent(R.id.widget_companion_note_add, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_note_root, focus);
        return views;
    }

    /**
     * Companion Compass Large — rich Gold disc + intention CTA (not chip).
     */
    public static RemoteViews companionCompass(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_compass);
        String dynamic = liveText(context, "last_action_compass", 48);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_compass_intention, dynamic);
        }
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-compass?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_compass_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_disc, open);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_cta, open);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_title, open);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_intention, open);
        return views;
    }

    /**
     * Companion Beacon Medium — capacity ring + metrics + Visa mer (not chip).
     */
    public static RemoteViews companionBeacon(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_beacon);
        String dynamic = liveText(context, "last_action_beacon", 24);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_beacon_state, dynamic);
        }
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-beacon?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_ring, open);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_cta, open);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_title, open);
        return views;
    }

    /**
     * Companion Inbox Small — 4 buttons (NOT XS). text/foto/länk → Inkast; voice → Valv path via app.
     */
    public static RemoteViews companionInbox(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_inbox);
        String dynamic = liveText(context, "last_action_inbox", 40);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_inbox_sub, dynamic);
        }
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_text,
            WidgetLaunch.pendingIntent(context, "/widget/companion-inbox?text=1")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_voice,
            WidgetLaunch.pendingIntent(context, "/widget/companion-inbox?voice=1")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_photo,
            WidgetLaunch.pendingIntent(context, "/widget/companion-inbox?photo=1")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_link,
            WidgetLaunch.pendingIntent(context, "/widget/companion-inbox?link=1")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_root,
            WidgetLaunch.pendingIntent(context, "/widget/companion-inbox?focus=1")
        );
        return views;
    }

    /**
     * Companion Tasks Small — max 3 rows + Visa alla (rich, not chip).
     */
    public static RemoteViews companionTasks(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_tasks);
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-tasks?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_row1, open);
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_row2, open);
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_row3, open);
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_all, open);
        views.setOnClickPendingIntent(R.id.widget_companion_tasks_title, open);
        return views;
    }

    /**
     * Companion Journal Small — quote + Skriv (write=1 opens draft).
     */
    public static RemoteViews companionJournal(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_journal);
        String dynamic = liveText(context, "last_action_journal", 80);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_journal_quote, dynamic);
        }
        PendingIntent write = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-journal?write=1"
        );
        PendingIntent focus = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-journal?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_journal_write, write);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_root, write);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_quote, focus);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_title, write);
        return views;
    }

    /**
     * Companion Harbor — lotus + affirmation + 4 quick actions.
     */
    public static RemoteViews companionHarbor(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_harbor);
        String dynamic = liveText(context, "last_action_harbor", 60);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_harbor_affirm, dynamic);
        }
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-harbor?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_lotus, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_affirm, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_breath, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_focus, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_thanks, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_sleep, open);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_title, open);
        return views;
    }

    /**
     * Companion Anchor XS — Klar one-tap (opens surface with focus).
     */
    public static RemoteViews companionAnchor(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_anchor);
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-anchor?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_done, open);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_icon, open);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_title, open);
        return views;
    }

    /**
     * Companion Child Medium — dagens fråga + Svara (§12 Barnfokus additiv).
     */
    public static RemoteViews companionChild(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_child);
        String dynamic = liveText(context, "last_action_child", 90);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_child_question, dynamic);
        }
        PendingIntent open = WidgetLaunch.pendingIntent(
            context,
            "/widget/companion-child?focus=1"
        );
        views.setOnClickPendingIntent(R.id.widget_companion_child_root, open);
        views.setOnClickPendingIntent(R.id.widget_companion_child_answer, open);
        views.setOnClickPendingIntent(R.id.widget_companion_child_question, open);
        views.setOnClickPendingIntent(R.id.widget_companion_child_title, open);
        return views;
    }
}
