package com.livskompassen.app.core;

import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.Bridge;
import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * CRITICAL COMPONENT - DO NOT REMOVE OR MODIFY WITHOUT ARCHITECT APPROVAL.
 * This class manages the biometric security layer (Sacred Lock) for the app.
 * It ensures the Vault remains inaccessible without proper authentication.
 */
public class SacredLockManager {
    private static final String PREF_LOCKED_STATE = "sacred_lock_state";
    private static final String PREF_FAILED_ATTEMPTS = "failed_biometric_attempts";
    /**
     * Ignore brief pauses (BiometricPrompt, notification shade, system dialogs).
     * Matches JS NATIVE_BACKGROUND_LOCK_MS — without this, unlock/shade kick Valvet.
     */
    private static final long BACKGROUND_GRACE_MS = 3_000L;

    private final FragmentActivity activity;
    private final Bridge bridge;
    private final LinearLayout lockContainer;
    private final HapticManager hapticManager;
    private final IntegrityManager integrityManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private BiometricPrompt currentPrompt;
    
    private long lastBackgroundTime = 0L;
    private boolean isLocked = false;

    public SacredLockManager(FragmentActivity activity, Bridge bridge, View rootView, HapticManager hapticManager, IntegrityManager integrityManager) {
        this.activity = activity;
        this.bridge = bridge;
        this.hapticManager = hapticManager;
        this.integrityManager = integrityManager;
        this.lockContainer = rootView.findViewById(R.id.sacred_lock_container);
        
        setupUnlockButton();
        restoreState();
    }

    private void restoreState() {
        // Touch SecurePrefs first so degraded flag is accurate, then fail-closed.
        android.content.SharedPreferences prefs = SecurePrefs.get(activity);
        if (SecurePrefs.isDegraded()) {
            LCLog.e("SacredLockManager: SecurePrefs degraded — forcing lock.");
            showLock();
            return;
        }
        boolean wasLocked = prefs.getBoolean(PREF_LOCKED_STATE, false);
        if (wasLocked) {
            LCLog.d("SacredLockManager: Restoring persistent locked state.");
            showLock();
        }
    }

    private void saveState(boolean locked) {
        SecurePrefs.get(activity).edit().putBoolean(PREF_LOCKED_STATE, locked).apply();
    }

    public void setStealthMode(boolean active) {
        SecurePrefs.get(activity).edit().putBoolean("stealth_mode_active", active).apply();
        LCLog.w("SacredLockManager: Stealth Mode state changed to " + active);
    }

    private void setupUnlockButton() {
        if (lockContainer != null) {
            Button btnUnlock = lockContainer.findViewById(R.id.btn_unlock);
            if (btnUnlock != null) {
                btnUnlock.setOnClickListener(v -> {
                    if (isDeepLocked()) {
                        hapticManager.error();
                        Toast.makeText(activity, "För många misslyckade försök. Vänta en stund.", Toast.LENGTH_LONG).show();
                        return;
                    }
                    hapticManager.lightClick(v);
                    authenticate();
                });
            }
        }
    }

    private boolean isDeepLocked() {
        int attempts = SecurePrefs.get(activity).getInt(PREF_FAILED_ATTEMPTS, 0);
        return attempts >= 5;
    }

    private void incrementFailedAttempts() {
        int attempts = SecurePrefs.get(activity).getInt(PREF_FAILED_ATTEMPTS, 0);
        SecurePrefs.get(activity).edit().putInt(PREF_FAILED_ATTEMPTS, attempts + 1).apply();
    }

    private void resetFailedAttempts() {
        SecurePrefs.get(activity).edit().putInt(PREF_FAILED_ATTEMPTS, 0).apply();
    }

    public void onPause() {
        // Do NOT cancelAuthentication() here — BiometricPrompt pauses the Activity.
        // Cancelling mid-prompt aborts unlock and feels like a Valvet kickout.
        lastBackgroundTime = System.currentTimeMillis();
    }

    public void onResume() {
        if (isLocked) {
            showLock();
            return;
        }
        
        // Våg 48: If we were in the middle of auth, re-trigger it
        if (lockContainer != null && lockContainer.getVisibility() == View.VISIBLE) {
            authenticate();
            return;
        }

        if (lastBackgroundTime != 0L) {
            long backgroundDuration = System.currentTimeMillis() - lastBackgroundTime;
            // Floor at BACKGROUND_GRACE_MS so biometric/shade blips never re-lock.
            long dynamicTimeout = Math.max(
                    integrityManager.getRecommendedLockTimeout(),
                    BACKGROUND_GRACE_MS
            );
            if (backgroundDuration > dynamicTimeout) {
                LCLog.d("SacredLockManager: Idle timeout reached. Triggering lock.");
                showLock();
            }
            lastBackgroundTime = 0L;
        }
    }

    public void showLock() {
        isLocked = true;
        saveState(true);

        // Våg 49: Request memory sanitization immediately on lock
        if (activity instanceof com.livskompassen.app.MainActivity) {
            MemoryManager mm = ((com.livskompassen.app.MainActivity) activity).getMemoryManager();
            if (mm != null) mm.sanitizeMemory();
        }

        mainHandler.post(() -> {
            if (lockContainer != null && lockContainer.getVisibility() != View.VISIBLE) {
                // Instantly hide content to prevent flicker
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().setVisibility(View.GONE);
                    bridge.getWebView().setAlpha(0f);
                }

                lockContainer.setAlpha(0f);
                lockContainer.setVisibility(View.VISIBLE);
                lockContainer.animate().alpha(1f).setDuration(200).start();
                
                authenticate();
            }
        });
    }

    public void hideLock() {
        isLocked = false;
        saveState(false);
        mainHandler.post(() -> {
            if (lockContainer != null && lockContainer.getVisibility() == View.VISIBLE) {
                lockContainer.animate().alpha(0f).setDuration(300).withEndAction(() -> 
                    lockContainer.setVisibility(View.GONE)
                ).start();
                
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().setVisibility(View.VISIBLE);
                    bridge.getWebView().setAlpha(0f);
                    bridge.getWebView().animate().alpha(1f).setDuration(300).start();
                }
            }
        });
    }

    /**
     * Fail-closed UI: keep Vault obscured without re-entering authenticate().
     * Used when biometrics/device credential are unavailable.
     */
    private void ensureLockedUi() {
        isLocked = true;
        saveState(true);
        mainHandler.post(() -> {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().setVisibility(View.GONE);
                bridge.getWebView().setAlpha(0f);
            }
            if (lockContainer != null) {
                lockContainer.setAlpha(1f);
                lockContainer.setVisibility(View.VISIBLE);
            }
        });
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void authenticate() {
        BiometricManager biometricManager = BiometricManager.from(activity);
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        int canAuth = biometricManager.canAuthenticate(authenticators);

        // Fail-closed: never unlock when biometrics/device credential are unavailable.
        if (canAuth != BiometricManager.BIOMETRIC_SUCCESS) {
            LCLog.e("SacredLockManager: Auth unavailable (code=" + canAuth + "). Keeping Vault locked.");
            hapticManager.error();
            ensureLockedUi();
            Toast.makeText(
                    activity,
                    "Valvet förblir låst. Aktivera fingeravtryck, ansikte eller PIN på telefonen.",
                    Toast.LENGTH_LONG
            ).show();
            return;
        }

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Lås upp Livskompassen")
                .setSubtitle("Valvet kräver autentisering")
                .setAllowedAuthenticators(authenticators)
                .build();

        currentPrompt = new BiometricPrompt(activity, ContextCompat.getMainExecutor(activity),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        currentPrompt = null;
                        LCLog.d("SacredLockManager: Biometric Auth SUCCESS");
                        hapticManager.success();
                        resetFailedAttempts();
                        hideLock();
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        currentPrompt = null;
                        LCLog.w("SacredLockManager: Biometric Auth ERROR: " + errString);
                        hapticManager.error();
                        incrementFailedAttempts();
                        
                        if (isDeepLocked()) {
                            showVisualDistress();
                        }
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        LCLog.w("SacredLockManager: Biometric Auth FAILED (Invalid finger/face)");
                        hapticManager.error();
                        incrementFailedAttempts();
                    }
                });

        currentPrompt.authenticate(promptInfo);
    }

    private void showVisualDistress() {
        mainHandler.post(() -> {
            if (lockContainer != null) {
                View icon = lockContainer.findViewById(R.id.sacred_lock_container); // Eller specifik ikon
                if (icon != null) {
                    icon.setBackgroundColor(android.graphics.Color.argb(40, 255, 0, 0));
                    mainHandler.postDelayed(() -> icon.setBackgroundColor(android.graphics.Color.TRANSPARENT), 500);
                }
            }
        });
    }
}
