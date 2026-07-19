package com.livskompassen.app.core;

import android.app.ActivityManager;
import android.content.Context;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;
import java.io.File;
import java.util.List;

/**
 * THE KILL SWITCH - Våg 21.
 * Provides functionality to remotely or locally wipe sensitive data in case of compromise.
 */
public class EmergencyManager {
    private final Context context;

    public EmergencyManager(Context context) {
        this.context = context.getApplicationContext();
    }

    /**
     * Genomför en fullständig radering av all känslig lokal data.
     */
    public void performEmergencyWipe() {
        LCLog.w("EMERGENCY: Initiating full data wipe!");

        try {
            // 1. Rensa krypterade inställningar
            SecurePrefs.get(context).edit().clear().apply();

            // 2. Rensa WebView-data
            android.webkit.WebStorage.getInstance().deleteAllData();
            
            // 3. Radera filer
            deleteRecursive(context.getFilesDir());
            deleteRecursive(context.getCacheDir());

            LCLog.w("EMERGENCY: Wipe complete. Closing app.");

            // 4. Stäng appen
            ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
            if (am != null) {
                List<ActivityManager.AppTask> tasks = am.getAppTasks();
                if (tasks != null && !tasks.isEmpty()) {
                    tasks.get(0).finishAndRemoveTask();
                }
            }
            
            // Fallback
            System.exit(0);
        } catch (Exception e) {
            LCLog.e("EMERGENCY: Wipe failed: " + e.getMessage());
        }
    }

    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory == null || !fileOrDirectory.exists()) return;
        
        if (fileOrDirectory.isDirectory()) {
            File[] children = fileOrDirectory.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        fileOrDirectory.delete();
    }
}
