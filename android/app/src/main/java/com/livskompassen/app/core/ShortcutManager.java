package com.livskompassen.app.core;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.graphics.drawable.Icon;
import android.os.Build;
import com.livskompassen.app.MainActivity;
import com.livskompassen.app.R;
import java.util.Arrays;

/**
 * INTELLIGENT SHORTCUTS - Våg 22.
 * Manages dynamic Android app shortcuts based on user behavior.
 */
public class ShortcutManager {
    private final Context context;

    public ShortcutManager(Context context) {
        this.context = context;
    }

    /**
     * Uppdaterar dynamiska genvägar.
     * @param lastPath Sökvägen i webbappen användaren senast besökte.
     */
    public void updateDynamicShortcuts(String lastPath) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) return;

        android.content.pm.ShortcutManager shortcutManager = 
                context.getSystemService(android.content.pm.ShortcutManager.class);

        if (shortcutManager == null) return;

        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.putExtra("widget_path", lastPath);

        ShortcutInfo dynamicShortcut = new ShortcutInfo.Builder(context, "dynamic_resume")
                .setShortLabel("Fortsätt")
                .setLongLabel("Återuppta senaste session")
                .setIcon(Icon.createWithResource(context, R.drawable.ic_lock_sacred)) // Placeholder
                .setIntent(intent)
                .build();

        shortcutManager.setDynamicShortcuts(Arrays.asList(dynamicShortcut));
    }
}
