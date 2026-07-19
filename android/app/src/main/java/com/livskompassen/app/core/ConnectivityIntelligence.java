package com.livskompassen.app.core;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.os.Build;
import com.livskompassen.app.util.LCLog;

/**
 * CONNECTIVITY INTELLIGENCE - Våg 34.
 * Optimizes network usage based on connection type (Wi-Fi vs Metered).
 */
public class ConnectivityIntelligence {
    private final ConnectivityManager cm;

    public ConnectivityIntelligence(Context context) {
        this.cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    /**
     * Kontrollerar om anslutningen är 'Metered' (t.ex. mobildata).
     */
    public boolean isMetered() {
        if (cm == null) return false;
        return cm.isActiveNetworkMetered();
    }

    /**
     * Kontrollerar om vi är på Roaming (utomlands).
     */
    public boolean isRoaming() {
        if (cm == null) return false;
        android.net.Network network = cm.getActiveNetwork();
        NetworkCapabilities caps = cm.getNetworkCapabilities(network);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            return caps != null && !caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_ROAMING);
        }
        return false;
    }

    public boolean shouldRestrictData() {
        return isMetered() || isRoaming();
    }

    public void logNetworkStatus() {
        LCLog.d("Connectivity: Metered=" + isMetered() + ", Roaming=" + isRoaming());
    }
}
