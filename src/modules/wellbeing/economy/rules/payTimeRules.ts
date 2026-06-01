/**
 * Stämpel- och flexregler portade från PontusArbetsapp (Fas 1).
 * Ren logik — ingen Firestore, ingen UI.
 */
import { formatDateLocal } from '@/shared/utils/dateHelpers';
import {
  categoryBase,
  computeHoursWorked,
  getMonday,
  parseClockOnDate,
  parseDateOnly,
} from '../../../core/utils/timeMath';
import {
  ABSENCE_CATEGORIES,
  DAILY_WORK_HOURS,
  EVEN_WEEK_TARGET_HOURS,
  LONG_SHIFT_BREAK_MINUTES,
  LONG_SHIFT_THRESHOLD_HOURS,
  ODD_WEEK_TARGET_HOURS,
} from './livsmedel2026';

export type WeekType = 'even' | 'odd';

export type TimeEntryLike = {
  date: string;
  clockIn: string;
  clockOut?: string | null;
  category: string;
  breakMinutes: number;
  scopePercent: number;
  hoursWorked: number;
};

export type WeekFlexSummary = {
  flexLeft: number;
  flexTarget: number;
  workHoursWeek: number;
  weekType: WeekType;
  weekTypeLabel: string;
};

export type DayFlexRow = {
  date: string;
  flexDelta: number;
  hoursWorked: number;
  category: string;
};

export type WeekFlexDetail = WeekFlexSummary & {
  perDay: DayFlexRow[];
};

/** ISO 8601 veckonummer (lokal kalenderdag). */
export function getISOWeekNumber(date = new Date()): number {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNr = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dayNr + 3);
  const firstThursday = d.valueOf();
  d.setMonth(0, 1);
  if (d.getDay() !== 4) {
    d.setMonth(0, 1 + ((4 - d.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - d.valueOf()) / 604_800_000);
}

export function isEvenISOWeek(date = new Date()): boolean {
  return getISOWeekNumber(date) % 2 === 0;
}

export function getWeekFlexTarget(date = new Date()): number {
  return isEvenISOWeek(date) ? EVEN_WEEK_TARGET_HOURS : ODD_WEEK_TARGET_HOURS;
}

export function getWeekTypeLabel(date = new Date()): string {
  return isEvenISOWeek(date)
    ? `Jämn vecka (${EVEN_WEEK_TARGET_HOURS} h)`
    : `Ojämn vecka (${ODD_WEEK_TARGET_HOURS} h)`;
}

export function isAbsenceCategory(category: string): boolean {
  const base = categoryBase(category);
  return (ABSENCE_CATEGORIES as readonly string[]).includes(base);
}

export function isWorkCategory(category: string): boolean {
  return categoryBase(category) === 'Arbete';
}

export function getRawHoursOnDate(date: string, clockIn: string, clockOut: string): number {
  const start = parseClockOnDate(date, clockIn);
  const end = parseClockOnDate(date, clockOut);
  if (end <= start) return 0;
  return (end.getTime() - start.getTime()) / 3_600_000;
}

/** Auto-rast: om pass > 5 h och rast ej satt → 30 min (GAS onEdit). */
export function resolveBreakMinutesOnClockOut(params: {
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
}): number {
  if (params.breakMinutes > 0) return params.breakMinutes;
  const raw = getRawHoursOnDate(params.date, params.clockIn, params.clockOut);
  if (raw > LONG_SHIFT_THRESHOLD_HOURS) return LONG_SHIFT_BREAK_MINUTES;
  return params.breakMinutes;
}

/** Dagflex (ark kolumn I): arbetstimmar minus dagmål. */
export function computeDayFlexDelta(entry: TimeEntryLike): number {
  if (!entry.clockOut || isAbsenceCategory(entry.category) || !isWorkCategory(entry.category)) {
    return 0;
  }
  const dailyTarget = DAILY_WORK_HOURS * (entry.scopePercent / 100);
  return Math.round((entry.hoursWorked - dailyTarget) * 10) / 10;
}

export function filterEntriesInWeek<T extends { date: string }>(
  entries: T[],
  referenceDate = new Date(),
): T[] {
  const monday = getMonday(referenceDate);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return entries.filter((row) => {
    const d = parseDateOnly(row.date);
    return d >= monday && d <= sunday;
  });
}

export function computeWeekFlexSummary(
  entries: TimeEntryLike[],
  referenceDate = new Date(),
  flexTargetOverride?: number,
): WeekFlexSummary {
  const flexTarget = flexTargetOverride ?? getWeekFlexTarget(referenceDate);
  const weekEntries = filterEntriesInWeek(entries, referenceDate);

  let workHoursWeek = 0;
  for (const row of weekEntries) {
    if (isWorkCategory(row.category)) {
      workHoursWeek += row.hoursWorked;
    }
  }
  workHoursWeek = Math.round(workHoursWeek * 10) / 10;

  const flexLeft = Math.round((flexTarget - workHoursWeek) * 10) / 10;
  const weekType: WeekType = isEvenISOWeek(referenceDate) ? 'even' : 'odd';

  return {
    flexLeft,
    flexTarget,
    workHoursWeek,
    weekType,
    weekTypeLabel: getWeekTypeLabel(referenceDate),
  };
}

export function buildPerDayFlexRows(
  entries: TimeEntryLike[],
  referenceDate = new Date(),
): DayFlexRow[] {
  const weekEntries = filterEntriesInWeek(entries, referenceDate);
  const byDate = new Map<string, DayFlexRow>();

  for (const row of weekEntries) {
    const existing = byDate.get(row.date);
    const delta = computeDayFlexDelta(row);
    const hours = row.hoursWorked;
    if (existing) {
      existing.flexDelta = Math.round((existing.flexDelta + delta) * 10) / 10;
      existing.hoursWorked = Math.round((existing.hoursWorked + hours) * 10) / 10;
    } else {
      byDate.set(row.date, {
        date: row.date,
        flexDelta: delta,
        hoursWorked: hours,
        category: categoryBase(row.category),
      });
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function computeWeekFlexDetail(
  entries: TimeEntryLike[],
  referenceDate = new Date(),
): WeekFlexDetail {
  const summary = computeWeekFlexSummary(entries, referenceDate);
  return {
    ...summary,
    perDay: buildPerDayFlexRows(entries, referenceDate),
  };
}

/** Beräkna hoursWorked efter utstämpling inkl. auto-rast. */
export function computeHoursWorkedOnClockOut(params: {
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
  scopePercent: number;
}): { breakMinutes: number; hoursWorked: number } {
  const breakMinutes = resolveBreakMinutesOnClockOut({
    date: params.date,
    clockIn: params.clockIn,
    clockOut: params.clockOut,
    breakMinutes: params.breakMinutes,
  });
  const hoursWorked = computeHoursWorked({
    date: params.date,
    clockIn: params.clockIn,
    clockOut: params.clockOut,
    breakMinutes,
    scopePercent: params.scopePercent,
  });
  return { breakMinutes, hoursWorked };
}

/** Hjälp för tester: förväntat enligt golden fixture. */
export function describeWeekForDate(isoDate: string): { weekType: WeekType; flexTarget: number } {
  const d = parseDateOnly(isoDate);
  const weekType: WeekType = isEvenISOWeek(d) ? 'even' : 'odd';
  return { weekType, flexTarget: weekType === 'even' ? EVEN_WEEK_TARGET_HOURS : ODD_WEEK_TARGET_HOURS };
}

export { formatDateLocal } from '@/shared/utils/dateHelpers';
