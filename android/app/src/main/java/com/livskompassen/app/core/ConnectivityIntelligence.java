package com.livskompassen.app.core;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import com.livskompassen.app.util.LCLog;

/**
 * CONNECTIVITY INTELLIGENCE - Våg 34.
 * Optimizes network usage based on connection type (Wi-Fi vs Metered).
 */
public class ConnectivityIntelligence {
    private final ConnectivityManager cm;
    private NetworkStatusListener listener;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private Runnable pendingNotify;
    private boolean lastMetered;
    private boolean lastRoaming;
    private boolean hasSnapshot;
    private static final long DEBOUNCE_MS = 3000L;

    public interface NetworkStatusListener {
        void onNetworkChanged(boolean isMetered, boolean isRoaming);
    }

    public ConnectivityIntelligence(Context context) {
        this.cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            cm.registerDefaultNetworkCallback(new ConnectivityManager.NetworkCallback() {
                @Override
                public void onCapabilitiesChanged(android.net.Network network, android.net.NetworkCapabilities caps) {
                    scheduleNotify(isMetered(), isRoaming());
                }

                @Override
                public void onLost(android.net.Network network) {
                    scheduleNotify(false, false);
                }
            });
        }
    }

    private void scheduleNotify(boolean metered, boolean roaming) {
        if (hasSnapshot && metered == lastMetered && roaming == lastRoaming) {
            return;
        }
        if (pendingNotify != null) {
            mainHandler.removeCallbacks(pendingNotify);
        }
        pendingNotify = () -> {
            pendingNotify = null;
            if (hasSnapshot && metered == lastMetered && roaming == lastRoaming) {
                return;
            }
            lastMetered = metered;
            lastRoaming = roaming;
            hasSnapshot = true;
            if (listener != null) {
                listener.onNetworkChanged(metered, roaming);
            }
        };
        mainHandler.postDelayed(pendingNotify, DEBOUNCE_MS);
    }

    public void setNetworkStatusListener(NetworkStatusListener listener) {
        this.listener = listener;
    }

    public boolean isMetered() {
        if (cm == null) return false;
        return cm.isActiveNetworkMetered();
    }

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
