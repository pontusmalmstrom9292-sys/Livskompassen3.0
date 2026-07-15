package com.livskompassen.app;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;

import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.widgets.WidgetLaunch;

/**
 * Capacitor shell + native Android widgets (WH1–WH6).
 * Widget-tap laddar /widget/* direkt i WebView — inte hela appens hem först.
 */
public class MainActivity extends BridgeActivity {

    private static final String TAG = "Livskompassen";
    private static final int WIDGET_DISPATCH_MAX_ATTEMPTS = 40;
    private static final long WIDGET_DISPATCH_RETRY_MS = 150L;

    private String pendingWidgetPath;
    private boolean widgetUrlLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "MainActivity onCreate");

        // Edge-to-edge support
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(false); // Ljusa ikoner på mörk bakgrund
        controller.setAppearanceLightNavigationBars(false);
        
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
        Log.d(TAG, "MainActivity onNewIntent");
        widgetUrlLoaded = false;
        captureWidgetPath(intent);
        dispatchPendingWidgetPath();
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "MainActivity onResume");
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
        Log.d(TAG, "Captured widget path: " + path);
        pendingWidgetPath = path;
        intent.removeExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
    }

    private void dispatchPendingWidgetPath() {
        if (pendingWidgetPath == null || pendingWidgetPath.isEmpty()) {
            return;
        }
        if (getBridge() == null || getBridge().getWebView() == null) {
            Log.w(TAG, "Bridge or WebView not ready for dispatch");
            return;
        }

        WebView webView = getBridge().getWebView();
        if (!widgetUrlLoaded) {
            widgetUrlLoaded = true;
            String serverUrl = getBridge().getServerUrl();
            if (serverUrl == null) {
                Log.e(TAG, "serverUrl is null, cannot dispatch widget");
                return;
            }
            if (serverUrl.endsWith("/")) {
                serverUrl = serverUrl.substring(0, serverUrl.length() - 1);
            }
            
            String targetUrl = serverUrl + pendingWidgetPath;
            String currentUrl = webView.getUrl();
            
            if (currentUrl == null || !currentUrl.equals(targetUrl)) {
                Log.d(TAG, "Loading URL for widget: " + targetUrl);
                webView.loadUrl(targetUrl);
            } else {
                Log.d(TAG, "WebView already at " + targetUrl + ", skipping loadUrl");
            }
        }

        attemptWidgetDispatch(webView, pendingWidgetPath, 0);
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
                            Log.d(TAG, "Widget dispatch successful: " + path);
                            pendingWidgetPath = null;
                            return;
                        }
                        if (attempt + 1 >= WIDGET_DISPATCH_MAX_ATTEMPTS) {
                            Log.w(TAG, "Widget dispatch timed out after " + WIDGET_DISPATCH_MAX_ATTEMPTS + " attempts");
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
