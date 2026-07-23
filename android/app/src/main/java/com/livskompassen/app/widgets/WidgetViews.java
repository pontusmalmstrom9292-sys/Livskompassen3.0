package com.livskompassen.app.widgets;

import android.app.PendingIntent;
import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;
import com.livskompassen.app.util.SecurePrefs;

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
        
        // Våg 92: Apply circadian tint to dynamic subtitles
        int color = android.graphics.Color.parseColor(
            new com.livskompassen.app.core.ThemeManager(null).getWidgetAccentColor());
        views.setTextColor(R.id.widget_subtitle, color);
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
     * Companion Capture — WIS: one tap starts FG background recording; second tap stops.
     * Continues with screen locked. Senaste → secure library (download/share).
     */
    public static RemoteViews companionCapture(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_capture);
        boolean recording = WidgetCaptureService.isRecording()
            || SecurePrefs.get(context).getBoolean(WidgetCaptureService.PREF_RECORDING, false);
        String dynamic = liveText(context, "last_action_capture", 40);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_capture_sub, dynamic);
        } else if (recording) {
            views.setTextViewText(R.id.widget_companion_capture_sub,
                context.getString(R.string.widget_companion_capture_recording_sub));
        }
        // Kap 6: ethereal waveform brighter while recording (activity accent only)
        float waveAlpha = recording ? 1f : 0.55f;
        views.setFloat(R.id.widget_companion_capture_wave_l, "setAlpha", waveAlpha);
        views.setFloat(R.id.widget_companion_capture_wave_r, "setAlpha", waveAlpha);
        PendingIntent primary = recording
            ? WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_CAPTURE_STOP, "")
            : WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_CAPTURE);
        PendingIntent status = recording
            ? WidgetInteract.broadcastPendingIntent(
                context, WidgetInteract.ACT_CAPTURE_STATUS, "Spelar in… tryck för stopp")
            : WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_CAPTURE_LIBRARY);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_mic, primary);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_root, primary);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_title, primary);
        views.setOnClickPendingIntent(R.id.widget_companion_capture_recent, status);
        return views;
    }

    /**
     * Companion Note — WIS: compose/+ → overlay text; pills → in-place category; voice → capture overlay.
     */
    public static RemoteViews companionNote(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_note);
        PendingIntent note = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_NOTE);
        PendingIntent voice = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_CAPTURE);
        String cat = WidgetActionReceiver.noteCategory(context);
        applyNotePillHighlight(views, cat);
        views.setOnClickPendingIntent(R.id.widget_companion_note_compose, note);
        views.setOnClickPendingIntent(R.id.widget_companion_note_add, note);
        views.setOnClickPendingIntent(R.id.widget_companion_note_root, note);
        views.setOnClickPendingIntent(
            R.id.widget_companion_note_pill_tanke,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_NOTE_CATEGORY, "tanke")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_note_pill_ide,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_NOTE_CATEGORY, "ide")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_note_pill_paminnelse,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_NOTE_CATEGORY, "paminnelse")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_note_pill_annat,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_NOTE_CATEGORY, "annat")
        );
        views.setOnClickPendingIntent(R.id.widget_companion_note_voice, voice);
        // Photo still needs system picker — legacy secondary path
        views.setOnClickPendingIntent(
            R.id.widget_companion_note_photo,
            WidgetInteract.legacyAppPendingIntent(context, "/widget/companion-note?photo=1")
        );
        return views;
    }

    private static void applyNotePillHighlight(RemoteViews views, String cat) {
        float dim = 0.45f;
        float on = 1f;
        views.setFloat(R.id.widget_companion_note_pill_tanke, "setAlpha", "tanke".equals(cat) ? on : dim);
        views.setFloat(R.id.widget_companion_note_pill_ide, "setAlpha", "ide".equals(cat) ? on : dim);
        views.setFloat(R.id.widget_companion_note_pill_paminnelse, "setAlpha", "paminnelse".equals(cat) ? on : dim);
        views.setFloat(R.id.widget_companion_note_pill_annat, "setAlpha", "annat".equals(cat) ? on : dim);
    }

    /**
     * Companion Compass — intention CTA → overlay (no full app).
     */
    public static RemoteViews companionCompass(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_compass);
        
        // Våg 97: Mask sensitive intention if Vault is locked
        boolean locked = SecurePrefs.get(context).getBoolean("sacred_lock_state", false);
        
        if (locked) {
            views.setTextViewText(R.id.widget_companion_compass_intention, "Dagens fokus är dolt");
        } else {
            String dynamic = liveText(context, "last_action_compass", 48);
            if (dynamic != null) {
                views.setTextViewText(R.id.widget_companion_compass_intention, dynamic);
            }
        }

        PendingIntent intention = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_INTENTION);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_root, intention);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_disc, intention);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_cta, intention);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_title, intention);
        views.setOnClickPendingIntent(R.id.widget_companion_compass_intention, intention);
        return views;
    }

    /**
     * Companion Beacon — Visa mer → capacity note overlay.
     */
    public static RemoteViews companionBeacon(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_beacon);
        String dynamic = liveText(context, "last_action_beacon", 24);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_beacon_state, dynamic);
        }
        views.setProgressBar(R.id.widget_companion_beacon_capacity_bar, 100, 72, false);
        views.setProgressBar(R.id.widget_companion_beacon_energy_bar, 100, 72, false);
        views.setProgressBar(R.id.widget_companion_beacon_fokus_bar, 100, 65, false);
        views.setProgressBar(R.id.widget_companion_beacon_rest_bar, 100, 58, false);
        PendingIntent beacon = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_BEACON);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_root, beacon);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_ring, beacon);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_cta, beacon);
        views.setOnClickPendingIntent(R.id.widget_companion_beacon_title, beacon);
        return views;
    }

    /**
     * Companion Inbox — text → overlay; voice → capture overlay; photo/link secondary legacy.
     */
    public static RemoteViews companionInbox(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_inbox);
        String dynamic = liveText(context, "last_action_inbox", 40);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_inbox_sub, dynamic);
        }
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_text,
            WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_INBOX_TEXT)
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_voice,
            WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_CAPTURE)
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_photo,
            WidgetInteract.legacyAppPendingIntent(context, "/widget/companion-inbox?photo=1")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_link,
            WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_INBOX_TEXT)
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_inbox_root,
            WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_INBOX_TEXT)
        );
        return views;
    }

    /**
     * Companion Tasks — row taps toggle done in-place; Visa alla expands state (no full app).
     */
    public static RemoteViews companionTasks(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_tasks);
        applyTaskRow(context, views, 0, R.id.widget_companion_tasks_row1,
            R.string.widget_companion_tasks_row1, R.string.widget_companion_tasks_row1_done);
        applyTaskRow(context, views, 1, R.id.widget_companion_tasks_row2,
            R.string.widget_companion_tasks_row2, R.string.widget_companion_tasks_row2_done);
        applyTaskRow(context, views, 2, R.id.widget_companion_tasks_row3,
            R.string.widget_companion_tasks_row3, R.string.widget_companion_tasks_row3_done);
        views.setOnClickPendingIntent(
            R.id.widget_companion_tasks_all,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_TASKS_EXPAND, "")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_tasks_title,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_TASKS_EXPAND, "")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_tasks_root,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_TASKS_EXPAND, "")
        );
        return views;
    }

    private static void applyTaskRow(
        Context context,
        RemoteViews views,
        int index,
        int rowId,
        int openRes,
        int doneRes
    ) {
        boolean done = WidgetActionReceiver.isTaskDone(context, index);
        views.setTextViewText(rowId, context.getString(done ? doneRes : openRes));
        views.setOnClickPendingIntent(
            rowId,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_TASK_TOGGLE, String.valueOf(index))
        );
    }

    /**
     * Companion Journal — Skriv → overlay draft (no full app).
     */
    public static RemoteViews companionJournal(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_journal);
        
        // Våg 95: Mask sensitive content if Vault is locked
        boolean locked = SecurePrefs.get(context).getBoolean("sacred_lock_state", false);
        
        if (locked) {
            views.setTextViewText(R.id.widget_companion_journal_quote, "Journalen är låst");
            views.setTextViewText(R.id.widget_companion_journal_attr, "Lås upp för att läsa");
        } else {
            String dynamic = liveText(context, "last_action_journal", 80);
            if (dynamic != null) {
                views.setTextViewText(R.id.widget_companion_journal_quote, dynamic);
            }
        }

        PendingIntent write = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_JOURNAL);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_write, write);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_root, write);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_quote, write);
        views.setOnClickPendingIntent(R.id.widget_companion_journal_title, write);
        return views;
    }

    /**
     * Companion Harbor — mode pills in-place via broadcast.
     */
    public static RemoteViews companionHarbor(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_harbor);
        String dynamic = liveText(context, "last_action_harbor", 60);
        if (dynamic != null) {
            views.setTextViewText(R.id.widget_companion_harbor_affirm, dynamic);
        }
        
        // Bind all 4 harbor modes
        views.setOnClickPendingIntent(
            R.id.widget_companion_harbor_breath,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_HARBOR_MODE, "breath")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_harbor_focus,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_HARBOR_MODE, "focus")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_harbor_thanks,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_HARBOR_MODE, "thanks")
        );
        views.setOnClickPendingIntent(
            R.id.widget_companion_harbor_sleep,
            WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_HARBOR_MODE, "sleep")
        );
        
        PendingIntent breath = WidgetInteract.broadcastPendingIntent(
            context, WidgetInteract.ACT_HARBOR_MODE, WidgetActionReceiver.harborMode(context)
        );
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_root, breath);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_lotus, breath);
        views.setOnClickPendingIntent(R.id.widget_companion_harbor_title, breath);
        return views;
    }

    /**
     * Companion Anchor — Klar → mood check-in overlay; also supports done broadcast.
     */
    public static RemoteViews companionAnchor(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_anchor);
        PendingIntent mood = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_MOOD);
        PendingIntent done = WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_ANCHOR_DONE, "");
        if (WidgetActionReceiver.isAnchorDone(context)) {
            views.setTextViewText(R.id.widget_companion_anchor_done, "✓ Klar");
        }
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_done, done);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_root, mood);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_icon, mood);
        views.setOnClickPendingIntent(R.id.widget_companion_anchor_title, mood);
        return views;
    }

    /**
     * Companion Child — Svara → overlay (Barnfokus additive, no full app).
     */
    public static RemoteViews companionChild(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_child);
        
        // Våg 98: Mask sensitive child focus if Vault is locked
        boolean locked = SecurePrefs.get(context).getBoolean("sacred_lock_state", false);
        
        if (locked) {
            views.setTextViewText(R.id.widget_companion_child_question, "Barnfokus är dolt");
        } else {
            String dynamic = liveText(context, "last_action_child", 90);
            if (dynamic != null) {
                views.setTextViewText(R.id.widget_companion_child_question, dynamic);
            }
        }

        PendingIntent answer = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_CHILD);
        views.setOnClickPendingIntent(R.id.widget_companion_child_root, answer);
        views.setOnClickPendingIntent(R.id.widget_companion_child_answer, answer);
        views.setOnClickPendingIntent(R.id.widget_companion_child_question, answer);
        views.setOnClickPendingIntent(R.id.widget_companion_child_title, answer);
        return views;
    }

    /**
     * Companion Check-in — Emoji targets + Save overlay.
     */
    public static RemoteViews companionCheckIn(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_companion_checkin);
        
        // Våg 96: Highlight selected mood in-place
        String selectedMood = SecurePrefs.get(context).getString("widget_state_mood", "5");
        applyMoodHighlight(views, selectedMood);
        
        PendingIntent save = WidgetInteract.overlayPendingIntent(context, WidgetInteract.MODE_MOOD);
        views.setOnClickPendingIntent(R.id.widget_companion_checkin_root, save);
        views.setOnClickPendingIntent(R.id.widget_companion_checkin_save, save);
        views.setOnClickPendingIntent(R.id.widget_companion_checkin_note, save);
        
        views.setOnClickPendingIntent(R.id.widget_mood_1, WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_MOOD_CHECK, "1"));
        views.setOnClickPendingIntent(R.id.widget_mood_2, WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_MOOD_CHECK, "2"));
        views.setOnClickPendingIntent(R.id.widget_mood_3, WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_MOOD_CHECK, "3"));
        views.setOnClickPendingIntent(R.id.widget_mood_4, WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_MOOD_CHECK, "4"));
        views.setOnClickPendingIntent(R.id.widget_mood_5, WidgetInteract.broadcastPendingIntent(context, WidgetInteract.ACT_MOOD_CHECK, "5"));

        return views;
    }

    private static void applyMoodHighlight(RemoteViews views, String mood) {
        float dim = 0.4f;
        float on = 1f;
        views.setFloat(R.id.widget_mood_1, "setAlpha", "1".equals(mood) ? on : dim);
        views.setFloat(R.id.widget_mood_2, "setAlpha", "2".equals(mood) ? on : dim);
        views.setFloat(R.id.widget_mood_3, "setAlpha", "3".equals(mood) ? on : dim);
        views.setFloat(R.id.widget_mood_4, "setAlpha", "4".equals(mood) ? on : dim);
        views.setFloat(R.id.widget_mood_5, "setAlpha", "5".equals(mood) ? on : dim);
        
        // Also update background ring for 5 if selected (matches design default)
        views.setInt(R.id.widget_mood_5, "setBackgroundResource", 
            "5".equals(mood) ? R.drawable.widget_bg_gold_ring : R.drawable.widget_bg_pill_category);
    }
}
