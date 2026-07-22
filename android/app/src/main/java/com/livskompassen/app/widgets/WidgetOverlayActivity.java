package com.livskompassen.app.widgets;

import android.Manifest;
import android.app.Activity;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;
import com.livskompassen.app.util.SecurePrefs;

/**
 * @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET*.md
 *
 * Translucent widget surface — text / mood / intention / tap-to-record.
 * Capture uses {@link WidgetCaptureService} so recording continues with screen locked.
 * No Capacitor chrome, dock, or nav.
 */
public class WidgetOverlayActivity extends Activity {

    private static final int REQ_MIC = 4401;

    private String mode = WidgetInteract.MODE_NOTE;
    private EditText input;
    private TextView status;
    private TextView title;
    private View captureHold;
    private TextView captureHoldLabel;
    private LinearLayout moodRow;
    private LinearLayout formColumn;
    private LinearLayout libraryPanel;
    private TextView libraryName;
    private String selectedMood = "3";
    private String libraryCaptureId;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_widget_overlay);

        if (getIntent() != null && getIntent().getStringExtra(WidgetInteract.EXTRA_MODE) != null) {
            mode = getIntent().getStringExtra(WidgetInteract.EXTRA_MODE);
        }

        title = findViewById(R.id.widget_overlay_title);
        status = findViewById(R.id.widget_overlay_status);
        input = findViewById(R.id.widget_overlay_input);
        captureHold = findViewById(R.id.widget_overlay_capture_hold);
        captureHoldLabel = findViewById(R.id.widget_overlay_capture_hold_label);
        moodRow = findViewById(R.id.widget_overlay_mood_row);
        formColumn = findViewById(R.id.widget_overlay_form);
        libraryPanel = findViewById(R.id.widget_overlay_library);
        libraryName = findViewById(R.id.widget_overlay_library_name);
        ImageButton close = findViewById(R.id.widget_overlay_close);
        TextView save = findViewById(R.id.widget_overlay_save);

        close.setOnClickListener(v -> finish());
        findViewById(R.id.widget_overlay_scrim).setOnClickListener(v -> finish());
        save.setOnClickListener(v -> onSave());
        findViewById(R.id.widget_overlay_library_download).setOnClickListener(v ->
            WidgetCaptureStore.downloadToDownloads(this, libraryCaptureId));
        findViewById(R.id.widget_overlay_library_share).setOnClickListener(v ->
            WidgetCaptureStore.shareToDevice(this, libraryCaptureId));

        bindMoodButtons();
        applyModeUi();
        setupCaptureTap();

        if (WidgetInteract.MODE_CAPTURE.equals(mode)) {
            if (WidgetCaptureService.isRecording()) {
                status.setText(R.string.widget_overlay_capture_recording);
                updateCaptureButtonLabel(true);
            } else {
                handler.post(this::startBackgroundCapture);
            }
        }
    }

    private void applyModeUi() {
        moodRow.setVisibility(View.GONE);
        captureHold.setVisibility(View.GONE);
        formColumn.setVisibility(View.VISIBLE);
        libraryPanel.setVisibility(View.GONE);
        input.setVisibility(View.VISIBLE);
        findViewById(R.id.widget_overlay_save).setVisibility(View.VISIBLE);

        switch (mode) {
            case WidgetInteract.MODE_CAPTURE:
                title.setText(R.string.widget_overlay_capture_title);
                status.setText(R.string.widget_overlay_capture_hint);
                formColumn.setVisibility(View.GONE);
                captureHold.setVisibility(View.VISIBLE);
                findViewById(R.id.widget_overlay_save).setVisibility(View.GONE);
                break;
            case WidgetInteract.MODE_CAPTURE_LIBRARY:
                title.setText(R.string.widget_overlay_library_title);
                status.setText(R.string.widget_overlay_library_hint);
                formColumn.setVisibility(View.GONE);
                findViewById(R.id.widget_overlay_save).setVisibility(View.GONE);
                libraryPanel.setVisibility(View.VISIBLE);
                bindLibrary();
                break;
            case WidgetInteract.MODE_NOTE:
                title.setText(R.string.widget_overlay_note_title);
                status.setText(R.string.widget_overlay_note_hint);
                input.setHint(R.string.widget_companion_note_compose);
                break;
            case WidgetInteract.MODE_MOOD:
                title.setText(R.string.widget_overlay_mood_title);
                status.setText(R.string.widget_overlay_mood_hint);
                moodRow.setVisibility(View.VISIBLE);
                input.setHint(R.string.widget_overlay_mood_note_hint);
                break;
            case WidgetInteract.MODE_INTENTION:
                title.setText(R.string.widget_overlay_intention_title);
                status.setText(R.string.widget_overlay_intention_hint);
                input.setHint(R.string.widget_overlay_intention_hint);
                break;
            case WidgetInteract.MODE_JOURNAL:
                title.setText(R.string.widget_overlay_journal_title);
                status.setText(R.string.widget_overlay_journal_hint);
                input.setHint(R.string.widget_overlay_journal_hint);
                break;
            case WidgetInteract.MODE_INBOX_TEXT:
                title.setText(R.string.widget_overlay_inbox_title);
                status.setText(R.string.widget_overlay_inbox_hint);
                input.setHint(R.string.widget_overlay_inbox_hint);
                break;
            case WidgetInteract.MODE_CHILD:
                title.setText(R.string.widget_overlay_child_title);
                status.setText(R.string.widget_overlay_child_hint);
                input.setHint(R.string.widget_overlay_child_hint);
                break;
            case WidgetInteract.MODE_BEACON:
                title.setText(R.string.widget_overlay_beacon_title);
                status.setText(R.string.widget_overlay_beacon_hint);
                input.setHint(R.string.widget_overlay_beacon_hint);
                break;
            default:
                title.setText(R.string.widget_overlay_note_title);
                break;
        }
    }

    private void bindMoodButtons() {
        int[] ids = {
            R.id.widget_overlay_mood_1,
            R.id.widget_overlay_mood_2,
            R.id.widget_overlay_mood_3,
            R.id.widget_overlay_mood_4,
            R.id.widget_overlay_mood_5
        };
        for (int i = 0; i < ids.length; i++) {
            final int index = i;
            final String mood = String.valueOf(i + 1);
            TextView btn = findViewById(ids[i]);
            btn.setOnClickListener(v -> {
                selectedMood = mood;
                status.setText(getString(R.string.widget_overlay_mood_selected, mood));
                highlightMood(ids, index);
            });
        }
    }

    private void highlightMood(int[] ids, int selectedIndex) {
        for (int i = 0; i < ids.length; i++) {
            TextView btn = findViewById(ids[i]);
            btn.setAlpha(i == selectedIndex ? 1f : 0.45f);
        }
    }

    private void setupCaptureTap() {
        captureHold.setOnClickListener(v -> {
            if (WidgetCaptureService.isRecording()) {
                WidgetCaptureService.stop(this, true);
                status.setText(R.string.widget_overlay_capture_saved);
                updateCaptureButtonLabel(false);
                Toast.makeText(this, R.string.widget_overlay_capture_saved, Toast.LENGTH_SHORT).show();
                finish();
            } else {
                startBackgroundCapture();
            }
        });
    }

    private void bindLibrary() {
        WidgetCaptureStore.Entry latest = WidgetCaptureStore.latest(this);
        if (latest == null) {
            libraryCaptureId = null;
            libraryName.setText(R.string.widget_overlay_library_empty);
            findViewById(R.id.widget_overlay_library_download).setEnabled(false);
            findViewById(R.id.widget_overlay_library_share).setEnabled(false);
            return;
        }
        libraryCaptureId = latest.id;
        libraryName.setText(latest.displayName + "\n"
            + (latest.sizeBytes / 1024) + " KB · krypterad på enheten");
        findViewById(R.id.widget_overlay_library_download).setEnabled(true);
        findViewById(R.id.widget_overlay_library_share).setEnabled(true);
    }

    private void updateCaptureButtonLabel(boolean recording) {
        if (captureHoldLabel == null) return;
        captureHoldLabel.setText(recording
            ? R.string.widget_overlay_capture_stop_label
            : R.string.widget_overlay_capture_start_label);
    }

    /**
     * Start FG service then close overlay — recording continues in background / locked screen.
     */
    private void startBackgroundCapture() {
        if (WidgetCaptureService.isRecording()) {
            updateCaptureButtonLabel(true);
            status.setText(R.string.widget_overlay_capture_recording);
            return;
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
            status.setText(R.string.widget_overlay_capture_need_mic);
            SecurePrefs.get(this).edit()
                .putString("widget_queue_capture_meta", "mic_permission_pending|" + System.currentTimeMillis())
                .apply();
            return;
        }
        WidgetCaptureService.start(this);
        status.setText(R.string.widget_overlay_capture_bg_started);
        updateCaptureButtonLabel(true);
        Toast.makeText(this, R.string.widget_overlay_capture_bg_started, Toast.LENGTH_SHORT).show();
        // Leave overlay so user can lock screen / switch apps; service keeps recording.
        handler.postDelayed(this::finish, 450);
    }

    private void onSave() {
        String text = input.getText() == null ? "" : input.getText().toString().trim();
        SharedPreferences prefs = SecurePrefs.get(this);
        long now = System.currentTimeMillis();

        switch (mode) {
            case WidgetInteract.MODE_NOTE: {
                String cat = WidgetActionReceiver.noteCategory(this);
                prefs.edit()
                    .putString("widget_draft_note", text)
                    .putString("widget_draft_note_category", cat)
                    .putLong("widget_draft_note_at", now)
                    .putString("widget_queue_note", text + "|" + cat + "|" + now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_note",
                    text.isEmpty() ? "Anteckning sparad" : truncate(text, 40));
                break;
            }
            case WidgetInteract.MODE_MOOD: {
                prefs.edit()
                    .putString("widget_draft_mood", selectedMood)
                    .putString("widget_draft_mood_note", text)
                    .putLong("widget_draft_mood_at", now)
                    .putString("widget_queue_mood", selectedMood + "|" + text + "|" + now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_anchor",
                    "Check-in " + selectedMood + "/5");
                break;
            }
            case WidgetInteract.MODE_INTENTION: {
                prefs.edit()
                    .putString("widget_draft_intention", text)
                    .putLong("widget_draft_intention_at", now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_compass",
                    text.isEmpty() ? "Intention sparad" : truncate(text, 48));
                break;
            }
            case WidgetInteract.MODE_JOURNAL: {
                prefs.edit()
                    .putString("widget_draft_journal", text)
                    .putLong("widget_draft_journal_at", now)
                    .putString("widget_queue_journal", text + "|" + now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_journal",
                    text.isEmpty() ? "Dagbok utkast" : truncate(text, 80));
                break;
            }
            case WidgetInteract.MODE_INBOX_TEXT: {
                prefs.edit()
                    .putString("widget_draft_inbox", text)
                    .putLong("widget_draft_inbox_at", now)
                    .putString("widget_queue_inbox", text + "|" + now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_inbox",
                    text.isEmpty() ? "Inkast sparat" : truncate(text, 40));
                break;
            }
            case WidgetInteract.MODE_CHILD: {
                prefs.edit()
                    .putString("widget_draft_child", text)
                    .putLong("widget_draft_child_at", now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_child",
                    text.isEmpty() ? "Svar sparat" : truncate(text, 90));
                break;
            }
            case WidgetInteract.MODE_BEACON: {
                prefs.edit()
                    .putString("widget_draft_beacon", text)
                    .putLong("widget_draft_beacon_at", now)
                    .apply();
                WidgetUpdateManager.updateWidgetContent(this, "last_action_beacon",
                    text.isEmpty() ? "Kapacitet noterad" : truncate(text, 24));
                break;
            }
            default:
                break;
        }
        Toast.makeText(this, R.string.widget_overlay_saved, Toast.LENGTH_SHORT).show();
        finish();
    }

    private static String truncate(String text, int max) {
        if (text.length() <= max) return text;
        return text.substring(0, Math.max(0, max - 1)) + "…";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == REQ_MIC
                && grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            startBackgroundCapture();
        }
    }

    @Override
    protected void onDestroy() {
        // Do NOT stop WidgetCaptureService — recording must survive lock screen / leave overlay.
        super.onDestroy();
    }
}
