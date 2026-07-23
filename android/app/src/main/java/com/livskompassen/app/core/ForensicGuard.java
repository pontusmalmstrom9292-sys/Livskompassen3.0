package com.livskompassen.app.core;

import android.app.Activity;
import android.os.Build;
import android.view.WindowManager;
import com.livskompassen.app.util.LCLog;

/**
 * THE FORENSIC GUARD - Våg 20.
 * @locked TITANIUM-BASE-CORE
 * Detects and prevents unauthorized screen capture or recording.
 */
public class ForensicGuard {
    private final Activity activity;
    private final SacredLockManager lockManager;
    private int violationCount = 0;
    private static final int MAX_VIOLATIONS = 3;

    public ForensicGuard(Activity activity, SacredLockManager lockManager) {
        this.activity = activity;
        this.lockManager = lockManager;
    }

    /**
     * Registrerar lyssnare för skärmdumpar (Android 14+).
     */
    public void startMonitoring() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            activity.registerScreenCaptureCallback(activity.getMainExecutor(), () -> {
                violationCount++;
                LCLog.w("ForensicGuard: Screen capture detected! violationCount=" + violationCount);
                
                if (lockManager != null) {
                    if (violationCount >= MAX_VIOLATIONS) {
                        LCLog.e("ForensicGuard: CRITICAL THRESHOLD REACHED. Forcing deep lock.");
                        lockManager.forceDeepLock();
                    } else {
                        lockManager.showLock();
                    }
                }
                // Trigger a panic haptic if available
                new HapticManager(activity).error();
            });
        }
    }

    /**
     * Statisk härdning som förhindrar skärmdumpar på systemnivå.
     */
    public void setSecure(boolean secure) {
        activity.runOnUiThread(() -> {
            if (secure) {
                activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
            } else {
                activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
            }
        });
    }
}
