package com.livskompassen.app;

import android.content.Intent;
import android.net.Uri;
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

import java.util.Set;

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
        
        // Capture widget path BEFORE super.onCreate to potentially use it during bridge init
        captureWidgetPath(getIntent());

        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "MainActivity onCreate");

        // Edge-to-edge support
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(false); // Ljusa ikoner på mörk bakgrund
            controller.setAppearanceLightNavigationBars(false);
        }
        
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );
        
        // Secondary capture in case it was missed or updated
        captureWidgetPath(getIntent());
        dispatchPendingWidgetPath();
    }

    @Override
    public void load() {
        if (pendingWidgetPath != null && !pendingWidgetPath.isEmpty() && getBridge() != null) {
            String serverUrl = getBridge().getServerUrl();
            if (serverUrl != null) {
                if (serverUrl.endsWith("/")) {
                    serverUrl = serverUrl.substring(0, serverUrl.length() - 1);
                }
                String targetUrl = serverUrl + pendingWidgetPath;
                Log.d(TAG, "Cold start override: loading widget URL " + targetUrl);
                getBridge().getWebView().loadUrl(targetUrl);
                widgetUrlLoaded = true;
                return;
            }
        }
        super.load();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Log.d(TAG, "MainActivity onNewIntent");
        widgetUrlLoaded = false;
        captureWidgetPath(intent);
        // Force immediate dispatch for onNewIntent (warm start)
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
            // If bridge is not ready, it's a cold start. override load() will handle it.
            Log.d(TAG, "Bridge not ready yet, pendingWidgetPath is stored: " + pendingWidgetPath);
            return;
        }

        WebView webView = getBridge().getWebView();
        if (!widgetUrlLoaded) {
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
            
            if (!isSameRoute(currentUrl, targetUrl)) {
                Log.d(TAG, "Loading URL for widget: " + targetUrl);
                widgetUrlLoaded = true;
                webView.loadUrl(targetUrl);
            } else {
                Log.d(TAG, "WebView already at " + targetUrl + " (or equivalent), skipping loadUrl");
                widgetUrlLoaded = true;
            }
        }

        attemptWidgetDispatch(webView, pendingWidgetPath, 0);
    }

    private boolean isSameRoute(String url1, String url2) {
        if (url1 == null || url2 == null) return url1 == url2;
        if (url1.equals(url2)) return true;
        try {
            Uri uri1 = Uri.parse(url1);
            Uri uri2 = Uri.parse(url2);
            
            if (!safeEquals(uri1.getPath(), uri2.getPath())) return false;
            
            // Compare query parameters regardless of order
            Set<String> params1 = uri1.getQueryParameterNames();
            Set<String> params2 = uri2.getQueryParameterNames();
            if (params1.size() != params2.size()) return false;
            for (String name : params1) {
                if (!safeEquals(uri1.getQueryParameter(name), uri2.getQueryParameter(name))) return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean safeEquals(Object o1, Object o2) {
        return (o1 == null) ? (o2 == null) : o1.equals(o2);
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
