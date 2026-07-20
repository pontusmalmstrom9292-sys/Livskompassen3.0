package com.livskompassen.app.core;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.graphics.drawable.Icon;
import android.os.Build;
import com.livskompassen.app.MainActivity;
import com.livskompassen.app.R;
import java.util.ArrayList;
import java.util.List;

/**
 * INTELLIGENT SHORTCUTS - Våg 22.
 * Dynamic shortcuts for long-press on app icon.
 * KEEP: resume path + dagens utvecklingskort must coexist (never wipe one when updating the other).
 */
public class ShortcutManager {
    private final Context context;
    private String lastPath = "";
    private String lastText = "";

    public ShortcutManager(Context context) {
        this.context = context;
    }

    /**
     * Uppdaterar "Fortsätt"-genvägen baserat på senaste sökväg i webbappen.
     * @param lastPath Sökvägen i webbappen användaren senast besökte.
     */
    public void updateDynamicShortcuts(String lastPath) {
        if (lastPath != null) {
            this.lastPath = lastPath;
        }
        updateAllShortcuts();
    }

    /**
     * Uppdaterar "Dagens kort"-genvägen utan att radera "Fortsätt".
     */
    public void updateUtvecklingskortShortcut(String text) {
        if (text != null) {
            this.lastText = text;
        }
        updateAllShortcuts();
    }

    private void updateAllShortcuts() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) return;

        android.content.pm.ShortcutManager shortcutManager =
                context.getSystemService(android.content.pm.ShortcutManager.class);

        if (shortcutManager == null) return;

        List<ShortcutInfo> shortcuts = new ArrayList<>();

        // 1. Resume Shortcut
        if (lastPath != null && !lastPath.isEmpty()) {
            Intent intent = new Intent(context, MainActivity.class);
            intent.setAction(Intent.ACTION_VIEW);
            intent.putExtra("widget_path", lastPath);

            shortcuts.add(new ShortcutInfo.Builder(context, "dynamic_resume")
                    .setShortLabel("Fortsätt")
                    .setLongLabel("Återuppta senaste session")
                    .setIcon(Icon.createWithResource(context, R.drawable.ic_lock_sacred))
                    .setIntent(intent)
                    .build());
        }

        // 2. Utvecklingskort Shortcut → open Mer för dig
        if (lastText != null && !lastText.isEmpty()) {
            Intent intent = new Intent(context, MainActivity.class);
            intent.setAction(Intent.ACTION_VIEW);
            intent.putExtra("widget_path", "/?expand_dev=true");

            String longLabel = lastText.length() > 40 ? lastText.substring(0, 37) + "..." : lastText;
            shortcuts.add(new ShortcutInfo.Builder(context, "dynamic_utv_kort")
                    .setShortLabel("Dagens kort")
                    .setLongLabel(longLabel)
                    .setIcon(Icon.createWithResource(context, R.drawable.widget_ic_wh8_moduler))
                    .setIntent(intent)
                    .build());
        }

        if (!shortcuts.isEmpty()) {
            shortcutManager.setDynamicShortcuts(shortcuts);
        }
    }
}
