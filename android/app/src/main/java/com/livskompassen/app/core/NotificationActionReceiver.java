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

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        LCLog.d("NotificationActionReceiver: Received action: " + action);

        if (ACTION_VAULT_LOCK.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Valvet säkrat");
        } else if (ACTION_REMINDER_DONE.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Kort klart via notis");
            // Clear notification
            android.app.NotificationManager manager = context.getSystemService(android.app.NotificationManager.class);
            if (manager != null) manager.cancel(1002);
        } else if (ACTION_REMINDER_SNOOZE.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Snooze 1h");
            // I framtiden: Schemalägg en ny notis om 1h via WorkManager
        }
    }
}
