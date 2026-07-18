package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.livskompassen.app.MainActivity;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Handles interactive button clicks from notifications.
 */
public class NotificationActionReceiver extends BroadcastReceiver {
    public static final String ACTION_VAULT_LOCK = "com.livskompassen.app.ACTION_VAULT_LOCK";
    public static final String ACTION_QUICK_CHECKIN = "com.livskompassen.app.ACTION_QUICK_CHECKIN";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        LCLog.d("NotificationActionReceiver: Received action: " + action);

        if (ACTION_VAULT_LOCK.equals(action)) {
            WidgetUpdateManager.updateWidgetContent(context, "last_action", "Valvet säkrat");
        } else if (ACTION_QUICK_CHECKIN.equals(action)) {
            Intent launchIntent = new Intent(context, MainActivity.class);
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launchIntent.putExtra("widget_path", "/widget/kompass");
            context.startActivity(launchIntent);
        }
    }
}
