package com.livskompassen.app.core;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.widgets.WidgetLaunch;
import com.livskompassen.app.widgets.WidgetRouteMatcher;

import java.util.Objects;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Handles navigation intents from home screen widgets and deep links.
 */
public class WidgetNavigator {
    private static final int WIDGET_DISPATCH_MAX_ATTEMPTS = 40;
    private static final long WIDGET_DISPATCH_RETRY_MS = 150L;

    private final Bridge bridge;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final View decorView;

    private String pendingWidgetPath;
    private String lastDispatchedPath;
    private boolean widgetUrlLoaded = false;

    public WidgetNavigator(Bridge bridge, View decorView) {
        this.bridge = bridge;
        this.decorView = decorView;
    }

    public void handleIntent(Intent intent) {
        if (intent == null) return;

        // Reset state for new intent if needed
        widgetUrlLoaded = false;
        lastDispatchedPath = null;

        // Support for standard deep links
        Uri data = intent.getData();
        if (data != null) {
            String path = data.getPath();
            String query = data.getQuery();
            if (path != null) {
                String fullPath = path + (query != null ? "?" + query : "");
                if (!fullPath.isEmpty() && !"/".equals(fullPath)) {
                    LCLog.d("WidgetNavigator: Captured deep link path: " + fullPath);
                    pendingWidgetPath = fullPath;
                    triggerHapticFeedback();
                    dispatchPendingPath();
                    return;
                }
            }
        }

        // Support for widget-specific extras
        String path = intent.getStringExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
        if (path != null && !path.isEmpty()) {
            LCLog.d("WidgetNavigator: Captured widget path: " + path);
            pendingWidgetPath = path;
            intent.removeExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
            triggerHapticFeedback();
            dispatchPendingPath();
        }
    }

    private void triggerHapticFeedback() {
        if (decorView == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            decorView.performHapticFeedback(HapticFeedbackConstants.CONFIRM);
        } else {
            decorView.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
        }
    }

    public void dispatchPendingPath() {
        if (pendingWidgetPath == null || pendingWidgetPath.isEmpty()) return;
        if (Objects.equals(pendingWidgetPath, lastDispatchedPath)) return;
        if (bridge == null || bridge.getWebView() == null) {
            LCLog.d("WidgetNavigator: Bridge not ready, path stored: " + pendingWidgetPath);
            return;
        }

        WebView webView = bridge.getWebView();
        if (!widgetUrlLoaded) {
            String serverUrl = bridge.getServerUrl();
            if (serverUrl == null) return;
            if (serverUrl.endsWith("/")) serverUrl = serverUrl.substring(0, serverUrl.length() - 1);
            
            String targetUrl = serverUrl + pendingWidgetPath;
            if (!WidgetRouteMatcher.isSameRoute(webView.getUrl(), targetUrl)) {
                LCLog.d("WidgetNavigator: Loading URL: " + targetUrl);
                widgetUrlLoaded = true;
                webView.loadUrl(targetUrl);
            } else {
                widgetUrlLoaded = true;
            }
        }

        attemptDispatch(webView, pendingWidgetPath, 0);
    }

    private void attemptDispatch(WebView webView, String path, int attempt) {
        mainHandler.post(() -> {
            if (!Objects.equals(path, pendingWidgetPath)) return;
            if (!webView.isAttachedToWindow()) return;

            String safe = path.replace("\\", "\\\\").replace("'", "\\'");
            String js = "(function(){"
                    + "if(document.readyState!=='complete'){return 'loading';}"
                    + "window.__LIVSKOMPASSEN_WIDGET_PENDING__='" + safe + "';"
                    + "window.dispatchEvent(new CustomEvent('livskompassen-widget-nav',{detail:{path:'" + safe + "'}}));"
                    + "return 'ok';"
                    + "})();";

            webView.evaluateJavascript(js, value -> {
                if (!Objects.equals(path, pendingWidgetPath)) return;
                if ("\"ok\"".equals(value)) {
                    LCLog.d("WidgetNavigator: Dispatch successful: " + path);
                    lastDispatchedPath = path;
                    pendingWidgetPath = null;
                    return;
                }
                
                if (attempt + 1 >= WIDGET_DISPATCH_MAX_ATTEMPTS) {
                    LCLog.w("WidgetNavigator: Timeout for " + path);
                    return;
                }
                
                long delay = WIDGET_DISPATCH_RETRY_MS + (attempt / 5) * 100L;
                mainHandler.postDelayed(() -> attemptDispatch(webView, path, attempt + 1), delay);
            });
        });
    }

    public String getPendingWidgetPath() {
        return pendingWidgetPath;
    }

    public void clearPendingPath() {
        pendingWidgetPath = null;
    }
}
