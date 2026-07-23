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
    /** Epoch ms when deep-lock cooldown ends (after ≥5 failed attempts). */
    private static final String PREF_DEEP_LOCK_UNTIL_MS = "deep_lock_until_ms";
    /**
     * Ignore brief pauses (BiometricPrompt, notification shade, system dialogs).
     * Matches JS NATIVE_BACKGROUND_LOCK_MS — without this, unlock/shade kick Valvet.
     */
    private static final long BACKGROUND_GRACE_MS = 3_000L;
    /** Timed cooldown after deep lock so the user is not stuck forever. */
    private static final long DEEP_LOCK_COOLDOWN_MS = 60_000L;

    private final FragmentActivity activity;
    private final Bridge bridge;
    private final LinearLayout lockContainer;
    private final HapticManager hapticManager;
    private final IntegrityManager integrityManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private BiometricPrompt currentPrompt;
    private Runnable countdownRunnable;
    /** One-shot: run after successful biometric unlock (e.g. ghost-mode exit). */
    private Runnable unlockSuccessListener;
    
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

    /** Register a one-shot callback invoked after {@link #hideLock()} on auth success. */
    public void setOnUnlockSuccess(Runnable listener) {
        this.unlockSuccessListener = listener;
    }

    private void restoreState() {
        // Touch SecurePrefs first so degraded flag is accurate, then fail-closed.
        android.content.SharedPreferences prefs = SecurePrefs.get(activity);
        if (SecurePrefs.isDegraded()) {
            LCLog.e(activity.getString(R.string.log_lock_secure_prefs_degraded));
            showLock();
            return;
        }
        boolean wasLocked = prefs.getBoolean(PREF_LOCKED_STATE, false);
        if (wasLocked) {
            LCLog.d(activity.getString(R.string.log_lock_restoring_state));
            showLock();
        }
    }

    private void saveState(boolean locked) {
        SecurePrefs.get(activity).edit().putBoolean(PREF_LOCKED_STATE, locked).apply();
    }

    public void setStealthMode(boolean active) {
        SecurePrefs.get(activity).edit().putBoolean("stealth_mode_active", active).apply();
        LCLog.w(activity.getString(R.string.log_lock_stealth_mode_changed, active));
    }

    private void setupUnlockButton() {
        if (lockContainer != null) {
            Button btnUnlock = lockContainer.findViewById(R.id.btn_unlock);
            if (btnUnlock != null) {
                btnUnlock.setOnClickListener(v -> {
                    if (isDeepLocked()) {
                        hapticManager.error();
                        return;
                    }
                    hapticManager.lightClick(v);
                    authenticate();
                });
            }
        }
    }

    private void startCountdownTimer() {
        if (countdownRunnable != null) mainHandler.removeCallbacks(countdownRunnable);
        
        countdownRunnable = new Runnable() {
            @Override
            public void run() {
                long remaining = deepLockRemainingMs();
                if (remaining > 0) {
                    long sec = (remaining + 999L) / 1000L;
                    updateUnlockButtonText(activity.getString(R.string.lock_too_many_attempts, sec));
                    mainHandler.postDelayed(this, 1000L);
                } else {
                    resetFailedAttempts();
                    updateUnlockButtonText(activity.getString(R.string.btn_unlock));
                }
            }
        };
        mainHandler.post(countdownRunnable);
    }

    private void updateUnlockButtonText(String text) {
        if (lockContainer != null) {
            Button btnUnlock = lockContainer.findViewById(R.id.btn_unlock);
            if (btnUnlock != null) btnUnlock.setText(text);
        }
    }

    private boolean isDeepLocked() {
        long untilMs = SecurePrefs.get(activity).getLong(PREF_DEEP_LOCK_UNTIL_MS, 0L);
        long now = System.currentTimeMillis();
        if (untilMs > now) {
            startCountdownTimer();
            return true;
        }
        if (untilMs > 0L) {
            // Cooldown expired — clear fail count so the user can try again.
            resetFailedAttempts();
            updateUnlockButtonText(activity.getString(R.string.btn_unlock));
            return false;
        }
        int attempts = SecurePrefs.get(activity).getInt(PREF_FAILED_ATTEMPTS, 0);
        if (attempts >= 5) {
            // Orphan state (attempts≥5, untilMs==0): restore cooldown — never countdown-reset-to-unlock.
            SecurePrefs.get(activity).edit()
                    .putLong(PREF_DEEP_LOCK_UNTIL_MS, now + DEEP_LOCK_COOLDOWN_MS)
                    .apply();
            startCountdownTimer();
            return true;
        }
        return false;
    }

    private long deepLockRemainingMs() {
        long untilMs = SecurePrefs.get(activity).getLong(PREF_DEEP_LOCK_UNTIL_MS, 0L);
        return Math.max(0L, untilMs - System.currentTimeMillis());
    }

    private void incrementFailedAttempts() {
        android.content.SharedPreferences prefs = SecurePrefs.get(activity);
        int attempts = prefs.getInt(PREF_FAILED_ATTEMPTS, 0) + 1;
        android.content.SharedPreferences.Editor edit = prefs.edit().putInt(PREF_FAILED_ATTEMPTS, attempts);
        if (attempts >= 5) {
            edit.putLong(PREF_DEEP_LOCK_UNTIL_MS, System.currentTimeMillis() + DEEP_LOCK_COOLDOWN_MS);
            startCountdownTimer();
        }
        edit.apply();
    }

    /**
     * Forensic / panic path: force deep lock via SecurePrefs only (never plaintext prefs).
     */
    public void forceDeepLock() {
        SecurePrefs.get(activity).edit()
                .putInt(PREF_FAILED_ATTEMPTS, 5)
                .putLong(PREF_DEEP_LOCK_UNTIL_MS, System.currentTimeMillis() + DEEP_LOCK_COOLDOWN_MS)
                .apply();
        startCountdownTimer();
        showLock();
    }

    /** Unified panic entry — deep=true uses cooldown + lock UI. */
    public void triggerPanic(boolean deep) {
        if (deep) {
            forceDeepLock();
        } else {
            showLock();
        }
    }

    private void resetFailedAttempts() {
        if (countdownRunnable != null) mainHandler.removeCallbacks(countdownRunnable);
        SecurePrefs.get(activity).edit()
                .putInt(PREF_FAILED_ATTEMPTS, 0)
                .putLong(PREF_DEEP_LOCK_UNTIL_MS, 0L)
                .apply();
    }

    public void onPause() {
        if (countdownRunnable != null) mainHandler.removeCallbacks(countdownRunnable);
        // Do NOT cancelAuthentication() here — BiometricPrompt pauses the Activity.
        // Cancelling mid-prompt aborts unlock and feels like a Valvet kickout.
        lastBackgroundTime = System.currentTimeMillis();
    }

    public void onResume() {
        if (isLocked) {
            showLock();
            if (isDeepLocked()) startCountdownTimer();
            return;
        }
        
        // Våg 48: If we were in the middle of auth, re-trigger it
        if (lockContainer != null && lockContainer.getVisibility() == View.VISIBLE) {
            if (isDeepLocked()) startCountdownTimer();
            else authenticate();
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
                LCLog.d(activity.getString(R.string.log_lock_idle_timeout));
                showLock();
            }
            lastBackgroundTime = 0L;
        }
    }

    public void showLock() {
        isLocked = true;
        saveState(true);

        // Våg 83: Re-verify integrity on every Vault lock to prevent runtime tampering
        IdentityManager.verifyAppIntegrity(activity);

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
                
                if (isDeepLocked()) startCountdownTimer();
                else authenticate();
            }
        });
    }

    public void hideLock() {
        isLocked = false;
        saveState(false);
        if (countdownRunnable != null) mainHandler.removeCallbacks(countdownRunnable);
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
                updateUnlockButtonText(activity.getString(R.string.lock_unavailable_message));
            }
        });
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void authenticate() {
        if (isDeepLocked()) return;
        
        BiometricManager biometricManager = BiometricManager.from(activity);
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        int canAuth = biometricManager.canAuthenticate(authenticators);

        // Fail-closed: never unlock when biometrics/device credential are unavailable.
        if (canAuth != BiometricManager.BIOMETRIC_SUCCESS) {
            LCLog.e(activity.getString(R.string.log_lock_auth_unavailable, canAuth));
            hapticManager.error();
            ensureLockedUi();
            return;
        }

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle(activity.getString(R.string.lock_prompt_title))
                .setSubtitle(activity.getString(R.string.lock_prompt_subtitle))
                .setAllowedAuthenticators(authenticators)
                .build();

        currentPrompt = new BiometricPrompt(activity, ContextCompat.getMainExecutor(activity),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        currentPrompt = null;
                        LCLog.d(activity.getString(R.string.log_lock_auth_success));
                        hapticManager.success();
                        resetFailedAttempts();
                        hideLock();
                        Runnable pending = unlockSuccessListener;
                        unlockSuccessListener = null;
                        if (pending != null) {
                            mainHandler.post(pending);
                        }
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        currentPrompt = null;
                        LCLog.w(activity.getString(R.string.log_lock_auth_error, errString));
                        
                        if (errorCode == BiometricPrompt.ERROR_LOCKOUT || errorCode == BiometricPrompt.ERROR_LOCKOUT_PERMANENT) {
                            hapticManager.error();
                            incrementFailedAttempts();
                        } else if (errorCode != BiometricPrompt.ERROR_USER_CANCELED && errorCode != BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                            hapticManager.error();
                        }
                        
                        if (isDeepLocked()) {
                            showVisualDistress();
                        }
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        LCLog.w(activity.getString(R.string.log_lock_auth_failed));
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
