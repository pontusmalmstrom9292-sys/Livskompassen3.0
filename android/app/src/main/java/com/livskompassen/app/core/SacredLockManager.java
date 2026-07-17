package com.livskompassen.app.core;

import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.Bridge;
import com.livskompassen.app.R;
import com.livskompassen.app.util.LCLog;

public class SacredLockManager {
    private static final long SACRED_LOCK_TIMEOUT_MS = 5 * 60 * 1000L; // 5 minuter

    private final FragmentActivity activity;
    private final Bridge bridge;
    private final LinearLayout lockContainer;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    private long lastBackgroundTime = 0L;
    private boolean isLocked = false;

    public SacredLockManager(FragmentActivity activity, Bridge bridge, View rootView) {
        this.activity = activity;
        this.bridge = bridge;
        this.lockContainer = rootView.findViewById(R.id.sacred_lock_container);
        
        setupUnlockButton();
    }

    private void setupUnlockButton() {
        if (lockContainer != null) {
            Button btnUnlock = lockContainer.findViewById(R.id.btn_unlock);
            if (btnUnlock != null) {
                btnUnlock.setOnClickListener(v -> authenticate());
            }
        }
    }

    public void onPause() {
        lastBackgroundTime = System.currentTimeMillis();
    }

    public void onResume() {
        if (lastBackgroundTime != 0L) {
            long backgroundDuration = System.currentTimeMillis() - lastBackgroundTime;
            if (backgroundDuration > SACRED_LOCK_TIMEOUT_MS) {
                showLock();
            }
            lastBackgroundTime = 0L;
        }
    }

    public void showLock() {
        isLocked = true;
        mainHandler.post(() -> {
            if (lockContainer != null) {
                lockContainer.setVisibility(View.VISIBLE);
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().setVisibility(View.GONE);
                }
                authenticate();
            }
        });
    }

    public void hideLock() {
        isLocked = false;
        mainHandler.post(() -> {
            if (lockContainer != null) {
                lockContainer.setVisibility(View.GONE);
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().setVisibility(View.VISIBLE);
                }
            }
        });
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void authenticate() {
        BiometricManager biometricManager = BiometricManager.from(activity);
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        
        if (biometricManager.canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            hideLock();
            return;
        }

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Lås upp Livskompassen")
                .setSubtitle("Valvet kräver autentisering")
                .setAllowedAuthenticators(authenticators)
                .build();

        BiometricPrompt biometricPrompt = new BiometricPrompt(activity, ContextCompat.getMainExecutor(activity),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        hideLock();
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        LCLog.w("Biometric error: " + errString);
                    }
                });

        biometricPrompt.authenticate(promptInfo);
    }
}
