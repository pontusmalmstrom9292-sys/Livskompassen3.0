package com.livskompassen.app.core;

import android.content.Intent;
import android.os.Build;
import android.webkit.JavascriptInterface;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.MainActivity;
import com.livskompassen.app.core.FloatingInkastService;
import com.livskompassen.app.core.KeyRecoveryManager;

/**
 * HIGH-PERFORMANCE BRIDGE.
 * @locked TITANIUM-BASE-CORE
 * Allows the Web App to call native functions with zero latency.
 */
public class NativeInterface {
    private final HapticManager hapticManager;
    private final SystemUiManager systemUiManager;
    private final IntegrityManager integrityManager;
    private final ThemeManager themeManager;
    private final SessionSentry sessionSentry;
    private final EmergencyManager emergencyManager;
    private final ShortcutManager shortcutManager;
    private final BackupManager backupManager;
    private final FocusManager focusManager;
    private final SecureShareManager shareManager;
    private final ConnectivityIntelligence connectivityIntelligence;
    private final SacredLockManager sacredLockManager;
    private final HealthSentinel healthSentinel;
    private final SearchManager searchManager;
    private final IconManager iconManager;
    private final ProjectionManager projectionManager;

    public NativeInterface(HapticManager hapticManager, SystemUiManager systemUiManager, IntegrityManager integrityManager, ThemeManager themeManager, SessionSentry sessionSentry, EmergencyManager emergencyManager, ShortcutManager shortcutManager, BackupManager backupManager, FocusManager focusManager, SecureShareManager shareManager, ConnectivityIntelligence connectivityIntelligence, SacredLockManager sacredLockManager, HealthSentinel healthSentinel, SearchManager searchManager, IconManager iconManager, ProjectionManager projectionManager) {
        this.hapticManager = hapticManager;
        this.systemUiManager = systemUiManager;
        this.integrityManager = integrityManager;
        this.themeManager = themeManager;
        this.sessionSentry = sessionSentry;
        this.emergencyManager = emergencyManager;
        this.shortcutManager = shortcutManager;
        this.backupManager = backupManager;
        this.focusManager = focusManager;
        this.shareManager = shareManager;
        this.connectivityIntelligence = connectivityIntelligence;
        this.sacredLockManager = sacredLockManager;
        this.healthSentinel = healthSentinel;
        this.searchManager = searchManager;
        this.iconManager = iconManager;
        this.projectionManager = projectionManager;
    }

    @JavascriptInterface
    public boolean isProjecting() {
        return projectionManager.isCurrentlyProjecting();
    }

    @JavascriptInterface
    public void setAppIconStealth(boolean active) {
        iconManager.setStealthIcon(active);
    }

    @JavascriptInterface
    public String getSystemHealth() {
        return healthSentinel.getHealthSummary();
    }

    @JavascriptInterface
    public boolean shouldRestrictData() {
        return connectivityIntelligence.shouldRestrictData();
    }

    @JavascriptInterface
    public void shareVaultFile(String content, String fileName, String mimeType) {
        shareManager.shareTextAsFile(content, fileName, mimeType);
    }

    /**
     * Exporterar den krypterade diagnostikloggen via systemets share-sheet.
     */
    @JavascriptInterface
    public void shareDiagnosticLog() {
        DiagnosticManager diag = DiagnosticManager.getInstance();
        if (diag != null) {
            java.io.File logFile = diag.getLogFile();
            if (logFile.exists()) {
                shareManager.shareFile(logFile, "diagnostic_log.txt", "text/plain");
            } else {
                LCLog.w("shareDiagnosticLog: Log file does not exist.");
            }
        }
    }

    /**
     * Share a Base64 payload (PDF etc.) via the system share sheet.
     * Used by dossier export on Android WebView where window.open fails.
     */
    @JavascriptInterface
    public void shareBase64File(String base64Payload, String fileName, String mimeType) {
        shareManager.shareBase64AsFile(base64Payload, fileName, mimeType);
    }

    /**
     * Enqueue an https download to the device Downloads folder (DownloadManager).
     * Non-https URLs are refused.
     */
    @JavascriptInterface
    public void downloadSecureUrl(String url, String fileName, String mimeType) {
        shareManager.enqueueHttpsDownload(url, fileName, mimeType);
    }

    @JavascriptInterface
    public boolean isDNDActive() {
        return focusManager.isDoNotDisturbActive();
    }

    @JavascriptInterface
    public void performEmergencyWipe() {
        emergencyManager.performEmergencyWipe();
    }

    @JavascriptInterface
    public void updateShortcuts(String lastPath) {
        shortcutManager.updateDynamicShortcuts(lastPath);
    }

    @JavascriptInterface
    public void updateUtvecklingskortShortcut(String text) {
        shortcutManager.updateUtvecklingskortShortcut(text);
    }

    @JavascriptInterface
    public void encryptForBackup(String data) {
        backupManager.encryptData(data, new BackupManager.BiometricEncryptionCallback() {
            @Override
            public void onSuccess(String encryptedData) {
                // Skicka tillbaka resultatet till JS
                LCLog.d("BackupManager: Encryption successful.");
            }

            @Override
            public void onError(String error) {
                LCLog.e("BackupManager: Encryption failed: " + error);
            }
        });
    }

    @JavascriptInterface
    public void userInteracted() {
        sessionSentry.userInteracted();
    }

    @JavascriptInterface
    public void triggerHaptic(String type) {
        systemUiManager.triggerFlashPulse(); // Visual confirm
        if ("success".equals(type)) hapticManager.success();
        else if ("error".equals(type)) hapticManager.error();
    }

    @JavascriptInterface
    public void setSystemTheme(String colorHex, boolean isDark) {
        systemUiManager.setSystemTheme(colorHex, isDark);
    }

    @JavascriptInterface
    public void log(String message) {
        LCLog.d(message);
    }

    @JavascriptInterface
    public int getSecurityScore() {
        return integrityManager.getSecurityScore();
    }

    @JavascriptInterface
    public boolean isHighRisk() {
        return integrityManager.isEnvironmentHighRisk();
    }

    @JavascriptInterface
    public String getCircadianPhase() {
        return themeManager.getCurrentPhase().name();
    }

    @JavascriptInterface
    public void syncTheme() {
        themeManager.applyCircadianTheme();
    }

    @JavascriptInterface
    public void triggerNavigationHaptic() {
        hapticManager.navigate();
    }

    @JavascriptInterface
    public void triggerRecordingHaptic() {
        hapticManager.recordingPulse();
    }

    @JavascriptInterface
    public void setWidgetData(String key, String value) {
        WidgetUpdateManager.updateWidgetContent(hapticManager.getContext(), key, value);
    }

    @JavascriptInterface
    public void setSacredZone(boolean isSacred) {
        systemUiManager.setSacredZone(isSacred);
    }

    @JavascriptInterface
    public void indexShortcut(String id, String label, String path) {
        searchManager.indexGenvag(id, label, path);
    }

    @JavascriptInterface
    public void searchShortcuts(String query) {
        searchManager.queryGenvagar(query, results -> {
            // Här kan vi skicka tillbaka resultaten till WebView via ett JS-anrop
            // För enkelhets skull loggar vi dem just nu, 
            // men i en fullständig impl. skulle vi köra webView.evaluateJavascript(...)
            LCLog.d("NativeInterface: Search for '%s' found %d results", query, results.size());
        });
    }

    @JavascriptInterface
    public void triggerPremiumNotification(String title, String message, String type) {
        // I framtiden: skicka med en boolean för 'sensitive' här
        String channelId = "sacred_vault_notifications".equals(type) ? 
                AppNotificationManager.CHANNEL_ID_VAULT : AppNotificationManager.CHANNEL_ID_DAILY;
        AppNotificationManager.showPremiumNotification(hapticManager.getContext(), title, message, channelId, hapticManager);
    }

    @JavascriptInterface
    public void setStealthMode(boolean active) {
        sacredLockManager.setStealthMode(active);
    }

    @JavascriptInterface
    public boolean isStealthModeActive() {
        return com.livskompassen.app.util.SecurePrefs.get(hapticManager.getContext()).getBoolean("stealth_mode_active", false);
    }

    @JavascriptInterface
    public boolean needsSecurityRecovery() {
        return KeyRecoveryManager.needsRecovery(hapticManager.getContext());
    }

    @JavascriptInterface
    public void resetSecurityRecovery() {
        KeyRecoveryManager.clearRecoveryStatus(hapticManager.getContext());
    }

    @JavascriptInterface
    public void rotateVaultKeys() {
        // Denna funktion kräver att användaren nyss gjort biometri
        com.livskompassen.app.util.SecurePrefs.rotateKeys(hapticManager.getContext());
    }

    @JavascriptInterface
    public void setFloatingBubble(boolean active) {
        android.content.Context context = hapticManager.getContext();
        Intent intent = new Intent(context, FloatingInkastService.class);
        if (active) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (android.provider.Settings.canDrawOverlays(context)) {
                    context.startService(intent);
                } else {
                    Intent overlayIntent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            android.net.Uri.parse("package:" + context.getPackageName()));
                    overlayIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(overlayIntent);
                }
            } else {
                context.startService(intent);
            }
        } else {
            context.stopService(intent);
        }
    }

    /** Cached FCM token for Drogfrihet sync (empty if unavailable). Refreshes async. */
    @JavascriptInterface
    public String getDrogfrihetFcmToken() {
        android.content.Context ctx = hapticManager.getContext();
        String cached = com.livskompassen.app.util.SecurePrefs.get(ctx)
                .getString(DrogfrihetFirebaseMessagingService.PREF_FCM_TOKEN, "");
        try {
            com.google.firebase.messaging.FirebaseMessaging.getInstance().getToken()
                    .addOnSuccessListener(token -> {
                        if (token != null && !token.isEmpty()) {
                            com.livskompassen.app.util.SecurePrefs.get(ctx).edit()
                                    .putString(DrogfrihetFirebaseMessagingService.PREF_FCM_TOKEN, token)
                                    .apply();
                        }
                    });
        } catch (Exception e) {
            LCLog.d("getDrogfrihetFcmToken: " + e.getMessage());
        }
        return cached != null ? cached : "";
    }

    /** Mirror opt-in prefs + schedule/cancel local WorkManager nudges. */
    @JavascriptInterface
    public void scheduleDrogfrihetNudges(boolean optIn, int quietStart, int quietEnd, int craveStart, int craveEnd) {
        DrogfrihetNudgeScheduler.applyPrefs(
                hapticManager.getContext(), optIn, quietStart, quietEnd, craveStart, craveEnd);
    }
}
