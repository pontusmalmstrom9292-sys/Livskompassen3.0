package com.livskompassen.app.widgets;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

import androidx.core.app.NotificationCompat;

import com.livskompassen.app.R;
import com.livskompassen.app.core.WidgetUpdateManager;
import com.livskompassen.app.util.SecurePrefs;

import java.io.File;
import java.io.IOException;

/**
 * @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET*.md
 *
 * Background capture for Companion Hemlig inspelning.
 * Continues while screen is locked or user leaves overlay — until STOP.
 * Lives in widgets/ (not Sacred core).
 */
public class WidgetCaptureService extends Service {

    public static final String ACTION_START = "com.livskompassen.app.action.CAPTURE_START";
    public static final String ACTION_STOP = "com.livskompassen.app.action.CAPTURE_STOP";
    public static final String ACTION_CANCEL = "com.livskompassen.app.action.CAPTURE_CANCEL";

    public static final String PREF_RECORDING = "widget_state_capture_recording";
    private static final String CHANNEL_ID = "widget_capture_bg";
    private static final int NOTIF_ID = 4410;

    private static volatile boolean recordingStatic;

    private MediaRecorder recorder;
    private File recordFile;
    private PowerManager.WakeLock wakeLock;

    public static boolean isRecording() {
        return recordingStatic;
    }

    public static void start(Context context) {
        Intent i = new Intent(context, WidgetCaptureService.class);
        i.setAction(ACTION_START);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(i);
        } else {
            context.startService(i);
        }
    }

    public static void stop(Context context, boolean save) {
        Intent i = new Intent(context, WidgetCaptureService.class);
        i.setAction(save ? ACTION_STOP : ACTION_CANCEL);
        context.startService(i);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            return START_STICKY;
        }
        String action = intent.getAction();
        if (ACTION_STOP.equals(action)) {
            finishRecording(true);
            return START_NOT_STICKY;
        }
        if (ACTION_CANCEL.equals(action)) {
            finishRecording(false);
            return START_NOT_STICKY;
        }
        if (ACTION_START.equals(action)) {
            if (recordingStatic) {
                return START_STICKY;
            }
            ensureChannel();
            Notification notification = buildNotification();
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIF_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
            } else {
                startForeground(NOTIF_ID, notification);
            }
            if (!beginRecording()) {
                stopForeground(true);
                stopSelf();
                return START_NOT_STICKY;
            }
            return START_STICKY;
        }
        return START_NOT_STICKY;
    }

    private boolean beginRecording() {
        try {
            File dir = new File(getCacheDir(), "widget_capture");
            if (!dir.exists() && !dir.mkdirs()) {
                WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Kunde inte spara");
                return false;
            }
            recordFile = new File(dir, "capture_" + System.currentTimeMillis() + ".m4a");
            recorder = new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            recorder.setAudioEncodingBitRate(128000);
            recorder.setAudioSamplingRate(44100);
            recorder.setOutputFile(recordFile.getAbsolutePath());
            recorder.prepare();
            recorder.start();
            recordingStatic = true;
            SecurePrefs.get(this).edit().putBoolean(PREF_RECORDING, true).apply();
            acquireWakeLock();
            WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Spelar in… (bakgrund)");
            refreshCaptureWidget();
            return true;
        } catch (IOException | RuntimeException e) {
            recordingStatic = false;
            releaseRecorder();
            SecurePrefs.get(this).edit().putBoolean(PREF_RECORDING, false).apply();
            WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Inspelning misslyckades");
            return false;
        }
    }

    private void finishRecording(boolean save) {
        releaseWakeLock();
        releaseRecorder();
        recordingStatic = false;
        SecurePrefs.get(this).edit().putBoolean(PREF_RECORDING, false).apply();

        if (save && recordFile != null && recordFile.exists() && recordFile.length() > 0) {
            try {
                WidgetCaptureStore.Entry entry = WidgetCaptureStore.storePlainRecording(this, recordFile);
                WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Sparad säkert · tryck Senaste");
                notifySaved(entry);
            } catch (Exception e) {
                // Fallback: keep plaintext path in queue if encrypt fails
                enqueueCaptureFile(recordFile.getAbsolutePath());
                WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Inspelning sparad lokalt");
            }
        } else {
            if (recordFile != null && recordFile.exists()) {
                //noinspection ResultOfMethodCallIgnored
                recordFile.delete();
            }
            WidgetUpdateManager.updateWidgetContent(this, "last_action_capture", "Avbruten");
        }
        refreshCaptureWidget();
        stopForeground(true);
        stopSelf();
    }

    private void notifySaved(WidgetCaptureStore.Entry entry) {
        ensureChannel();
        PendingIntent downloadPi = PendingIntent.getBroadcast(
            this,
            4421,
            new Intent(this, WidgetActionReceiver.class)
                .setAction(WidgetInteract.ACTION_WIDGET)
                .putExtra(WidgetInteract.EXTRA_ACTION, WidgetInteract.ACT_CAPTURE_DOWNLOAD)
                .putExtra(WidgetInteract.EXTRA_PARAM, entry.id)
                .setData(android.net.Uri.parse("livskompassen://widget-action/capture.download/" + entry.id)),
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        PendingIntent sharePi = PendingIntent.getBroadcast(
            this,
            4422,
            new Intent(this, WidgetActionReceiver.class)
                .setAction(WidgetInteract.ACTION_WIDGET)
                .putExtra(WidgetInteract.EXTRA_ACTION, WidgetInteract.ACT_CAPTURE_SHARE)
                .putExtra(WidgetInteract.EXTRA_PARAM, entry.id)
                .setData(android.net.Uri.parse("livskompassen://widget-action/capture.share/" + entry.id)),
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        Notification n = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.widget_capture_saved_title))
            .setContentText(getString(R.string.widget_capture_saved_text))
            .setSmallIcon(R.drawable.ic_lock_sacred)
            .setAutoCancel(true)
            .setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .addAction(0, getString(R.string.widget_capture_download), downloadPi)
            .addAction(0, getString(R.string.widget_capture_share), sharePi)
            .build();
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm != null) {
            nm.notify(NOTIF_ID + 1, n);
        }
    }

    private void releaseRecorder() {
        if (recorder != null) {
            try {
                recorder.stop();
            } catch (RuntimeException ignored) {
            }
            try {
                recorder.release();
            } catch (RuntimeException ignored) {
            }
            recorder = null;
        }
    }

    private void enqueueCaptureFile(String path) {
        SharedPreferences prefs = SecurePrefs.get(this);
        String queue = prefs.getString("widget_queue_capture", "");
        String entry = path + "|" + System.currentTimeMillis();
        String next = queue.isEmpty() ? entry : queue + "\n" + entry;
        prefs.edit()
            .putString("widget_queue_capture", next)
            .putString("widget_draft_capture_path", path)
            .apply();
    }

    private void acquireWakeLock() {
        try {
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (pm == null) return;
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "livskompassen:widget_capture");
            wakeLock.setReferenceCounted(false);
            wakeLock.acquire(60 * 60 * 1000L); // max 60 min safety
        } catch (RuntimeException ignored) {
        }
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (RuntimeException ignored) {
            }
        }
        wakeLock = null;
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm == null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            getString(R.string.widget_capture_channel_name),
            NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription(getString(R.string.widget_capture_channel_desc));
        channel.setShowBadge(false);
        channel.enableVibration(false);
        channel.setSound(null, null);
        nm.createNotificationChannel(channel);
    }

    private Notification buildNotification() {
        PendingIntent stopPi = PendingIntent.getService(
            this,
            4420,
            new Intent(this, WidgetCaptureService.class).setAction(ACTION_STOP),
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.widget_capture_notif_title))
            .setContentText(getString(R.string.widget_capture_notif_text))
            .setSmallIcon(R.drawable.ic_lock_sacred)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .addAction(0, getString(R.string.widget_capture_notif_stop), stopPi)
            .setContentIntent(stopPi)
            .build();
    }

    private void refreshCaptureWidget() {
        android.appwidget.AppWidgetManager manager =
            android.appwidget.AppWidgetManager.getInstance(this);
        android.content.ComponentName name =
            new android.content.ComponentName(this, CompanionCaptureWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(name);
        if (ids == null || ids.length == 0) return;
        Intent intent = new Intent(this, CompanionCaptureWidgetProvider.class);
        intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        sendBroadcast(intent);
    }

    @Override
    public void onDestroy() {
        if (recordingStatic) {
            finishRecording(true);
        } else {
            releaseWakeLock();
            releaseRecorder();
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
