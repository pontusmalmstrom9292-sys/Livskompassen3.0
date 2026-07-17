package com.livskompassen.app.core;

import android.content.Context;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
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
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;
import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;

public class WebViewManager {
    private final Context context;
    private final Bridge bridge;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    private LinearLayout errorContainer;
    private TextView errorTitle;
    private TextView errorMessage;

    public WebViewManager(Context context, Bridge bridge, View rootView) {
        this.context = context;
        this.bridge = bridge;
        
        setupErrorViews(rootView);
        setupWebView();
    }

    private void setupErrorViews(View rootView) {
        errorContainer = rootView.findViewById(R.id.error_container);
        errorTitle = rootView.findViewById(R.id.error_title);
        errorMessage = rootView.findViewById(R.id.error_message);
        Button btnRetry = rootView.findViewById(R.id.btn_retry);

        if (btnRetry != null) {
            btnRetry.setOnClickListener(v -> {
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

        webView.setBackgroundColor(Color.parseColor("#0D0B09"));
        WebSettings settings = webView.getSettings();
        
        // Performance & Caching
        updateCacheMode(settings);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        webView.setWebViewClient(new BridgeWebViewClient(bridge) {
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
            if (errorContainer != null) {
                errorTitle.setText(title);
                errorMessage.setText(message);
                errorContainer.setVisibility(View.VISIBLE);
                if (bridge.getWebView() != null) bridge.getWebView().setVisibility(View.GONE);
            }
        });
    }

    public void hideErrorPage() {
        mainHandler.post(() -> {
            if (errorContainer != null) {
                errorContainer.setVisibility(View.GONE);
                if (bridge.getWebView() != null) bridge.getWebView().setVisibility(View.VISIBLE);
            }
        });
    }

    public void requestAudioFocus() {
        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audioManager == null) return;

        AudioManager.OnAudioFocusChangeListener listener = focusChange -> {
            if (focusChange == AudioManager.AUDIOFOCUS_LOSS || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                if (bridge.getWebView() != null) {
                    bridge.getWebView().evaluateJavascript("window.dispatchEvent(new CustomEvent('livskompassen-audio-pause'));", null);
                }
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
