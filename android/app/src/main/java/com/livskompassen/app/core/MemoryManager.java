package com.livskompassen.app.core;

import android.content.ComponentCallbacks2;
import android.content.Context;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Proactively manages memory pressure to prevent OS app kills.
 */
public class MemoryManager implements ComponentCallbacks2 {
    private final Context context;
    private final Bridge bridge;

    public MemoryManager(Context context, Bridge bridge) {
        this.context = context;
        this.bridge = bridge;
        context.registerComponentCallbacks(this);
    }

    @Override
    public void onTrimMemory(int level) {
        LCLog.d("MemoryManager: onTrimMemory level " + level);
        
        WebView webView = (bridge != null) ? bridge.getWebView() : null;
        if (webView == null) return;

        // Do NOT sanitize on TRIM_MEMORY_UI_HIDDEN — notification shade / brief leave
        // was clearing WebView history and disrupting the Valv SPA session.
        // SacredLockManager.showLock() already calls sanitizeMemory() on real lock.

        if (level >= TRIM_MEMORY_MODERATE) {
            webView.clearCache(false);
            LCLog.d("MemoryManager: Cleared WebView cache due to moderate pressure.");
        }
        
        if (level >= TRIM_MEMORY_COMPLETE) {
            webView.onPause();
            LCLog.w("MemoryManager: Critical memory pressure! Pausing WebView.");
        }
    }

    /**
     * Tvingar fram en rensning av känsliga objekt i minnet.
     */
    public void sanitizeMemory() {
        LCLog.d("MemoryManager: Sanitizing sensitive memory areas.");
        if (bridge != null && bridge.getWebView() != null) {
            // Vi ber WebView att rensa bort referenser till gamla sidor
            bridge.getWebView().clearHistory();
        }
        // Be systemet köra garbage collection proaktivt
        System.gc();
        System.runFinalization();
    }

    /**
     * Våg 270: High-frequency memory scrubber.
     * Clears string buffers and triggers aggressive GC.
     * WebView ops must run on the UI thread (bridge/@JavascriptInterface is not UI).
     */
    public void scrub() {
        WebView webView = (bridge != null) ? bridge.getWebView() : null;
        if (webView != null) {
            webView.post(() -> {
                try {
                    webView.clearCache(true);
                } catch (Exception e) {
                    LCLog.e("MemoryManager.scrub clearCache failed: " + e.getMessage());
                }
            });
        }
        System.gc();
        System.runFinalization();
        LCLog.d("MemoryManager: Forensic scrub complete.");
    }

    @Override
    public void onConfigurationChanged(android.content.res.Configuration newConfig) {
        // Not used
    }

    @Override
    public void onLowMemory() {
        LCLog.e("MemoryManager: SYSTEM LOW MEMORY. Freeing everything possible.");
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().clearCache(true);
        }
    }

    public void unregister() {
        context.unregisterComponentCallbacks(this);
    }
}
