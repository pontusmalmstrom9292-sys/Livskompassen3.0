package com.livskompassen.app;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AnticipateInterpolator;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.core.AppNotificationManager;
import com.livskompassen.app.core.SacredLockManager;
import com.livskompassen.app.core.WebViewManager;
import com.livskompassen.app.core.WidgetNavigator;
import com.livskompassen.app.util.AppCheckDebugBootstrap;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurityUtils;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSIONS_REQUEST_RECORD_AUDIO = 1001;

    private SacredLockManager sacredLockManager;
    private WidgetNavigator widgetNavigator;
    private WebViewManager webViewManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(LkNativeBuildPlugin.class);
        
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        splashScreen.setOnExitAnimationListener(view -> {
            final ObjectAnimator fadeOut = ObjectAnimator.ofFloat(view.getView(), View.ALPHA, 1f, 0f);
            fadeOut.setInterpolator(new AnticipateInterpolator());
            fadeOut.setDuration(400L);
            fadeOut.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) { view.remove(); }
            });
            fadeOut.start();
        });

        AppCheckDebugBootstrap.applyIfDebug(getApplicationContext());
        AppNotificationManager.createNotificationChannels(this);

        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);

        // Initialize Managers
        webViewManager = new WebViewManager(this, getBridge(), getWindow().getDecorView());
        sacredLockManager = new SacredLockManager(this, getBridge(), getWindow().getDecorView());
        widgetNavigator = new WidgetNavigator(getBridge(), getWindow().getDecorView());

        if (SecurityUtils.isRooted()) LCLog.w("Varning: Enheten är rootad.");

        setupBackNavigation();
        
        // Handle initial intent
        widgetNavigator.handleIntent(getIntent());
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (sacredLockManager.isLocked()) return;

                if (getBridge() != null && getBridge().getWebView() != null) {
                    if (getBridge().getWebView().canGoBack()) {
                        getBridge().getWebView().goBack();
                        return;
                    }
                    
                    String url = getBridge().getWebView().getUrl();
                    if (url != null && (url.contains("/widget/") || url.contains("/dev/"))) {
                        getBridge().getWebView().loadUrl(getBridge().getServerUrl());
                        return;
                    }
                }
                setEnabled(false);
                MainActivity.this.onBackPressed();
            }
        });
    }

    @Override
    public void load() {
        String path = widgetNavigator.getPendingWidgetPath();
        if (path != null && !path.isEmpty() && getBridge() != null) {
            String serverUrl = getBridge().getServerUrl();
            if (serverUrl != null) {
                if (serverUrl.endsWith("/")) serverUrl = serverUrl.substring(0, serverUrl.length() - 1);
                webViewManager.hideErrorPage();
                getBridge().getWebView().loadUrl(serverUrl + path);
                widgetNavigator.clearPendingPath();
                return;
            }
        }
        super.load();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        widgetNavigator.handleIntent(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        sacredLockManager.onResume();
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
        }
        
        String path = widgetNavigator.getPendingWidgetPath();
        if (path != null && path.contains("/widget/inspelning")) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, PERMISSIONS_REQUEST_RECORD_AUDIO);
            }
            webViewManager.requestAudioFocus();
        }
        
        widgetNavigator.dispatchPendingPath();
    }

    @Override
    public void onPause() {
        super.onPause();
        sacredLockManager.onPause();
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onPause();
        }
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (level >= TRIM_MEMORY_MODERATE && getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().clearCache(false);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                LCLog.d("RECORD_AUDIO granted.");
            }
        }
    }
}
