package com.livskompassen.app.core;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * THE ZONE GUARD - Våg 28.
 * Detects "Safe Zones" based on network environmental factors.
 */
public class ZoneManager {
    private static final String PREF_SAFE_WIFI_SSID = "safe_wifi_ssid";
    private final Context context;

    public ZoneManager(Context context) {
        this.context = context;
    }

    /**
     * Kontrollerar om det nuvarande nätverket anses vara en 'Safe Zone'.
     */
    public boolean isInsideSafeZone() {
        String currentSsid = getCurrentWifiSSID();
        String safeSsid = SecurePrefs.get(context).getString(PREF_SAFE_WIFI_SSID, null);
        
        return currentSsid != null && currentSsid.equals(safeSsid);
    }

    private String getCurrentWifiSSID() {
        try {
            WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            if (wifiManager != null) {
                WifiInfo info = wifiManager.getConnectionInfo();
                if (info != null) {
                    return info.getSSID();
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    public void setAsSafeZone() {
        String ssid = getCurrentWifiSSID();
        if (ssid != null && !ssid.equals("<unknown ssid>")) {
            SecurePrefs.get(context).edit().putString(PREF_SAFE_WIFI_SSID, ssid).apply();
            LCLog.d("ZoneManager: Current Wi-Fi marked as Safe Zone.");
        }
    }
}
