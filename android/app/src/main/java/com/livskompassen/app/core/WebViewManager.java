package com.livskompassen.app.core;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.OpenableColumns;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
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

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;
import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurityUtils;

import java.util.concurrent.Executor;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE.
 * Manages the WebView lifecycle, performance, error handling, and security.
 */
public class WebViewManager {
    private final Context context;
    private final Bridge bridge;
    private final HapticManager hapticManager;
    private final DialogManager dialogManager;
    private final SecureShareManager secureShareManager;
    private final IntegrityManager integrityManager;
    private final SystemUiManager systemUiManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private PerformanceWatchdog watchdog;

    private LinearLayout errorContainer;
    private TextView errorTitle;
    private TextView errorMessage;
    private View privacyOverlay;
    private boolean isNetworkOverlayShowing = false;

    @Nullable
    private final ActivityResultLauncher<Intent> fileChooserLauncher;
    @Nullable
    private ValueCallback<Uri[]> filePathCallback;
    /** True while a Lönekontor YAML/JSON pick is in flight (biometric → picker → result). */
    private boolean pendingSensitiveFilePick = false;

    public WebViewManager(
            Context context,
            Bridge bridge,
            View rootView,
            HapticManager hapticManager,
            IntegrityManager integrityManager,
            SystemUiManager systemUiManager,
            @Nullable ActivityResultLauncher<Intent> fileChooserLauncher) {
        this.context = context;
        this.bridge = bridge;
        this.hapticManager = hapticManager;
        this.integrityManager = integrityManager;
        this.systemUiManager = systemUiManager;
        this.dialogManager = new DialogManager(context, hapticManager);
        this.secureShareManager = new SecureShareManager(context);
        this.fileChooserLauncher = fileChooserLauncher;

        this.privacyOverlay = rootView.findViewById(R.id.privacy_overlay);

        setupErrorViews(rootView);
        setupWebView();
        setupNetworkCallback();
    }

    /** Backward-compatible constructor (no file chooser launcher). */
    public WebViewManager(Context context, Bridge bridge, View rootView, HapticManager hapticManager, IntegrityManager integrityManager, SystemUiManager systemUiManager) {
        this(context, bridge, rootView, hapticManager, integrityManager, systemUiManager, null);
    }

    /**
     * Deliver system file-picker result to the pending WebView ValueCallback.
     * Called from MainActivity's ActivityResultLauncher.
     */
    public void onFileChooserResult(int resultCode, @Nullable Intent data) {
        Uri[] results = null;
        final boolean wantsSensitiveData = pendingSensitiveFilePick;

        if (resultCode == Activity.RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null) {
                logUriSource(uri);
                if (validateFile(uri, wantsSensitiveData)) {
                    results = new Uri[]{uri};
                }
            } else if (data.getClipData() != null) {
                int count = data.getClipData().getItemCount();
                java.util.List<Uri> validUris = new java.util.ArrayList<>();
                for (int i = 0; i < count; i++) {
                    Uri clipUri = data.getClipData().getItemAt(i).getUri();
                    if (clipUri != null) {
                        logUriSource(clipUri);
                        if (validateFile(clipUri, wantsSensitiveData)) {
                            validUris.add(clipUri);
                        }
                    }
                }
                if (!validUris.isEmpty()) {
                    results = validUris.toArray(new Uri[0]);
                }
            }
        }

        pendingSensitiveFilePick = false;

        if (filePathCallback != null) {
            if (results == null && resultCode == Activity.RESULT_OK) {
                LCLog.w("WebViewManager: File pick rejected by native validation");
                hapticManager.error();
            } else if (results == null) {
                LCLog.d("WebViewManager: File pick cancelled");
            } else {
                LCLog.d("WebViewManager: Delivering " + results.length + " validated content URIs");
                hapticManager.success();
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    private void logUriSource(Uri uri) {
        String source = SecurityUtils.getUriSource(uri);
        LCLog.d("WebViewManager: Forensic Audit - File Source Authority: " + source);
    }

    private boolean validateFile(@NonNull Uri uri, boolean sensitiveCheck) {
        if (!"content".equals(uri.getScheme())) {
            LCLog.w("WebViewManager: Blocked non-content URI: " + uri.getScheme());
            Toast.makeText(context, "Säkerhetsfel: Endast system-filer tillåts.", Toast.LENGTH_SHORT).show();
            return false;
        }

        // 1. Size Validation (10MB Limit)
        try (Cursor cursor = context.getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);
                if (sizeIndex != -1) {
                    long size = cursor.getLong(sizeIndex);
                    if (size > 10 * 1024 * 1024) {
                        LCLog.w("WebViewManager: Blocked file too large: " + size + " bytes");
                        Toast.makeText(context, "Filen är för stor (max 10MB).", Toast.LENGTH_LONG).show();
                        return false;
                    }
                }
            }
        } catch (Exception e) {
            LCLog.e("WebViewManager: Failed to validate file size: " + e.getMessage());
        }

        // 2. MIME Sniffing for sensitive data (JSON/YAML)
        if (sensitiveCheck) {
            if (!SecurityUtils.isLikelyTextFile(context, uri)) {
                LCLog.e("WebViewManager: Blocked likely binary file for sensitive text request: " + uri.toString());
                Toast.makeText(context, "Fel: Filen verkar vara binär eller skadad.", Toast.LENGTH_LONG).show();
                return false;
            }
        }

        // 3. Forensic Fingerprinting
        String fingerprint = SecurityUtils.calculateFileHash(context, uri);
        LCLog.d("WebViewManager: File Fingerprint [SHA-256]: " + fingerprint);

        return true;
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

        webView.loadUrl("javascript:(function(){" +
                "const link=document.createElement('link');" +
                "link.rel='prefetch'; link.href='assets/index-Csuaqq85.css';" +
                "document.head.appendChild(link);" +
                "})()");

        // Obsidian Midnight — no white flash on touch / edge overscroll.
        webView.setBackgroundColor(Color.parseColor("#0D0B09"));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            webView.setForceDarkAllowed(false);
        }
        WebSettings settings = webView.getSettings();

        updateCacheMode(settings);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        // file:// blocked; content:// allowed so <input type="file"> can read picker URIs
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);

        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        settings.setGeolocationEnabled(false);

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        // Titanium Tapjacking Protection: Filter touches when obscured by another window/overlay.
        webView.setFilterTouchesWhenObscured(true);

        watchdog = new PerformanceWatchdog(webView);
        watchdog.start();

        webView.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, android.net.http.SslError error) {
                LCLog.e("FATAL: SSL Error Detected: " + error.toString());
                handler.cancel();
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

            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {
                if (WebViewManager.this.filePathCallback != null) {
                    WebViewManager.this.filePathCallback.onReceiveValue(null);
                }
                WebViewManager.this.filePathCallback = filePathCallback;
                pendingSensitiveFilePick = false;

                if (fileChooserLauncher == null) {
                    LCLog.e("WebViewManager: fileChooserLauncher missing — cancelling file pick");
                    WebViewManager.this.filePathCallback.onReceiveValue(null);
                    WebViewManager.this.filePathCallback = null;
                    return true;
                }

                // Environment Integrity Check
                if (integrityManager != null && integrityManager.isEnvironmentHighRisk()) {
                    LCLog.e("WebViewManager: High risk environment detected. Blocking file picker.");
                    Toast.makeText(context, "Säkerhetsvarning: Uppladdning begränsad i osäker miljö.", Toast.LENGTH_LONG).show();
                    WebViewManager.this.filePathCallback.onReceiveValue(null);
                    WebViewManager.this.filePathCallback = null;
                    return true;
                }

                try {
                    Intent intent = fileChooserParams.createIntent();
                    String[] acceptTypes = fileChooserParams.getAcceptTypes();

                    boolean wantsYaml = false;
                    boolean wantsJson = false;
                    boolean wantsMediaOrPdf = false;
                    if (acceptTypes != null) {
                        for (String type : acceptTypes) {
                            String t = type == null ? "" : type.toLowerCase();
                            if (t.contains("yaml") || t.contains("yml") || t.endsWith(".yaml") || t.endsWith(".yml")) {
                                wantsYaml = true;
                            }
                            if (t.contains("json") || t.endsWith(".json")) {
                                wantsJson = true;
                            }
                            if (t.contains("image") || t.contains("video") || t.contains("audio") || t.contains("pdf")) {
                                wantsMediaOrPdf = true;
                            }
                        }
                    }

                    boolean sensitivePick = (wantsYaml || wantsJson) && !wantsMediaOrPdf;
                    
                    if (sensitivePick) {
                        LCLog.d("WebViewManager: Strengthening intent for YAML/JSON (Lönekontor)");
                        String action = intent.getAction();
                        if (Intent.ACTION_GET_CONTENT.equals(action) || Intent.ACTION_OPEN_DOCUMENT.equals(action)) {
                            intent.setType("*/*");
                            String[] extraMimeTypes = {
                                "application/json",
                                "application/x-yaml",
                                "text/yaml",
                                "text/plain",
                                "application/octet-stream"
                            };
                            intent.putExtra(Intent.EXTRA_MIME_TYPES, extraMimeTypes);
                        }
                    }

                    String title = sensitivePick ? "Välj Lönekontor-fil (.yaml, .json)" : "Välj fil";
                    final Intent chooserIntent = Intent.createChooser(intent, title);

                    pendingSensitiveFilePick = sensitivePick;

                    if (sensitivePick) {
                        LCLog.d("WebViewManager: Sensitive upload detected. Triggering Titanium file guard.");

                        // Reinforce Sacred Zone (screenshot & record protection) for Lönekontor picks
                        if (systemUiManager != null) {
                            systemUiManager.setSacredZone(true);
                        }

                        showPrivacyOverlay();
                        triggerBiometricAuth(chooserIntent);
                    } else {
                        fileChooserLauncher.launch(chooserIntent);
                    }
                    return true;
                } catch (Exception e) {
                    LCLog.e("WebViewManager: onShowFileChooser failed: " + e.getMessage());
                    pendingSensitiveFilePick = false;
                    if (WebViewManager.this.filePathCallback != null) {
                        WebViewManager.this.filePathCallback.onReceiveValue(null);
                        WebViewManager.this.filePathCallback = null;
                    }
                    return true;
                }
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            if (url == null) {
                return;
            }
            if (url.startsWith("https://")) {
                String name = android.webkit.URLUtil.guessFileName(url, contentDisposition, mimetype);
                secureShareManager.enqueueHttpsDownload(url, name, mimetype);
                return;
            }
            if (url.startsWith("data:")) {
                String name = android.webkit.URLUtil.guessFileName("download.bin", contentDisposition, mimetype);
                if (mimetype != null && mimetype.contains("pdf")) {
                    name = name.endsWith(".pdf") ? name : "livskompassen-export.pdf";
                }
                secureShareManager.shareBase64AsFile(
                        url,
                        name,
                        mimetype != null ? mimetype : "application/octet-stream");
                return;
            }
            LCLog.w("WebViewManager: unsupported download scheme: "
                    + url.substring(0, Math.min(32, url.length())));
            Toast.makeText(context, "Den här filtypen kan inte laddas ner här.", Toast.LENGTH_SHORT).show();
        });
    }

    private void triggerBiometricAuth(final Intent intentToLaunch) {
        if (!(context instanceof FragmentActivity)) {
            LCLog.e("WebViewManager: Context is not FragmentActivity, skipping biometric.");
            hidePrivacyOverlay();
            fileChooserLauncher.launch(intentToLaunch);
            return;
        }

        FragmentActivity activity = (FragmentActivity) context;
        Executor executor = ContextCompat.getMainExecutor(context);
        BiometricPrompt biometricPrompt = new BiometricPrompt(activity, executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        LCLog.w("WebViewManager: Biometric error: " + errString);
                        hidePrivacyOverlay();
                        pendingSensitiveFilePick = false;
                        if (filePathCallback != null) {
                            filePathCallback.onReceiveValue(null);
                            filePathCallback = null;
                        }
                    }

                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        LCLog.d("WebViewManager: Biometric success. Launching file picker.");
                        hidePrivacyOverlay();
                        fileChooserLauncher.launch(intentToLaunch);
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        LCLog.w("WebViewManager: Biometric failed.");
                    }
                });

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Verifiera identitet")
                .setSubtitle("Krävs för att ladda upp Lönekontor-data")
                .setNegativeButtonText("Avbryt")
                .setAllowedAuthenticators(androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG | 
                                          androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                .build();

        biometricPrompt.authenticate(promptInfo);
    }

    private void showPrivacyOverlay() {
        if (privacyOverlay != null) {
            mainHandler.post(() -> {
                privacyOverlay.setVisibility(View.VISIBLE);
                privacyOverlay.setAlpha(0f);
                privacyOverlay.animate().alpha(1f).setDuration(200).start();
            });
        }
    }

    private void hidePrivacyOverlay() {
        if (privacyOverlay != null) {
            mainHandler.post(() -> {
                privacyOverlay.animate().alpha(0f).setDuration(200).withEndAction(() ->
                        privacyOverlay.setVisibility(View.GONE)
                ).start();
            });
        }
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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (audioManager.getMode() == AudioManager.MODE_IN_COMMUNICATION ||
                audioManager.getMode() == AudioManager.MODE_IN_CALL) {
                LCLog.w("WebViewManager: Microphone may be in use by another app!");
                Toast.makeText(context, "Varning: Mikrofonen verkar användas av en annan app.", Toast.LENGTH_LONG).show();
            }
        }

        LCLog.d("WebViewManager: Hardening audio session for recording.");

        AudioManager.OnAudioFocusChangeListener listener = focusChange -> {
            if (focusChange == AudioManager.AUDIOFOCUS_LOSS || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                if (bridge.getWebView() != null) {
                    bridge.getWebView().evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('livskompassen-audio-pause'));", null);
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
