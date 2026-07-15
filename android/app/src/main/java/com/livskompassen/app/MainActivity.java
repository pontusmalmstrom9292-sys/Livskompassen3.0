package com.livskompassen.app;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AnticipateInterpolator;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.widgets.WidgetLaunch;
import com.livskompassen.app.widgets.WidgetRouteMatcher;

/**
 * Capacitor shell + native Android widgets (WH1–WH6).
 * Widget-tap laddar /widget/* direkt i WebView — inte hela appens hem först.
 */
public class MainActivity extends BridgeActivity {

    private static final String TAG = "Livskompassen";
    private static final int WIDGET_DISPATCH_MAX_ATTEMPTS = 40;
    private static final long WIDGET_DISPATCH_RETRY_MS = 150L;
    private static final int PERMISSIONS_REQUEST_RECORD_AUDIO = 1001;

    private String pendingWidgetPath;
    private boolean widgetUrlLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        
        // Premium Splash Screen Fade-out
        splashScreen.setOnExitAnimationListener(splashScreenView -> {
            final ObjectAnimator fadeOut = ObjectAnimator.ofFloat(
                    splashScreenView.getView(),
                    View.ALPHA,
                    1f,
                    0f
            );
            fadeOut.setInterpolator(new AnticipateInterpolator());
            fadeOut.setDuration(400L);
            fadeOut.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    splashScreenView.remove();
                }
            });
            fadeOut.start();
        });

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
        
        setupWebView();
        dispatchPendingWidgetPath();
    }

    private void setupWebView() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            
            // Performance Tuning
            WebSettings settings = webView.getSettings();
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

            // Audio Permission wrapper
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                            Log.d(TAG, "WebView requesting AUDIO_CAPTURE");
                            request.grant(request.getResources());
                            return;
                        }
                    }
                    super.onPermissionRequest(request);
                }
            });
        }
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
                
                checkNetworkAndNotify();
                
                getBridge().getWebView().loadUrl(targetUrl);
                widgetUrlLoaded = true;
                return;
            }
        }
        super.load();
    }

    private void checkNetworkAndNotify() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean isConnected = activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        
        if (!isConnected) {
            Toast.makeText(this, "Nätverk saknas — försöker öppna diskret...", Toast.LENGTH_LONG).show();
        }
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

        // Wave 6: Premium Haptic Feedback
        triggerHapticFeedback();
    }

    private void triggerHapticFeedback() {
        View decorView = getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            decorView.performHapticFeedback(HapticFeedbackConstants.CONFIRM);
        } else {
            decorView.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
        }
    }

    private void dispatchPendingWidgetPath() {
        if (pendingWidgetPath == null || pendingWidgetPath.isEmpty()) {
            return;
        }
        
        // Fas 1: Begär permission om det är inspelnings-widget
        if (pendingWidgetPath.contains("/widget/inspelning") && 
            ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "Recording widget detected, requesting RECORD_AUDIO");
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, PERMISSIONS_REQUEST_RECORD_AUDIO);
        }

        if (getBridge() == null || getBridge().getWebView() == null) {
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
            
            if (!WidgetRouteMatcher.isSameRoute(currentUrl, targetUrl)) {
                Log.d(TAG, "Loading URL for widget: " + targetUrl);
                
                checkNetworkAndNotify();

                widgetUrlLoaded = true;
                webView.loadUrl(targetUrl);
            } else {
                Log.d(TAG, "WebView already at " + targetUrl + " (or equivalent), skipping loadUrl");
                widgetUrlLoaded = true;
            }
        }

        attemptWidgetDispatch(webView, pendingWidgetPath, 0);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "RECORD_AUDIO permission granted via widget-tap");
            } else {
                Log.w(TAG, "RECORD_AUDIO permission denied via widget-tap");
            }
        }
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
