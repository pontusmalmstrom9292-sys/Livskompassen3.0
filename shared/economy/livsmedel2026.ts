/**
 * Livsmedelsavtalet / PontusArbetsapp — inkomstår 2026.
 * Konstanter + härledning via PayProfileContext (ingen hårdkodad lön i regler).
 */
import {
  DEFAULT_MONTHLY_SALARY_SEK,
  DAILY_WORK_HOURS,
  deriveDailyRate,
  deriveHourlyRate,
  PBB_2026_SEK,
} from './payProfileContext';

/** @deprecated Använd buildPayProfileContext — kvar för golden bakåtkomp. */
export const BASE_SALARY_SEK = DEFAULT_MONTHLY_SALARY_SEK;

export { PBB_2026_SEK };

export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_YEAR = 52;
export const HOURS_PER_WEEK = 40;
export const DAYS_PER_YEAR = 365;

/** @deprecated Härleds från profil — golden fixtures använder defaultlön. */
export const HOURLY_RATE_SEK = deriveHourlyRate(DEFAULT_MONTHLY_SALARY_SEK);

/** @deprecated Härleds från profil */
export const DAILY_RATE_SEK = deriveDailyRate(DEFAULT_MONTHLY_SALARY_SEK);

/** Karens första sjukdagen (timmar) — fallback om pass saknar timmar. */
export const SICK_KARENS_HOURS = 8;

/** Karens upphävs efter detta antal karensdagar på 365 dagar. */
export const SICK_KARENS_WAIVER_AFTER_DAYS = 10;

export const SICK_LOOKBACK_DAYS = 365;

/** @deprecated Använd agreementConfig.sickDay2_14EmployerLossFraction */
export const SICK_DAY2_14_EMPLOYER_LOSS_FRACTION = 0.2;

/** @deprecated Använd agreementConfig.vabNetReplacementFraction */
export const VAB_NET_REPLACEMENT_FRACTION = 0.8 * 0.7;

export { DAILY_WORK_HOURS };

/** Jämn ISO-vecka (partall). */
export const EVEN_WEEK_TARGET_HOURS = 30;

/** Ojämn ISO-vecka (udda). */
export const ODD_WEEK_TARGET_HOURS = 50;

export const LONG_SHIFT_THRESHOLD_HOURS = 5;

export const LONG_SHIFT_BREAK_MINUTES = 30;

export const ABSENCE_CATEGORIES = ['Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'] as const;

export type AbsenceCategory = (typeof ABSENCE_CATEGORIES)[number];
