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

        // 1. Force locked + deep-lock cooldown in SecurePrefs (fail-closed before Activity may warm-start)
        SecurePrefs.get(this).edit()
                .putBoolean("sacred_lock_state", true)
                .putInt("failed_biometric_attempts", 5)
                .putLong("deep_lock_until_ms", System.currentTimeMillis() + 60_000L)
                .apply();
        
        // 2. Clear sensitive status in widgets
        WidgetUpdateManager.updateWidgetContent(this, "last_action", "Systemet säkrat");
        
        // 3. Close app if open or trigger lock UI
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("emergency_lock", true);
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            android.app.PendingIntent pi = android.app.PendingIntent.getActivity(this, 999, intent, 
                android.app.PendingIntent.FLAG_IMMUTABLE | android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            startActivityAndCollapse(pi);
        } else {
            startActivityAndCollapse(intent);
        }
    }
}
