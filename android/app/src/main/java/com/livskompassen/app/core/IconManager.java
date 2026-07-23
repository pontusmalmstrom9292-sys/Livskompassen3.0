package com.livskompassen.app.core;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;
import com.livskompassen.app.util.LCLog;

/**
 * THE CHAMELEON GUARD - Våg 51.
 * Allows the app to dynamically change its home screen icon and name.
 */
public class IconManager {
    private final Context context;
    private final String packageName;

    public IconManager(Context context) {
        this.context = context;
        this.packageName = context.getPackageName();
    }

    /**
     * Switch launcher icons via activity-aliases only.
     * MainActivity stays enabled so deep links, share, widgets, and PanicTile keep working.
     */
    public void setStealthIcon(boolean useStealth) {
        PackageManager pm = context.getPackageManager();

        ComponentName defaultLauncher = new ComponentName(packageName, packageName + ".DefaultLauncherActivity");
        ComponentName stealthComponent = new ComponentName(packageName, packageName + ".StealthActivity");

        if (useStealth) {
            pm.setComponentEnabledSetting(stealthComponent,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
            pm.setComponentEnabledSetting(defaultLauncher,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            LCLog.w("IconManager: Switched to STEALTH ICON (Notes)");
        } else {
            pm.setComponentEnabledSetting(defaultLauncher,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
            pm.setComponentEnabledSetting(stealthComponent,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            LCLog.d("IconManager: Restored OFFICIAL ICON");
        }
    }
}
