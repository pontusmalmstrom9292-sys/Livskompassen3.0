package com.livskompassen.app.core;

import android.content.Intent;
import android.service.quicksettings.Tile;
import android.service.quicksettings.TileService;

import com.livskompassen.app.MainActivity;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * THE OMNI PANIC BUTTON - Våg 101.
 * @locked TITANIUM-BASE-CORE
 * One-tap lockdown from notification shade.
 */
public class PanicTileService extends TileService {

    @Override
    public void onStartListening() {
        super.onStartListening();
        Tile tile = getQsTile();
        if (tile != null) {
            tile.setState(Tile.STATE_ACTIVE);
            tile.setLabel("Säkra Nu");
            tile.updateTile();
        }
    }

    @Override
    public void onClick() {
        super.onClick();
        LCLog.w("PanicTileService: EMERGENCY LOCKDOWN TRIGGERED.");

        // 1. Force locked state in prefs
        SecurePrefs.get(this).edit().putBoolean("sacred_lock_state", true).apply();
        
        // 2. Clear sensitive status in widgets
        WidgetUpdateManager.updateWidgetContent(this, "last_action", "Systemet säkrat");
        
        // 3. Close app if open or trigger lock UI
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("emergency_lock", true);
        
        // We use a broadcast or specific extra that MainActivity handles in onNewIntent
        startActivityAndCollapse(intent);
    }
}
