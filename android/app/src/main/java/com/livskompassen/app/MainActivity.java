package com.livskompassen.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.widgets.WidgetLaunch;

/**
 * Capacitor shell + native Android widgets (WH1–WH6).
 * Queues widget deep-links until WebView + React bridge can consume them.
 */
public class MainActivity extends BridgeActivity {

    private static final int WIDGET_DISPATCH_MAX_ATTEMPTS = 40;
    private static final long WIDGET_DISPATCH_RETRY_MS = 150L;

    private String pendingWidgetPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Zero Footprint / Layered Defense: block screenshots, screen recording
        // and hide app content in the recent-apps overview (sensitive custody,
        // journal and evidence data). Applies app-wide to the single Activity.
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );
        captureWidgetPath(getIntent());
        dispatchPendingWidgetPath();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        captureWidgetPath(intent);
        dispatchPendingWidgetPath();
    }

    @Override
    public void onResume() {
        super.onResume();
        dispatchPendingWidgetPath();
    }

    private void captureWidgetPath(Intent intent) {
        if (intent == null) {
            return;
        }
        String path = intent.getStringExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
        if (path == null || path.isEmpty()) {
            return;
        }
        pendingWidgetPath = path;
        intent.removeExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
    }

    private void dispatchPendingWidgetPath() {
        if (pendingWidgetPath == null || pendingWidgetPath.isEmpty()) {
            return;
        }
        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }
        attemptWidgetDispatch(getBridge().getWebView(), pendingWidgetPath, 0);
    }

    private void attemptWidgetDispatch(WebView webView, String path, int attempt) {
        webView.post(() -> {
            if (pendingWidgetPath == null || !path.equals(pendingWidgetPath)) {
                return;
            }

            String safe = path.replace("\\", "\\\\").replace("'", "\\'");
            String js =
                "(function(){"
                    + "if(document.readyState!=='complete'){return 'loading';}"
                    + "window.__LIVSKOMPASSEN_WIDGET_PENDING__='"
                    + safe
                    + "';"
                    + "window.dispatchEvent(new CustomEvent('livskompassen-widget-nav',{detail:{path:'"
                    + safe
                    + "'}}));"
                    + "return 'ok';"
                    + "})();";

            webView.evaluateJavascript(
                js,
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (pendingWidgetPath == null || !path.equals(pendingWidgetPath)) {
                            return;
                        }
                        if ("\"ok\"".equals(value)) {
                            pendingWidgetPath = null;
                            return;
                        }
                        if (attempt + 1 >= WIDGET_DISPATCH_MAX_ATTEMPTS) {
                            return;
                        }
                        webView.postDelayed(
                            () -> attemptWidgetDispatch(webView, path, attempt + 1),
                            WIDGET_DISPATCH_RETRY_MS
                        );
                    }
                }
            );
        });
    }
}
