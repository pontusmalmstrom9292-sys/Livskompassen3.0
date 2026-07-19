package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Handles interactive button clicks from notifications.
 */
public class NotificationActionReceiver extends BroadcastReceiver {
    public static final String ACTION_VAULT_LOCK = "com.livskompassen.app.ACTION_VAULT_LOCK";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        LCLog.d("NotificationActionReceiver: Received action: " + action);

        if (ACTION_VAULT_LOCK.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Valvet säkrat");
        }
    }
}
