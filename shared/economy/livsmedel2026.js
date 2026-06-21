"use strict";
/**
 * Livsmedelsavtalet / PontusArbetsapp — inkomstår 2026.
 * Fas 1: stämpel. Fas 2: lön, skatt, frånvaro.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABSENCE_CATEGORIES = exports.LONG_SHIFT_BREAK_MINUTES = exports.LONG_SHIFT_THRESHOLD_HOURS = exports.ODD_WEEK_TARGET_HOURS = exports.EVEN_WEEK_TARGET_HOURS = exports.DAILY_WORK_HOURS = exports.VAB_NET_REPLACEMENT_FRACTION = exports.SICK_DAY2_14_EMPLOYER_LOSS_FRACTION = exports.SICK_LOOKBACK_DAYS = exports.SICK_KARENS_WAIVER_AFTER_DAYS = exports.SICK_KARENS_HOURS = exports.DAILY_RATE_SEK = exports.HOURLY_RATE_SEK = exports.DAYS_PER_YEAR = exports.HOURS_PER_WEEK = exports.WEEKS_PER_YEAR = exports.MONTHS_PER_YEAR = exports.PBB_2026_SEK = exports.BASE_SALARY_SEK = void 0;
/** Månadslön (brutto) — grund i Pontus. */
exports.BASE_SALARY_SEK = 36_470;
/** Prisbasbelopp 2026. */
exports.PBB_2026_SEK = 59_200;
exports.MONTHS_PER_YEAR = 12;
exports.WEEKS_PER_YEAR = 52;
exports.HOURS_PER_WEEK = 40;
exports.DAYS_PER_YEAR = 365;
/** Timlön för frånvaroavdrag: (36470 * 12) / (52 * 40). */
exports.HOURLY_RATE_SEK = Math.round(((exports.BASE_SALARY_SEK * exports.MONTHS_PER_YEAR) / (exports.WEEKS_PER_YEAR * exports.HOURS_PER_WEEK)) * 100) / 100;
/** Dagsavdrag dag 15+ sjuk: (36470 * 12) / 365. */
exports.DAILY_RATE_SEK = Math.round(((exports.BASE_SALARY_SEK * exports.MONTHS_PER_YEAR) / exports.DAYS_PER_YEAR) * 100) / 100;
/** Karens första sjukdagen (timmar). */
exports.SICK_KARENS_HOURS = 8;
/** Karens upphävs efter detta antal karensdagar på 365 dagar. */
exports.SICK_KARENS_WAIVER_AFTER_DAYS = 10;
exports.SICK_LOOKBACK_DAYS = 365;
/** Sjuk dag 2–14: arbetsgivarens nettotapp (20 % av timlön). */
exports.SICK_DAY2_14_EMPLOYER_LOSS_FRACTION = 0.2;
/** VAB — simulerad nettoersättning i budget (80 % SGI, 30 % skatt). */
exports.VAB_NET_REPLACEMENT_FRACTION = 0.8 * 0.7;
exports.DAILY_WORK_HOURS = 8;
/** Jämn ISO-vecka (partall). */
exports.EVEN_WEEK_TARGET_HOURS = 30;
/** Ojämn ISO-vecka (udda). */
exports.ODD_WEEK_TARGET_HOURS = 50;
exports.LONG_SHIFT_THRESHOLD_HOURS = 5;
exports.LONG_SHIFT_BREAK_MINUTES = 30;
exports.ABSENCE_CATEGORIES = ['Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'];
//# sourceMappingURL=livsmedel2026.js.map