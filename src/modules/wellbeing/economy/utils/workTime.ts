/**
 * Ekonomi-modulens tids-API — kanon i core/utils/timeMath.ts.
 * Portad från PontusArbetsapp Kod.js (Europe/Stockholm, rast, omfattning %).
 */
export {
  TIMEZONE,
  DEFAULT_HELDAG,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_SCOPE_PERCENT,
  formatDateLocal,
  formatTimeLocal,
  normalizeClock,
  parseDateOnly,
  parseClockOnDate,
  buildCategoryName,
  categoryBase,
  computeHoursWorked,
  getMonday,
  getWeekNumber,
  eachDateInclusive,
  emptyWeekCalendar,
  type WeekDaySummary,
} from '../../../core/utils/timeMath';

export {
  ABSENCE_CATEGORIES,
  DAILY_WORK_HOURS,
  EVEN_WEEK_TARGET_HOURS,
  ODD_WEEK_TARGET_HOURS,
} from '../rules/livsmedel2026';

export {
  computeWeekFlexDetail,
  getWeekFlexTarget,
  getWeekTypeLabel,
  isAbsenceCategory,
  type WeekFlexDetail,
  type WeekType,
} from '../rules/payTimeRules';

export {
  BASE_SALARY_SEK,
  PBB_2026_SEK,
  HOURLY_RATE_SEK,
  DAILY_RATE_SEK,
} from '../rules/livsmedel2026';

export { getTaxAmount } from '../rules/taxTable32';
export { buildMonthlyPayslip, getPayslipPeriodForPayday } from '../rules/generatePayslipCore';
export type { PayslipResult, PayslipPeriod } from '../rules/generatePayslipCore';
