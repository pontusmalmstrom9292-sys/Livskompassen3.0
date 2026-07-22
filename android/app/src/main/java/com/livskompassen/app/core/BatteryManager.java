package com.livskompassen.app.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.PowerManager;
import com.livskompassen.app.util.LCLog;

/**
 * THE BATTERY GUARDIAN - Våg 19.
 * Adjusts app performance based on battery level and power save mode.
 */
public class BatteryManager {
    private final Context context;
    private final PowerManager powerManager;
    private boolean isPowerSaveMode = false;
    private PowerSaveListener listener;

    public interface PowerSaveListener {
        void onPowerSaveModeChanged(boolean isEnabled);
    }

    public BatteryManager(Context context) {
        this.context = context;
        this.powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        updatePowerSaveStatus();
        registerBatteryReceiver();
    }

    public void setPowerSaveListener(PowerSaveListener listener) {
        this.listener = listener;
    }

    private void registerBatteryReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED);
        filter.addAction(Intent.ACTION_BATTERY_LOW);
        filter.addAction(Intent.ACTION_BATTERY_OKAY);

        context.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                updatePowerSaveStatus();
            }
        }, filter);
    }

    private void updatePowerSaveStatus() {
        if (powerManager != null) {
            boolean currentMode = powerManager.isPowerSaveMode();
            if (currentMode != isPowerSaveMode) {
                isPowerSaveMode = currentMode;
                LCLog.d("BatteryManager: Power Save Mode is " + (isPowerSaveMode ? "ON" : "OFF"));
                if (listener != null) {
                    listener.onPowerSaveModeChanged(isPowerSaveMode);
                }
            }
        }
    }

    public boolean shouldReducePerformance() {
        return isPowerSaveMode;
    }
}
