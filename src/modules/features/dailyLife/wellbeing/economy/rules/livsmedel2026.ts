/**
 * Livsmedelsavtalet / PontusArbetsapp — inkomstår 2026.
 * Fas 1: stämpel. Fas 2: lön, skatt, frånvaro.
 */

/** Månadslön (brutto) — grund i Pontus. */
export const BASE_SALARY_SEK = 36_470;

/** Prisbasbelopp 2026. */
export const PBB_2026_SEK = 59_200;

export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_YEAR = 52;
export const HOURS_PER_WEEK = 40;
export const DAYS_PER_YEAR = 365;

/** Timlön för frånvaroavdrag: (36470 * 12) / (52 * 40). */
export const HOURLY_RATE_SEK =
  Math.round(((BASE_SALARY_SEK * MONTHS_PER_YEAR) / (WEEKS_PER_YEAR * HOURS_PER_WEEK)) * 100) / 100;

/** Dagsavdrag dag 15+ sjuk: (36470 * 12) / 365. */
export const DAILY_RATE_SEK =
  Math.round(((BASE_SALARY_SEK * MONTHS_PER_YEAR) / DAYS_PER_YEAR) * 100) / 100;

/** Karens första sjukdagen (timmar). */
export const SICK_KARENS_HOURS = 8;

/** Karens upphävs efter detta antal karensdagar på 365 dagar. */
export const SICK_KARENS_WAIVER_AFTER_DAYS = 10;

export const SICK_LOOKBACK_DAYS = 365;

/** Sjuk dag 2–14: arbetsgivarens nettotapp (20 % av timlön). */
export const SICK_DAY2_14_EMPLOYER_LOSS_FRACTION = 0.2;

/** VAB — simulerad nettoersättning i budget (80 % SGI, 30 % skatt). */
export const VAB_NET_REPLACEMENT_FRACTION = 0.8 * 0.7;

export const DAILY_WORK_HOURS = 8;

/** Jämn ISO-vecka (partall). */
export const EVEN_WEEK_TARGET_HOURS = 30;

/** Ojämn ISO-vecka (udda). */
export const ODD_WEEK_TARGET_HOURS = 50;

export const LONG_SHIFT_THRESHOLD_HOURS = 5;

export const LONG_SHIFT_BREAK_MINUTES = 30;

export const ABSENCE_CATEGORIES = ['Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'] as const;

export type AbsenceCategory = (typeof ABSENCE_CATEGORIES)[number];
