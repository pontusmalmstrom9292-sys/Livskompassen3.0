package com.livskompassen.app;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.net.Uri;
import com.livskompassen.app.core.ShakeDetector;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AnticipateInterpolator;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.work.Constraints;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.core.AppNotificationManager;
import com.livskompassen.app.core.BackupManager;
import com.livskompassen.app.core.BatteryManager;
import com.livskompassen.app.core.ConnectivityIntelligence;
import com.livskompassen.app.core.DiagnosticManager;
import com.livskompassen.app.core.EmergencyManager;
import com.livskompassen.app.core.FocusManager;
import com.livskompassen.app.core.ForensicGuard;
import com.livskompassen.app.core.HapticManager;
import com.livskompassen.app.core.HealthSentinel;
import com.livskompassen.app.core.IconManager;
import com.livskompassen.app.core.IdentityManager;
import com.livskompassen.app.core.ProjectionManager;
import com.livskompassen.app.core.IntegrityManager;
import com.livskompassen.app.core.MemoryManager;
import com.livskompassen.app.core.NativeInterface;
import com.livskompassen.app.core.ParallaxManager;
import com.livskompassen.app.core.SacredLockManager;
import com.livskompassen.app.core.SecureShareManager;
import com.livskompassen.app.core.SearchManager;
import com.livskompassen.app.core.SessionSentry;
import com.livskompassen.app.core.ShortcutManager;
import com.livskompassen.app.core.SystemUiManager;
import com.livskompassen.app.core.ThemeManager;
import com.livskompassen.app.core.WebViewManager;
import com.livskompassen.app.core.WidgetNavigator;
import com.livskompassen.app.core.ZoneManager;
import com.livskompassen.app.util.AppCheckDebugBootstrap;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurityUtils;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSIONS_REQUEST_RECORD_AUDIO = 1001;

    private SacredLockManager sacredLockManager;
    private WidgetNavigator widgetNavigator;
    private WebViewManager webViewManager;
    /** System file picker for WebView input type=file (Inkast / dagbok). */
    private ActivityResultLauncher<Intent> fileChooserLauncher;
    private HapticManager hapticManager;
    private BatteryManager batteryManager;
    private ConnectivityIntelligence connectivityIntelligence;
    private MemoryManager memoryManager;
    private SystemUiManager systemUiManager;
    private ThemeManager themeManager;
    private SessionSentry sessionSentry;
    private com.livskompassen.app.core.EmergencyManager emergencyManager;
    private ShortcutManager shortcutManager;
    private com.livskompassen.app.core.BackupManager backupManager;
    private FocusManager focusManager;
    private SecureShareManager shareManager;
    private com.livskompassen.app.core.SearchManager searchManager;
    private IconManager iconManager;
    private ProjectionManager projectionManager;
    private ParallaxManager parallaxManager;
    private ZoneManager zoneManager;
    private IntegrityManager integrityManager;
    private ForensicGuard forensicGuard;
    private HealthSentinel healthSentinel;
    private ShakeDetector shakeDetector;
    private SensorManager sensorManager;
    private View privacyOverlay;

    public ShortcutManager getShortcutManager() { return shortcutManager; }
    public MemoryManager getMemoryManager() { return memoryManager; }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(LkNativeBuildPlugin.class);

        // Register before STARTED — wires WebView file input without monolith logic.
        fileChooserLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (webViewManager != null) {
                        webViewManager.onFileChooserResult(result.getResultCode(), result.getData());
                    }
                });

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

        // Final Zenith Optimization: Load initial state in background
        new Thread(() -> {
            DiagnosticManager.init(this);
            IdentityManager.verifyAppIntegrity(this);
            AppNotificationManager.createNotificationChannels(this);
        }).start();

        AppCheckDebugBootstrap.applyIfDebug(getApplicationContext());
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        
        initializeManagers();
        setupShakePanic();
        setupBackNavigation();
        setupBackgroundWork();
        
        // Handle initial intent
        handleInitialIntent(getIntent());
    }

    private void initializeManagers() {
        hapticManager = new HapticManager(this);
        batteryManager = new BatteryManager(this);
        connectivityIntelligence = new ConnectivityIntelligence(this);
        hapticManager.setBatteryManager(batteryManager);

        connectivityIntelligence.setNetworkStatusListener((isMetered, isRoaming) -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                runOnUiThread(() -> {
                    String js = String.format("window.dispatchEvent(new CustomEvent('livskompassen-network-change', {detail: {metered: %b, roaming: %b}}));", isMetered, isRoaming);
                    getBridge().getWebView().evaluateJavascript(js, null);
                });
            }
        });

        batteryManager.setPowerSaveListener(isEnabled -> {
            if (parallaxManager != null) {
                parallaxManager.setBatteryPaused(isEnabled);
            }
        });

        systemUiManager = new SystemUiManager(this);
        systemUiManager.setSacredZone(true); // Start in Sacred Mode by default for safety

        themeManager = new ThemeManager(systemUiManager);
        integrityManager = new IntegrityManager(this);
        healthSentinel = new HealthSentinel(this, integrityManager);
        healthSentinel.performHealthCheck();
        
        zoneManager = new ZoneManager(this);
        parallaxManager = new ParallaxManager(this);
        integrityManager.setZoneManager(zoneManager);
        emergencyManager = new com.livskompassen.app.core.EmergencyManager(this);
        
        memoryManager = new MemoryManager(this, getBridge());
        webViewManager = new WebViewManager(
                this, getBridge(), getWindow().getDecorView(), hapticManager, integrityManager, systemUiManager, fileChooserLauncher);
        sacredLockManager = new SacredLockManager(this, getBridge(), getWindow().getDecorView(), hapticManager, integrityManager);
        sessionSentry = new SessionSentry(getBridge(), sacredLockManager);
        shortcutManager = new ShortcutManager(this);
        backupManager = new com.livskompassen.app.core.BackupManager(this);
        focusManager = new FocusManager(this);
        shareManager = new com.livskompassen.app.core.SecureShareManager(this);
        searchManager = new SearchManager(this);
        iconManager = new com.livskompassen.app.core.IconManager(this);
        
        projectionManager = new ProjectionManager(this, isProjecting -> {
            if (isProjecting) {
                LCLog.w("MainActivity: Security warning - screen is being projected!");
            }
        });
        projectionManager.start();
        
        forensicGuard = new ForensicGuard(this, sacredLockManager);
        forensicGuard.startMonitoring();

        widgetNavigator = new WidgetNavigator(getBridge(), getWindow().getDecorView());
        privacyOverlay = findViewById(R.id.privacy_overlay);

        // High-performance Bridge
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().addJavascriptInterface(
                new NativeInterface(hapticManager, systemUiManager, integrityManager, themeManager, sessionSentry, emergencyManager, shortcutManager, backupManager, focusManager, shareManager, connectivityIntelligence, sacredLockManager, healthSentinel, searchManager, iconManager, projectionManager),
                "LivskompassenNative"
            );
        }

        themeManager.applyCircadianTheme();

        checkSecurityStatus();
    }

    private void checkSecurityStatus() {
        if (SecurityUtils.isRooted()) LCLog.w("Varning: Enheten är rootad.");
        if (SecurityUtils.isAdbEnabled(this)) LCLog.w("Säkerhetsinfo: ADB-felsökning är aktiverat.");
        if (SecurityUtils.isHookingDetected()) LCLog.e("KRITISKT: Hooking-verktyg detekterade!");
        if (SecurityUtils.hasSuspiciousAccessibilityService(this)) LCLog.w("Varning: Misstänkt hjälpmedelstjänst aktiv.");
    }

    private void handleInitialIntent(Intent intent) {
        if (intent != null && Intent.ACTION_SEND.equals(intent.getAction()) && "text/plain".equals(intent.getType())) {
            handleShareIntent(intent);
        } else {
            widgetNavigator.handleIntent(intent);
        }
    }

    private void handleShareIntent(Intent intent) {
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText != null && !sharedText.isEmpty()) {
            LCLog.d("MainActivity: Received shared text: " + sharedText);
            // Pass to Web UI via Inkast route
            String path = "/planering/input?inputMode=inkast&shared_text=" + Uri.encode(sharedText);
            if (widgetNavigator != null) {
                widgetNavigator.handleIntent(new Intent().putExtra("widget_path", path));
            }
        }
    }

    private void setupBackgroundWork() {
        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();

        PeriodicWorkRequest refreshRequest = new PeriodicWorkRequest.Builder(
                com.livskompassen.app.core.WidgetRefreshWorker.class, 
                1, java.util.concurrent.TimeUnit.HOURS)
                .setConstraints(constraints)
                .addTag("widget_heartbeat")
                .build();

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
                "widget_heartbeat",
                androidx.work.ExistingPeriodicWorkPolicy.KEEP,
                refreshRequest
        );
        LCLog.d("WorkManager: Scheduled periodic widget heartbeat.");
    }

    private long lastBackPressTime = 0;
    private static final long BACK_PRESS_INTERVAL = 2000;

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (sacredLockManager != null && sacredLockManager.isLocked()) return;

                if (getBridge() != null && getBridge().getWebView() != null) {
                    if (getBridge().getWebView().canGoBack()) {
                        getBridge().getWebView().goBack();
                        return;
                    }
                    
                    String url = getBridge().getWebView().getUrl();
                    if (url != null && (url.contains("/widget/") || url.contains("/dev/") || url.contains("tab=mer"))) {
                        getBridge().getWebView().loadUrl(getBridge().getServerUrl());
                        return;
                    }
                }

                if (lastBackPressTime + BACK_PRESS_INTERVAL > System.currentTimeMillis()) {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                } else {
                    lastBackPressTime = System.currentTimeMillis();
                    // Optional: Visa en toast här om det önskas, 
                    // men enligt "discreet" UX i dev-notes skippar vi det för tillfället.
                }
            }
        });
    }

    @Override
    public void load() {
        // BridgeActivity.onCreate() calls load() before our managers are constructed.
        // Must not touch widgetNavigator/webViewManager here or the app crashes on cold start.
        if (widgetNavigator == null || webViewManager == null) {
            super.load();
            return;
        }
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
        // Handle share intent if present
        if (Intent.ACTION_SEND.equals(intent.getAction()) && "text/plain".equals(intent.getType())) {
            handleShareIntent(intent);
            return;
        }
        // Also invoked from BridgeActivity.load() during super.onCreate — managers may still be null.
        if (widgetNavigator != null) {
            widgetNavigator.handleIntent(intent);
        }
    }

    private void setupShakePanic() {
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        shakeDetector = new ShakeDetector();
        shakeDetector.setOnShakeListener(count -> {
            if (count >= 2) {
                LCLog.w("SHAKE PANIC DETECTED! Immediate lockdown triggered.");
                hapticManager.error();
                if (sacredLockManager != null) {
                    sacredLockManager.showLock();
                }
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        if (sensorManager != null && shakeDetector != null) {
            sensorManager.registerListener(shakeDetector, 
                sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), 
                SensorManager.SENSOR_DELAY_UI);
        }
        if (parallaxManager != null) {
            parallaxManager.start(getBridge().getWebView());
        }
        if (privacyOverlay != null) privacyOverlay.setVisibility(View.GONE);
        if (sacredLockManager != null) {
            sacredLockManager.onResume();
        }
        if (sessionSentry != null) {
            sessionSentry.startMonitoring();
        }
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
        }

        if (widgetNavigator == null || webViewManager == null) {
            return;
        }

        // Cold start: onNewIntent/load may have run before managers existed — catch widget deep-link now.
        widgetNavigator.handleIntent(getIntent());

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
        if (sensorManager != null) {
            sensorManager.unregisterListener(shakeDetector);
        }
        if (parallaxManager != null) {
            parallaxManager.stop();
        }
        if (privacyOverlay != null) privacyOverlay.setVisibility(View.VISIBLE);
        if (sacredLockManager != null) {
            sacredLockManager.onPause();
        }
        if (sessionSentry != null) {
            sessionSentry.stopMonitoring();
        }
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onPause();
        }
        
        DiagnosticManager diagnosticManager = DiagnosticManager.getInstance();
        if (diagnosticManager != null) {
            diagnosticManager.flushToDisk();
        }
    }

    @Override
    public void onDestroy() {
        if (projectionManager != null) projectionManager.stop();
        if (memoryManager != null) memoryManager.unregister();
        super.onDestroy();
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
