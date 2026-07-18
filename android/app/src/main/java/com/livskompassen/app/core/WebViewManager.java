package com.livskompassen.app.core;

import android.content.Context;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;
import android.net.NetworkRequest;
import android.net.http.SslError;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.SslErrorHandler;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;
import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Manages the WebView lifecycle, performance, error handling, and security.
 */
public class WebViewManager {
    private final Context context;
    private final Bridge bridge;
    private final HapticManager hapticManager;
    private final DialogManager dialogManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private PerformanceWatchdog watchdog;
    
    private LinearLayout errorContainer;
    private TextView errorTitle;
    private TextView errorMessage;
    private boolean isNetworkOverlayShowing = false;

    public WebViewManager(Context context, Bridge bridge, View rootView, HapticManager hapticManager) {
        this.context = context;
        this.bridge = bridge;
        this.hapticManager = hapticManager;
        this.dialogManager = new DialogManager(context, hapticManager);
        
        setupErrorViews(rootView);
        setupWebView();
        setupNetworkCallback();
    }

    private void setupNetworkCallback() {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            connectivityManager.registerDefaultNetworkCallback(new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(@NonNull Network network) {
                    super.onAvailable(network);
                    if (isNetworkOverlayShowing) {
                        LCLog.d("Network back online, auto-reloading WebView");
                        mainHandler.post(() -> {
                            hideErrorPage();
                            if (bridge.getWebView() != null) {
                                bridge.getWebView().reload();
                            }
                        });
                    }
                }
            });
        }
    }

    private void setupErrorViews(View rootView) {
        errorContainer = rootView.findViewById(R.id.error_container);
        errorTitle = rootView.findViewById(R.id.error_title);
        errorMessage = rootView.findViewById(R.id.error_message);
        Button btnRetry = rootView.findViewById(R.id.btn_retry);

        if (btnRetry != null) {
            btnRetry.setOnClickListener(v -> {
                hapticManager.lightClick(v);
                hideErrorPage();
                if (bridge.getWebView() != null) {
                    bridge.getWebView().reload();
                }
            });
        }
    }

    private void setupWebView() {
        WebView webView = bridge.getWebView();
        if (webView == null) return;

        // Pre-warm the WebView cache with critical assets
        webView.loadUrl("javascript:(function(){" +
                "const link=document.createElement('link');" +
                "link.rel='prefetch'; link.href='assets/index-Csuaqq85.css';" +
                "document.head.appendChild(link);" +
                "})()");

        webView.setBackgroundColor(Color.parseColor("#0D0B09"));
        WebSettings settings = webView.getSettings();
        
        // Performance & Caching
        updateCacheMode(settings);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);

        // Security Hardening (Våg 18)
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        settings.setGeolocationEnabled(false);

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Start Performance Watchdog
        watchdog = new PerformanceWatchdog(webView);
        watchdog.start();

        webView.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, android.net.http.SslError error) {
                LCLog.e("FATAL: SSL Error Detected: " + error.toString());
                handler.cancel(); // Block all SSL errors
                showErrorPage("Säkerhetsfel", "Anslutningen är inte säker (SSL_ERROR).");
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                updateCacheMode(view.getSettings());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (url != null && !url.equals("about:blank")) {
                    hideErrorPage();
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    showErrorPage("Anslutningsfel", error.getDescription().toString());
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                if (request.isForMainFrame() && errorResponse.getStatusCode() >= 400) {
                    showErrorPage("Serverfel", "Status: " + errorResponse.getStatusCode());
                }
            }

            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    LCLog.e("WebView Render Process Gone. Did crash: " + detail.didCrash());
                } else {
                    LCLog.e("WebView Render Process Gone.");
                }
                showErrorPage("App-omstart krävs", "Webbvyn har slutat svara. Försök att starta om appen.");
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, final android.webkit.JsResult result) {
                dialogManager.showMessage("Livskompassen", message, () -> result.confirm());
                return true;
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final android.webkit.JsResult result) {
                dialogManager.showConfirm("Bekräfta", message, confirmed -> {
                    if (confirmed) result.confirm();
                    else result.cancel();
                });
                return true;
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                for (String resource : request.getResources()) {
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                        request.grant(request.getResources());
                        return;
                    }
                }
                super.onPermissionRequest(request);
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                LCLog.d("JS [" + consoleMessage.messageLevel() + "]: " + consoleMessage.message());
                return true;
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> 
            Toast.makeText(context, "Sparar säkert i Valvet...", Toast.LENGTH_SHORT).show()
        );
    }

    private void updateCacheMode(WebSettings settings) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        if (activeNetwork != null && activeNetwork.isConnected()) {
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        } else {
            settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
    }

    public void showErrorPage(String title, String message) {
        mainHandler.post(() -> {
            if (errorContainer != null && errorContainer.getVisibility() != View.VISIBLE) {
                hapticManager.error();
                errorTitle.setText(title);
                errorMessage.setText(message);
                
                isNetworkOverlayShowing = true;
                errorContainer.setAlpha(0f);
                errorContainer.setVisibility(View.VISIBLE);
                errorContainer.animate().alpha(1f).setDuration(400).start();
                
                if (bridge.getWebView() != null) {
                    bridge.getWebView().animate().alpha(0f).setDuration(400).withEndAction(() -> 
                        bridge.getWebView().setVisibility(View.GONE)
                    ).start();
                }
            }
        });
    }

    public void hideErrorPage() {
        mainHandler.post(() -> {
            if (errorContainer != null && errorContainer.getVisibility() == View.VISIBLE) {
                isNetworkOverlayShowing = false;
                errorContainer.animate().alpha(0f).setDuration(400).withEndAction(() -> 
                    errorContainer.setVisibility(View.GONE)
                ).start();
                
                if (bridge.getWebView() != null) {
                    bridge.getWebView().setVisibility(View.VISIBLE);
                    bridge.getWebView().setAlpha(0f);
                    bridge.getWebView().animate().alpha(1f).setDuration(400).start();
                }
            }
        });
    }

    public void requestAudioFocus() {
        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audioManager == null) return;

        // Våg 47: Check if microphone is already in use
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (audioManager.getMode() == AudioManager.MODE_IN_COMMUNICATION || 
                audioManager.getMode() == AudioManager.MODE_IN_CALL) {
                LCLog.w("WebViewManager: Microphone may be in use by another app!");
                Toast.makeText(context, "Varning: Mikrofonen verkar användas av en annan app.", Toast.LENGTH_LONG).show();
            }
        }

        // Härda ljudsessionen för Våg 29
        LCLog.d("WebViewManager: Hardening audio session for recording.");

        AudioManager.OnAudioFocusChangeListener listener = focusChange -> {
            if (focusChange == AudioManager.AUDIOFOCUS_LOSS || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                if (bridge.getWebView() != null) {
                    bridge.getWebView().evaluateJavascript("window.dispatchEvent(new CustomEvent('livskompassen-audio-pause'));", null);
                }
            } else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
                // Återuppta haptik eller signalera till JS om önskvärt
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build();
            audioManager.requestAudioFocus(new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                    .setAudioAttributes(attrs).setAcceptsDelayedFocusGain(true)
                    .setOnAudioFocusChangeListener(listener).build());
        } else {
            audioManager.requestAudioFocus(listener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
        }
    }
}
