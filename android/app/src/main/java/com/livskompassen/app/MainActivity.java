package com.livskompassen.app;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AnticipateInterpolator;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.util.AppCheckDebugBootstrap;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurityUtils;
import com.livskompassen.app.widgets.WidgetLaunch;
import com.livskompassen.app.widgets.WidgetRouteMatcher;

/**
 * Capacitor shell + native Android widgets (WH1–WH6).
 * Widget-tap laddar /widget/* direkt i WebView — inte hela appens hem först.
 */
public class MainActivity extends BridgeActivity {

    private static final int WIDGET_DISPATCH_MAX_ATTEMPTS = 40;
    private static final long WIDGET_DISPATCH_RETRY_MS = 150L;
    private static final int PERMISSIONS_REQUEST_RECORD_AUDIO = 1001;
    private static final long BACK_BUTTON_EXIT_DELAY = 2000L;

    private String pendingWidgetPath;
    private boolean widgetUrlLoaded;
    private boolean backButtonPressedOnce = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Cap-plugin måste registreras före Bridge skapas (super.onCreate → load).
        registerPlugin(LkNativeBuildPlugin.class);

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

        // Debug-token i prefs före WebView/JS — Debug provider läser secret vid getToken.
        AppCheckDebugBootstrap.applyIfDebug(getApplicationContext());

        super.onCreate(savedInstanceState);
        
        LCLog.d("MainActivity onCreate");
        if (SecurityUtils.isRooted()) {
            LCLog.w("Säkerhetsvarning: Enheten verkar vara rootad.");
        }

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
        setupBackNavigation();
        dispatchPendingWidgetPath();
    }

    private void setupWebView() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            
            // Obsidian Calm background to avoid white flashes
            webView.setBackgroundColor(Color.parseColor("#0D0B09"));
            
            // Performance Tuning
            WebSettings settings = webView.getSettings();
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                settings.setSafeBrowsingEnabled(true);
            }

            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

            // Audio Permission & Console Logging wrapper
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                            LCLog.d("WebView requesting AUDIO_CAPTURE");
                            request.grant(request.getResources());
                            return;
                        }
                    }
                    super.onPermissionRequest(request);
                }

                @Override
                public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                    LCLog.d("JS Console [" + consoleMessage.messageLevel() + "]: " + 
                          consoleMessage.message() + " -- From line " + 
                          consoleMessage.lineNumber() + " of " + 
                          consoleMessage.sourceId());
                    return true;
                }
            });

            // Valvet: Secure Download Handling
            webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
                LCLog.d("Valvet: Download requested for " + mimetype);
                if (mimetype != null && mimetype.startsWith("audio/")) {
                    Toast.makeText(MainActivity.this, "Inspelning sparad i Valvet", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Sparar säkert i Valvet...", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() != null && getBridge().getWebView() != null) {
                    WebView webView = getBridge().getWebView();
                    if (webView.canGoBack()) {
                        webView.goBack();
                        return;
                    }
                }

                if (backButtonPressedOnce) {
                    setEnabled(false);
                    MainActivity.this.finish();
                    return;
                }

                backButtonPressedOnce = true;
                Toast.makeText(MainActivity.this, "Tryck bakåt igen för att avsluta", Toast.LENGTH_SHORT).show();

                new Handler(Looper.getMainLooper()).postDelayed(() -> backButtonPressedOnce = false, BACK_BUTTON_EXIT_DELAY);
            }
        });
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
                LCLog.d("Cold start override: loading widget URL " + targetUrl);
                
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
        LCLog.d("MainActivity onNewIntent");
        widgetUrlLoaded = false;
        captureWidgetPath(intent);
        // Force immediate dispatch for onNewIntent (warm start)
        dispatchPendingWidgetPath();
    }

    @Override
    public void onResume() {
        super.onResume();
        LCLog.d("MainActivity onResume");
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
            getBridge().getWebView().resumeTimers();
        }
        dispatchPendingWidgetPath();
    }

    @Override
    public void onPause() {
        super.onPause();
        LCLog.d("MainActivity onPause");
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onPause();
            getBridge().getWebView().pauseTimers();
        }
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (level >= TRIM_MEMORY_MODERATE && getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().clearCache(false);
        }
    }

    private void captureWidgetPath(Intent intent) {
        if (intent == null) {
            return;
        }

        // Support for standard deep links (e.g. livskompassen://path)
        Uri data = intent.getData();
        if (data != null) {
            String path = data.getPath();
            String query = data.getQuery();
            if (path != null) {
                String fullPath = path + (query != null ? "?" + query : "");
                if (!fullPath.isEmpty() && !"/".equals(fullPath)) {
                    LCLog.d("Captured deep link path: " + fullPath);
                    pendingWidgetPath = fullPath;
                    triggerHapticFeedback();
                    return;
                }
            }
        }

        // Support for widget-specific extras
        String path = intent.getStringExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
        if (path != null && !path.isEmpty()) {
            LCLog.d("Captured widget path: " + path);
            pendingWidgetPath = path;
            intent.removeExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
            triggerHapticFeedback();
        }
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
        if (pendingWidgetPath.contains("/widget/inspelning")) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                LCLog.d("Recording widget detected, requesting RECORD_AUDIO");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, PERMISSIONS_REQUEST_RECORD_AUDIO);
            }
            // Våg 9: Begär Audio Focus för att pausa annan media
            requestAudioFocus();
        }

        if (getBridge() == null || getBridge().getWebView() == null) {
            LCLog.d("Bridge not ready yet, pendingWidgetPath is stored: " + pendingWidgetPath);
            return;
        }

        WebView webView = getBridge().getWebView();
        if (!widgetUrlLoaded) {
            String serverUrl = getBridge().getServerUrl();
            if (serverUrl == null) {
                LCLog.e("serverUrl is null, cannot dispatch widget");
                return;
            }
            if (serverUrl.endsWith("/")) {
                serverUrl = serverUrl.substring(0, serverUrl.length() - 1);
            }
            
            String targetUrl = serverUrl + pendingWidgetPath;
            String currentUrl = webView.getUrl();
            
            if (!WidgetRouteMatcher.isSameRoute(currentUrl, targetUrl)) {
                LCLog.d("Loading URL for widget: " + targetUrl);
                
                checkNetworkAndNotify();
                
                widgetUrlLoaded = true;
                webView.loadUrl(targetUrl);
            } else {
                LCLog.d("WebView already at " + targetUrl + " (or equivalent), skipping loadUrl");
                widgetUrlLoaded = true;
            }
        }

        attemptWidgetDispatch(webView, pendingWidgetPath, 0);
    }

    private void requestAudioFocus() {
        AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (audioManager != null) {
            LCLog.d("Requesting Audio Focus for recording widget");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                AudioAttributes playbackAttributes = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build();
                AudioFocusRequest focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                        .setAudioAttributes(playbackAttributes)
                        .setAcceptsDelayedFocusGain(true)
                        .setOnAudioFocusChangeListener(focusChange -> LCLog.d("Audio focus changed: " + focusChange))
                        .build();
                audioManager.requestAudioFocus(focusRequest);
            } else {
                audioManager.requestAudioFocus(focusChange -> LCLog.d("Audio focus changed: " + focusChange),
                        AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                LCLog.d("RECORD_AUDIO permission granted via widget-tap");
            } else {
                LCLog.w("RECORD_AUDIO permission denied via widget-tap");
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
                            LCLog.d("Widget dispatch successful: " + path);
                            pendingWidgetPath = null;
                            return;
                        }
                        if (attempt + 1 >= WIDGET_DISPATCH_MAX_ATTEMPTS) {
                            LCLog.w("Widget dispatch timed out after " + WIDGET_DISPATCH_MAX_ATTEMPTS + " attempts");
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
