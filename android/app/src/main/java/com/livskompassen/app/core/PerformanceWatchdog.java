package com.livskompassen.app.core;

import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Monitors WebView health and ensures UI responsiveness.
 */
public class PerformanceWatchdog {
    private static final long CHECK_INTERVAL_MS = 10000; // 10 sekunder
    private static final int MAX_FAILURE_COUNT = 3; // 3 misslyckade pingar = 30s hängning
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final WebView webView;
    private final Runnable monitorTask;
    private boolean isRunning = false;
    private int failureCount = 0;

    public PerformanceWatchdog(WebView webView) {
        this.webView = webView;
        this.monitorTask = new Runnable() {
            @Override
            public void run() {
                checkWebViewHealth();
                handler.postDelayed(this, CHECK_INTERVAL_MS);
            }
        };
    }

    public void start() {
        if (!isRunning) {
            isRunning = true;
            handler.postDelayed(monitorTask, CHECK_INTERVAL_MS);
            LCLog.d("PerformanceWatchdog started.");
        }
    }

    public void stop() {
        isRunning = false;
        handler.removeCallbacks(monitorTask);
    }

    private void checkWebViewHealth() {
        if (webView == null) return;

        // Vi kör en fjäderlätt JS-ping för att se om WebView-tråden svarar
        webView.evaluateJavascript("(function(){return 'pong';})();", value -> {
            if (value != null && value.contains("pong")) {
                failureCount = 0; // Återställ vid lyckat svar
            } else {
                failureCount++;
                LCLog.w("WebView not responding to watchdog ping. Failure count: " + failureCount);
                
                if (failureCount >= MAX_FAILURE_COUNT) {
                    LCLog.e("CRITICAL: WebView appears to be frozen (no response for " + (failureCount * CHECK_INTERVAL_MS / 1000) + "s).");
                    // I en framtida version kan vi här visa en dialog för att tvinga fram en reload
                }
            }
        });
    }
}
