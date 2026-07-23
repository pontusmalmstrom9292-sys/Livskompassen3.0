package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.livskompassen.app.MainActivity;
import com.livskompassen.app.util.LCLog;

/**
 * THE GHOST LAUNCHER - Våg 290.
 * Dialer secret code *#*#1234#*#* opens the app directly into Ghost Mode facade.
 * Exit remains locked: 3s long-press on ghost_title (GHOST_EXIT_HOLD_MS) + biometric.
 */
public class GhostLaunchReceiver extends BroadcastReceiver {
    /** Extra consumed by MainActivity to enter Ghost Mode without StealthActivity alias. */
    public static final String EXTRA_GHOST_ENTRY = "ghost_entry";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getData() == null) return;
        
        String host = intent.getData().getHost();
        if ("1234".equals(host)) {
            LCLog.w("GhostLaunch: Secret code detected. Launching Ghost Mode.");
            Intent launch = new Intent(context, MainActivity.class);
            launch.putExtra(EXTRA_GHOST_ENTRY, true);
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(launch);
        }
    }
}
