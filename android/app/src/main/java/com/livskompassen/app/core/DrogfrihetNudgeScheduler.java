package com.livskompassen.app.core;

import android.content.Context;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.livskompassen.app.util.SecurePrefs;

import java.util.concurrent.TimeUnit;

public final class DrogfrihetNudgeScheduler {
    private static final String UNIQUE = "drogfrihet_nudge";

    private DrogfrihetNudgeScheduler() {}

    public static void applyPrefs(Context context, boolean optIn, int quietStart, int quietEnd, int craveStart, int craveEnd) {
        SecurePrefs prefs = SecurePrefs.get(context);
        prefs.edit()
                .putBoolean(DrogfrihetNudgeWorker.PREF_OPT_IN, optIn)
                .putInt(DrogfrihetNudgeWorker.PREF_QUIET_START, quietStart)
                .putInt(DrogfrihetNudgeWorker.PREF_QUIET_END, quietEnd)
                .putInt(DrogfrihetNudgeWorker.PREF_CRAVE_START, craveStart)
                .putInt(DrogfrihetNudgeWorker.PREF_CRAVE_END, craveEnd)
                .apply();

        WorkManager wm = WorkManager.getInstance(context);
        if (!optIn) {
            wm.cancelUniqueWork(UNIQUE);
            return;
        }
        PeriodicWorkRequest req = new PeriodicWorkRequest.Builder(
                DrogfrihetNudgeWorker.class, 1, TimeUnit.HOURS)
                .addTag(UNIQUE)
                .build();
        wm.enqueueUniquePeriodicWork(UNIQUE, ExistingPeriodicWorkPolicy.UPDATE, req);
    }
}
