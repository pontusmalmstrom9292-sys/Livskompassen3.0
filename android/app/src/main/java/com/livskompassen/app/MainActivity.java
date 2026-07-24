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
import android.os.Handler;
import android.os.Looper;
import android.view.MotionEvent;
import android.view.View;
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
import com.livskompassen.app.core.GhostLaunchReceiver;
import com.livskompassen.app.core.HapticManager;
import com.livskompassen.app.core.HealthSentinel;
import com.livskompassen.app.core.IconManager;
import com.livskompassen.app.core.IntelligenceManager;
import com.livskompassen.app.core.AuraFlowManager;
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

import android.widget.TextView;
import java.util.Random;

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
    private IntelligenceManager intelligenceManager;
    private AuraFlowManager auraFlowManager;
    private SensorManager sensorManager;
    private View privacyOverlay;
    private View stealthDummyOverlay;
    private View ghostModeOverlay;
    private static final long GHOST_EXIT_HOLD_MS = 3000L;
    private final Handler ghostExitHandler = new Handler(Looper.getMainLooper());
    private Runnable ghostExitRunnable;

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
            com.livskompassen.app.core.KeyRecoveryManager.prepareRecoveryHardware(this);
            AppNotificationManager.createNotificationChannels(this);
        }).start();

        AppCheckDebugBootstrap.applyIfDebug(getApplicationContext());
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        
        // Våg 200: Titanium Inset Mastery — full-bleed edge-to-edge.
        // MUST keep bottom padding 0: Capacitor + androidDockInsetFix already apply
        // --safe-area-inset-bottom on the dock shell. Padding bars.bottom here
        // stacked a second inset and lifted the dock ~1 cm above the screen edge.
        androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content), (v, insets) -> {
            v.setPadding(0, 0, 0, 0);
            return insets;
        });

        initializeManagers();
        setupShakePanic();
        setupBackNavigation();
        setupBackgroundWork();
        
        // Handle initial intent
        handleInitialIntent(getIntent());
    }

    private void updateTaskDescription(boolean stealth) {
        if (stealth) {
            // Våg 140: Randomize fake notes content for realistic stealth
            randomizeStealthContent();

            // Våg 125: Neutral title and generic system icon for switcher stealth
            setTaskDescription(new android.app.ActivityManager.TaskDescription(
                "Anteckningar", 
                android.graphics.BitmapFactory.decodeResource(getResources(), R.drawable.widget_ic_note_discreet),
                0 // Use default color
            ));
        } else {
            setTaskDescription(new android.app.ActivityManager.TaskDescription("Livskompassen"));
        }
    }

    private void randomizeStealthContent() {
        if (stealthDummyOverlay == null) return;
        
        String[][] listPool = {
            {"Handla mat", "Ring tandläkaren", "Hämta paket", "Träning kl 18"},
            {"Köpa mjölk", "Tvätta bilen", "Boka klipptid", "Middag hos mamma"},
            {"Fixa kranen", "Svara på mail", "Skicka faktura", "Löpning 5km"},
            {"Städa källaren", "Vattna blommor", "Handla födelsedagspresent", "Soporna!"}
        };
        
        int index = new Random().nextInt(listPool.length);
        String[] items = listPool[index];
        
        TextView t1 = stealthDummyOverlay.findViewById(R.id.stealth_dummy_item_1);
        TextView t2 = stealthDummyOverlay.findViewById(R.id.stealth_dummy_item_2);
        TextView t3 = stealthDummyOverlay.findViewById(R.id.stealth_dummy_item_3);
        TextView t4 = stealthDummyOverlay.findViewById(R.id.stealth_dummy_item_4);
        
        if (t1 != null) t1.setText("• " + items[0]);
        if (t2 != null) t2.setText("• " + items[1]);
        if (t3 != null) t3.setText("• " + items[2]);
        if (t4 != null) t4.setText("• " + items[3]);
    }

    private void enterGhostMode() {
        if (ghostModeOverlay == null) return;
        ghostModeOverlay.setVisibility(View.VISIBLE);
        ghostModeOverlay.setClickable(true);
        ghostModeOverlay.setFocusable(true);

        View title = ghostModeOverlay.findViewById(R.id.ghost_title);
        if (title != null) {
            title.setContentDescription("Anteckningar");
            // Secret exit: hold title for 3s (default long-press is ~500ms — too easy).
            title.setOnTouchListener((v, event) -> {
                switch (event.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        cancelGhostExitHold();
                        ghostExitRunnable = this::requestGhostExit;
                        ghostExitHandler.postDelayed(ghostExitRunnable, GHOST_EXIT_HOLD_MS);
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        // Cancel if finger drifts off the title bounds
                        if (event.getX() < 0 || event.getY() < 0
                                || event.getX() > v.getWidth() || event.getY() > v.getHeight()) {
                            cancelGhostExitHold();
                        }
                        return true;
                    case MotionEvent.ACTION_UP:
                    case MotionEvent.ACTION_CANCEL:
                        cancelGhostExitHold();
                        return true;
                    default:
                        return false;
                }
            });
        }

        LCLog.w("GHOST MODE ACTIVE: Real UI is hidden.");
    }

    private void cancelGhostExitHold() {
        if (ghostExitRunnable != null) {
            ghostExitHandler.removeCallbacks(ghostExitRunnable);
            ghostExitRunnable = null;
        }
    }

    /**
     * Fail-closed: show Sacred Lock first; only dismiss ghost facade after unlock succeeds.
     * Immediate exitGhostMode would race and reveal the real UI before biometrics.
     */
    private void requestGhostExit() {
        cancelGhostExitHold();
        if (sacredLockManager == null) {
            LCLog.e("GHOST EXIT ABORTED: SacredLockManager missing — keeping facade.");
            return;
        }
        sacredLockManager.setOnUnlockSuccess(this::exitGhostMode);
        sacredLockManager.showLock();
    }

    private void exitGhostMode() {
        cancelGhostExitHold();
        if (ghostModeOverlay == null) return;
        ghostModeOverlay.animate().alpha(0f).setDuration(400).withEndAction(() -> {
            ghostModeOverlay.setVisibility(View.GONE);
            ghostModeOverlay.setAlpha(1f);
            ghostModeOverlay.setClickable(false);
        }).start();
        if (hapticManager != null) hapticManager.success();
        LCLog.d("GHOST MODE EXIT: Restoring real UI behind Sacred Lock.");
    }

    private void initializeManagers() {
        hapticManager = new HapticManager(this);
        batteryManager = new BatteryManager(this);
        connectivityIntelligence = new ConnectivityIntelligence(this);
        hapticManager.setBatteryManager(batteryManager);

        connectivityIntelligence.setNetworkStatusListener((isMetered, isRoaming) -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                runOnUiThread(() -> {
                    String js = String.format(
                        "window.dispatchEvent(new CustomEvent('livskompassen-network-change', {" +
                        "detail: { metered: %b, roaming: %b }" +
                        "}));", isMetered, isRoaming);
                    getBridge().getWebView().evaluateJavascript(js, null);
                    
                    if (!isMetered) {
                        getBridge().getWebView().evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('livskompassen-pre-cache'));", null);
                    }
                });
            }
        });

        batteryManager.setPowerSaveListener(isEnabled -> {
            if (parallaxManager != null) {
                parallaxManager.setBatteryPaused(isEnabled);
            }
        });

        systemUiManager = new SystemUiManager(this);
        // FLAG_SECURE only for sensitive picks / Valv — not whole-app default.
        // Always-on Sacred made recents/shade look "blurred" and blocked QA taps.
        systemUiManager.setSacredZone(false);

        themeManager = new ThemeManager(systemUiManager);
        integrityManager = new IntegrityManager(this);
        healthSentinel = new HealthSentinel(this, integrityManager);
        healthSentinel.performHealthCheck();
        
        zoneManager = new ZoneManager(this);
        parallaxManager = new ParallaxManager(this);
        integrityManager.setZoneManager(zoneManager);
        com.livskompassen.app.core.EmergencyManager emergencyManager = new com.livskompassen.app.core.EmergencyManager(this);
        
        memoryManager = new MemoryManager(this, getBridge());
        webViewManager = new WebViewManager(
                this, getBridge(), getWindow().getDecorView(), hapticManager, integrityManager, systemUiManager, fileChooserLauncher);
        sacredLockManager = new SacredLockManager(this, getBridge(), getWindow().getDecorView(), hapticManager, integrityManager);
        sessionSentry = new SessionSentry(getBridge(), sacredLockManager);
        shortcutManager = new ShortcutManager(this);

        // Våg 131: Connect Theme to Shortcuts
        themeManager.setOnPhaseChangeListener(phase -> {
            if (shortcutManager != null) {
                shortcutManager.updateContextualShortcuts(phase);
            }
        });

        backupManager = new com.livskompassen.app.core.BackupManager(this);
        focusManager = new FocusManager(this);
        shareManager = new com.livskompassen.app.core.SecureShareManager(this);
        searchManager = new SearchManager(this);
        iconManager = new com.livskompassen.app.core.IconManager(this);
        intelligenceManager = new IntelligenceManager(this);
        auraFlowManager = new AuraFlowManager(this, hapticManager, systemUiManager);
        
        projectionManager = new ProjectionManager(this, isProjecting -> {
            if (isProjecting) {
                LCLog.w(getString(R.string.log_security_projection_warning));
            }
        });
        projectionManager.start();
        
        forensicGuard = new ForensicGuard(this, sacredLockManager);
        forensicGuard.startMonitoring();

        widgetNavigator = new WidgetNavigator(getBridge(), getWindow().getDecorView());
        privacyOverlay = findViewById(R.id.privacy_overlay);
        stealthDummyOverlay = findViewById(R.id.stealth_dummy_container);
        ghostModeOverlay = findViewById(R.id.ghost_mode_container);

        // Våg 155: Stealth Alias detection + GhostLaunch secret-code entry
        android.content.ComponentName cn = getComponentName();
        Intent entryIntent = getIntent();
        boolean ghostFromDialer = entryIntent != null
            && entryIntent.getBooleanExtra(GhostLaunchReceiver.EXTRA_GHOST_ENTRY, false);
        if (ghostFromDialer
            || (cn != null && cn.getClassName().endsWith(".StealthActivity"))) {
            enterGhostMode();
        }

        // High-performance Bridge
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().addJavascriptInterface(
                new NativeInterface(hapticManager, systemUiManager, integrityManager, themeManager, sessionSentry, emergencyManager, shortcutManager, backupManager, focusManager, shareManager, connectivityIntelligence, sacredLockManager, healthSentinel, searchManager, iconManager, projectionManager, intelligenceManager, auraFlowManager),
                "LivskompassenNative"
            );
        }

        themeManager.applyCircadianTheme();

        checkSecurityStatus();
    }

    private void checkSecurityStatus() {
        if (SecurityUtils.isRooted()) LCLog.w(getString(R.string.security_warning_rooted));
        if (SecurityUtils.isAdbEnabled(this)) LCLog.w(getString(R.string.security_info_adb_enabled));
        if (SecurityUtils.isHookingDetected()) LCLog.e(getString(R.string.security_critical_hooking_detected));
        if (SecurityUtils.hasSuspiciousAccessibilityService(this)) LCLog.w(getString(R.string.security_warning_suspicious_accessibility));
    }

    private void handleEmergencyLock(Intent intent) {
        if (intent == null || !intent.getBooleanExtra("emergency_lock", false)) return;
        intent.removeExtra("emergency_lock");
        if (sacredLockManager != null) {
            sacredLockManager.triggerPanic(true);
        }
    }

    private void handleInitialIntent(Intent intent) {
        if (intent != null && intent.getBooleanExtra("emergency_lock", false)) {
            handleEmergencyLock(intent);
            return;
        }
        if (intent != null && Intent.ACTION_SEND.equals(intent.getAction()) && "text/plain".equals(intent.getType())) {
            handleShareIntent(intent);
        } else {
            widgetNavigator.handleIntent(intent);
        }
    }

    private void handleShareIntent(Intent intent) {
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText != null && !sharedText.isEmpty()) {
            LCLog.d(getString(R.string.log_received_shared_text, sharedText));
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
        LCLog.d(getString(R.string.log_work_manager_scheduled));
    }

    private long lastBackPressTime = 0;
    private static final long BACK_PRESS_INTERVAL = 2000;

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (ghostModeOverlay != null && ghostModeOverlay.getVisibility() == View.VISIBLE) {
                    return; // Ghost facade: back must not reveal the real UI
                }
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
        // Warm PanicTile (singleTask + CLEAR_TOP) lands here — must deep-lock.
        if (intent != null && intent.getBooleanExtra("emergency_lock", false)) {
            handleEmergencyLock(intent);
            return;
        }
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
        shakeDetector.setOnShakeListener(new ShakeDetector.OnShakeListener() {
            @Override
            public void onShake(int count) {
                if (count >= 2) {
                    LCLog.w(getString(R.string.log_shake_panic_detected));
                    if (hapticManager != null) hapticManager.error();
                    if (sacredLockManager != null) {
                        sacredLockManager.triggerPanic(true);
                    }
                }
            }

            @Override
            public void onTripleTap() {
                LCLog.w("Silent Panic triggered via Triple-Tap.");
                if (sacredLockManager != null) {
                    sacredLockManager.triggerPanic(true);
                }
                if (hapticManager != null) hapticManager.tick(null);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        updateTaskDescription(false);
        if (stealthDummyOverlay != null) stealthDummyOverlay.setVisibility(View.GONE);
        
        // Våg 215: Log usage pattern for pre-warming
        new Thread(() -> {
            int hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
            String key = "usage_hour_" + hour;
            android.content.SharedPreferences prefs = SecurityUtils.isSignatureAllowlisted(this) 
                ? com.livskompassen.app.util.SecurePrefs.get(this) : getSharedPreferences("pattern", MODE_PRIVATE);
            int count = prefs.getInt(key, 0);
            prefs.edit().putInt(key, count + 1).apply();
        }).start();

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
        cancelGhostExitHold();
        if (auraFlowManager != null) {
            auraFlowManager.stopFlow();
        }
        // Privacy/stealth full-screen covers on pause removed — they made the UI
        // look "blurred"/blocked on brief pauses (shade, Maestro, biometrics) and
        // felt broken on G85. Sensitive file picks still use WebViewManager overlay.
        // Recents title stealth (updateTaskDescription) stays.
        updateTaskDescription(true);
        if (sensorManager != null) {
            sensorManager.unregisterListener(shakeDetector);
        }
        if (parallaxManager != null) {
            parallaxManager.stop();
        }
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
        cancelGhostExitHold();
        if (auraFlowManager != null) {
            auraFlowManager.stopFlow();
        }
        if (projectionManager != null) projectionManager.stop();
        if (memoryManager != null) memoryManager.unregister();
        super.onDestroy();
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        // Delegated to MemoryManager which is registered via registerComponentCallbacks.
        // Direct cleanup here is redundant but kept as a thin safety layer for high-priority moderate trim.
        if (level == TRIM_MEMORY_MODERATE && getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().clearCache(false);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                LCLog.d(getString(R.string.log_record_audio_granted));
            }
        }
    }
}
