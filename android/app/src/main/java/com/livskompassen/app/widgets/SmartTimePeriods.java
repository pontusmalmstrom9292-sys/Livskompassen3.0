package com.livskompassen.app.widgets;

import java.util.Calendar;

/**
 * Companion Smart Time — local period + accent hex for RemoteViews.
 * Aligns with {@code src/widgets/smart/smartTimeContext.ts} (WIDGET_BIBLE 5.3).
 * Periods (local clock): morning 07–12, midday 12–18, evening 18–22, night 22–07.
 * No core Theme dependency. Resolve on demand — never poll.
 */
public final class SmartTimePeriods {

    public enum DayPeriod {
        MORNING,
        MIDDAY,
        EVENING,
        NIGHT
    }

    /** Executive Midnight widget accents (period → hex). */
    public static final String ACCENT_MORNING = "#FDE68A";
    public static final String ACCENT_MIDDAY = "#D4AF37";
    public static final String ACCENT_EVENING = "#9A7B2F";
    public static final String ACCENT_NIGHT = "#7BA3C9"; // Ethereal Blue

    /** Night title dim — soft calm without disabling taps. */
    public static final float NIGHT_TITLE_ALPHA = 0.85f;
    public static final float DAY_TITLE_ALPHA = 1f;

    private SmartTimePeriods() {}

    /** Same rules as {@code resolveDayPeriod} in smartTimeContext.ts. */
    public static DayPeriod resolveDayPeriod() {
        return resolveDayPeriod(Calendar.getInstance());
    }

    public static DayPeriod resolveDayPeriod(Calendar cal) {
        int h = cal.get(Calendar.HOUR_OF_DAY);
        if (h >= 22 || h < 7) return DayPeriod.NIGHT;
        if (h >= 18) return DayPeriod.EVENING;
        if (h >= 12) return DayPeriod.MIDDAY;
        return DayPeriod.MORNING;
    }

    public static String accentHex() {
        return accentHex(resolveDayPeriod());
    }

    public static String accentHex(DayPeriod period) {
        switch (period) {
            case MORNING:
                return ACCENT_MORNING;
            case MIDDAY:
                return ACCENT_MIDDAY;
            case EVENING:
                return ACCENT_EVENING;
            case NIGHT:
            default:
                return ACCENT_NIGHT;
        }
    }

    public static int accentColorInt() {
        return android.graphics.Color.parseColor(accentHex());
    }

    public static float titleAlpha() {
        return resolveDayPeriod() == DayPeriod.NIGHT ? NIGHT_TITLE_ALPHA : DAY_TITLE_ALPHA;
    }
}
