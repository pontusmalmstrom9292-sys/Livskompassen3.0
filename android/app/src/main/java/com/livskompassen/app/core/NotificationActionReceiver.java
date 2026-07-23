package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * @locked TITANIUM-BASE-CORE
 * Handles interactive button clicks from notifications.
 */
public class NotificationActionReceiver extends BroadcastReceiver {
    public static final String ACTION_VAULT_LOCK = "com.livskompassen.app.ACTION_VAULT_LOCK";
    public static final String ACTION_REMINDER_DONE = "com.livskompassen.app.ACTION_REMINDER_DONE";
    public static final String ACTION_REMINDER_SNOOZE = "com.livskompassen.app.ACTION_REMINDER_SNOOZE";
    public static final String ACTION_CLEAR_CLIPBOARD = "com.livskompassen.app.ACTION_CLEAR_CLIPBOARD";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        LCLog.d("NotificationActionReceiver: Received action: " + action);

        if (ACTION_VAULT_LOCK.equals(action)) {
            secureApp(context);
        } else if (ACTION_REMINDER_DONE.equals(action)) {
            markDone(context);
        } else if (ACTION_REMINDER_SNOOZE.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Snooze 1h");
        } else if (ACTION_CLEAR_CLIPBOARD.equals(action)) {
            clearClipboard(context);
        }
    }

    private void secureApp(Context context) {
        com.livskompassen.app.util.SecurePrefs.get(context).edit().putBoolean("sacred_lock_state", true).apply();
        WidgetUpdateManager.updateWidgetContent(context, "last_action", "Valvet säkrat");
        new HapticManager(context).vaultAlert();
    }

    private void markDone(Context context) {
        WidgetUpdateManager.updateWidgetContent(context, "last_action", "Kort klart via notis");
        android.app.NotificationManager manager = context.getSystemService(android.app.NotificationManager.class);
        if (manager != null) manager.cancel(1002);
        new HapticManager(context).success();
    }

    private void clearClipboard(Context context) {
        android.content.ClipboardManager clipboard = (android.content.ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard != null) {
            clipboard.setPrimaryClip(android.content.ClipData.newPlainText("", ""));
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                clipboard.clearPrimaryClip();
            }
        }
        LCLog.w("NotificationActionReceiver: Clipboard cleared for security.");
        new HapticManager(context).tick(null);
    }
}
