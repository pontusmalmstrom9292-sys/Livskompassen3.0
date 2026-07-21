package com.livskompassen.app.core;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.livskompassen.app.util.SecurePrefs;

import java.util.Calendar;

/** Local OS nudge inside craving windows; respects quiet hours. No craving content logged. */
public class DrogfrihetNudgeWorker extends Worker {
    public static final String PREF_OPT_IN = "df_notif_opt_in";
    public static final String PREF_QUIET_START = "df_quiet_start";
    public static final String PREF_QUIET_END = "df_quiet_end";
    public static final String PREF_CRAVE_START = "df_crave_start";
    public static final String PREF_CRAVE_END = "df_crave_end";
    public static final String PREF_LAST_NUDGE_DAY = "df_last_nudge_day";

    public DrogfrihetNudgeWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @Override
    public Result doWork() {
        SharedPreferences prefs = SecurePrefs.get(getApplicationContext());
        if (!prefs.getBoolean(PREF_OPT_IN, false)) return Result.success();

        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        int quietStart = prefs.getInt(PREF_QUIET_START, 22);
        int quietEnd = prefs.getInt(PREF_QUIET_END, 7);
        int craveStart = prefs.getInt(PREF_CRAVE_START, 17);
        int craveEnd = prefs.getInt(PREF_CRAVE_END, 19);

        if (inWindow(hour, quietStart, quietEnd)) return Result.success();
        if (!inWindow(hour, craveStart, craveEnd)) return Result.success();

        int day = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        if (prefs.getInt(PREF_LAST_NUDGE_DAY, -1) == day) return Result.success();

        AppNotificationManager.showDrogfrihetNotification(
                getApplicationContext(),
                "Livskompassen",
                "Ett ankare finns här.",
                null
        );
        prefs.edit().putInt(PREF_LAST_NUDGE_DAY, day).apply();
        return Result.success();
    }

    private static boolean inWindow(int hour, int start, int end) {
        if (start == end) return false;
        if (start < end) return hour >= start && hour < end;
        return hour >= start || hour < end;
    }
}
