package com.livskompassen.app.core;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.graphics.drawable.Icon;
import android.os.Build;
import androidx.annotation.RequiresApi;

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
    private ThemeManager.CircadianPhase currentPhase = ThemeManager.CircadianPhase.DAY;

    public ShortcutManager(Context context) {
        this.context = context;
    }

    /**
     * Våg 130: Uppdaterar genvägar baserat på dygnsrytm.
     */
    public void updateContextualShortcuts(ThemeManager.CircadianPhase phase) {
        this.currentPhase = phase;
        updateAllShortcuts();
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

        // 1. Contextual Shortcut (Based on Phase)
        addContextualShortcut(shortcuts);

        // 2. Resume Shortcut
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

        // 3. Utvecklingskort Shortcut → open Mer för dig
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
            // Android allows up to 4 dynamic shortcuts
            List<ShortcutInfo> result = shortcuts;
            if (result.size() > 4) {
                result = result.subList(0, 4);
            }
            shortcutManager.setDynamicShortcuts(result);
        }
    }

    @RequiresApi(Build.VERSION_CODES.N_MR1)
    private void addContextualShortcut(List<ShortcutInfo> list) {
        String id, label, path;
        int iconRes;

        switch (currentPhase) {
            case MORNING:
                id = "ctx_morning";
                label = "Morgonmix";
                path = "/mix/morgon";
                iconRes = R.drawable.widget_chip_kompass;
                break;
            case DUSK:
            case NIGHT:
                id = "ctx_evening";
                label = "Kvällsrutin";
                path = "/rutin/kvall";
                iconRes = R.drawable.widget_ic_lotus_ethereal;
                break;
            default:
                id = "ctx_day";
                label = "Dagens Fokus";
                path = "/widget/kompass";
                iconRes = R.drawable.widget_ic_anchor_gold;
                break;
        }

        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.putExtra("widget_path", path);

        list.add(new ShortcutInfo.Builder(context, id)
                .setShortLabel(label)
                .setIcon(Icon.createWithResource(context, iconRes))
                .setIntent(intent)
                .build());
    }
}
