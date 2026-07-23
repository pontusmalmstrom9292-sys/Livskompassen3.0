package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.livskompassen.app.util.LCLog;

import com.livskompassen.app.util.SecurePrefs;

/**
 * THE HARDWARE SENTRY - Våg 195 / Våg 240 (Guardian 2.0).
 * Detects physical hardware changes (Headset, USB, SIM) to protect the device.
 */
public class HardwareAwarenessReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;

        String action = intent.getAction();
        
        // 1. Headset Detection (UX)
        if (Intent.ACTION_HEADSET_PLUG.equals(action)) {
            handleHeadset(context, intent);
        }
        
        // 2. USB Data Connection (Anti-Forensic)
        if ("android.hardware.usb.action.USB_STATE".equals(action)) {
            handleUsbState(context, intent);
        }
        
        // 3. SIM Card Change (Identity Theft)
        if ("android.intent.action.SIM_STATE_CHANGED".equals(action)) {
            handleSimState(context, intent);
        }
    }

    private void handleHeadset(Context context, Intent intent) {
        int state = intent.getIntExtra("state", -1);
        if (state == 1) { // Plugged in
            LCLog.d("HardwareAwareness: Headset detected. Offering Aura Flow.");
            AppNotificationManager.showPremiumNotification(
                context, "Dags att landa?", "Hörlurar anslutna. Starta Aura Flow?", 
                AppNotificationManager.CHANNEL_ID_DAILY, null);
        }
    }

    private void handleUsbState(Context context, Intent intent) {
        boolean connected = intent.getBooleanExtra("connected", false);
        
        if (connected) {
            LCLog.w("HardwareAwareness: USB CONNECTION DETECTED. Triggering security lock.");
            secureApp(context);
        }
    }

    private void handleSimState(Context context, Intent intent) {
        String stateExtra = intent.getStringExtra("ss"); // SIM State
        if ("ABSENT".equals(stateExtra) || "LOCKED".equals(stateExtra)) {
            LCLog.e("HardwareAwareness: SIM REMOVED OR LOCKED. Possible theft detected.");
            secureApp(context);
        }
    }

    private void secureApp(Context context) {
        SecurePrefs.get(context).edit().putBoolean("sacred_lock_state", true).apply();
        WidgetUpdateManager.refreshAllWidgets(context);
    }
}
