"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateLocal = void 0;
exports.getISOWeekNumber = getISOWeekNumber;
exports.isEvenISOWeek = isEvenISOWeek;
exports.getWeekFlexTarget = getWeekFlexTarget;
exports.getWeekTypeLabel = getWeekTypeLabel;
exports.isAbsenceCategory = isAbsenceCategory;
exports.isWorkCategory = isWorkCategory;
exports.getRawHoursOnDate = getRawHoursOnDate;
exports.resolveBreakMinutesOnClockOut = resolveBreakMinutesOnClockOut;
exports.computeDayFlexDelta = computeDayFlexDelta;
exports.filterEntriesInWeek = filterEntriesInWeek;
exports.computeWeekFlexSummary = computeWeekFlexSummary;
exports.buildPerDayFlexRows = buildPerDayFlexRows;
exports.computeWeekFlexDetail = computeWeekFlexDetail;
exports.computeHoursWorkedOnClockOut = computeHoursWorkedOnClockOut;
exports.describeWeekForDate = describeWeekForDate;
/**
 * Stämpel- och flexregler portade från PontusArbetsapp (Fas 1).
 * Ren logik — ingen Firestore, ingen UI.
 */
const timeMath_1 = require("./timeMath");
Object.defineProperty(exports, "formatDateLocal", { enumerable: true, get: function () { return timeMath_1.formatDateLocal; } });
const livsmedel2026_1 = require("./livsmedel2026");
/** ISO 8601 veckonummer (lokal kalenderdag). */
function getISOWeekNumber(date = new Date()) {
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
function isEvenISOWeek(date = new Date()) {
    return getISOWeekNumber(date) % 2 === 0;
}
function getWeekFlexTarget(date = new Date()) {
    return isEvenISOWeek(date) ? livsmedel2026_1.EVEN_WEEK_TARGET_HOURS : livsmedel2026_1.ODD_WEEK_TARGET_HOURS;
}
function getWeekTypeLabel(date = new Date()) {
    return isEvenISOWeek(date)
        ? `Jämn vecka (${livsmedel2026_1.EVEN_WEEK_TARGET_HOURS} h)`
        : `Ojämn vecka (${livsmedel2026_1.ODD_WEEK_TARGET_HOURS} h)`;
}
function isAbsenceCategory(category) {
    const base = (0, timeMath_1.categoryBase)(category);
    return livsmedel2026_1.ABSENCE_CATEGORIES.includes(base);
}
function isWorkCategory(category) {
    return (0, timeMath_1.categoryBase)(category) === 'Arbete';
}
function getRawHoursOnDate(date, clockIn, clockOut) {
    const start = (0, timeMath_1.parseClockOnDate)(date, clockIn);
    const end = (0, timeMath_1.parseClockOnDate)(date, clockOut);
    if (end <= start)
        return 0;
    return (end.getTime() - start.getTime()) / 3_600_000;
}
/** Auto-rast: om pass > 5 h och rast ej satt → 30 min (GAS onEdit). */
function resolveBreakMinutesOnClockOut(params) {
    if (params.breakMinutes > 0)
        return params.breakMinutes;
    const raw = getRawHoursOnDate(params.date, params.clockIn, params.clockOut);
    if (raw > livsmedel2026_1.LONG_SHIFT_THRESHOLD_HOURS)
        return livsmedel2026_1.LONG_SHIFT_BREAK_MINUTES;
    return params.breakMinutes;
}
/** Dagflex (ark kolumn I): arbetstimmar minus dagmål. */
function computeDayFlexDelta(entry) {
    if (!entry.clockOut || isAbsenceCategory(entry.category) || !isWorkCategory(entry.category)) {
        return 0;
    }
    const dailyTarget = livsmedel2026_1.DAILY_WORK_HOURS * (entry.scopePercent / 100);
    return Math.round((entry.hoursWorked - dailyTarget) * 10) / 10;
}
function filterEntriesInWeek(entries, referenceDate = new Date()) {
    const monday = (0, timeMath_1.getMonday)(referenceDate);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return entries.filter((row) => {
        const d = (0, timeMath_1.parseDateOnly)(row.date);
        return d >= monday && d <= sunday;
    });
}
function computeWeekFlexSummary(entries, referenceDate = new Date(), flexTargetOverride) {
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
    const weekType = isEvenISOWeek(referenceDate) ? 'even' : 'odd';
    return {
        flexLeft,
        flexTarget,
        workHoursWeek,
        weekType,
        weekTypeLabel: getWeekTypeLabel(referenceDate),
    };
}
function buildPerDayFlexRows(entries, referenceDate = new Date()) {
    const weekEntries = filterEntriesInWeek(entries, referenceDate);
    const byDate = new Map();
    for (const row of weekEntries) {
        const existing = byDate.get(row.date);
        const delta = computeDayFlexDelta(row);
        const hours = row.hoursWorked;
        if (existing) {
            existing.flexDelta = Math.round((existing.flexDelta + delta) * 10) / 10;
            existing.hoursWorked = Math.round((existing.hoursWorked + hours) * 10) / 10;
        }
        else {
            byDate.set(row.date, {
                date: row.date,
                flexDelta: delta,
                hoursWorked: hours,
                category: (0, timeMath_1.categoryBase)(row.category),
            });
        }
    }
    return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}
function computeWeekFlexDetail(entries, referenceDate = new Date()) {
    const summary = computeWeekFlexSummary(entries, referenceDate);
    return {
        ...summary,
        perDay: buildPerDayFlexRows(entries, referenceDate),
    };
}
/** Beräkna hoursWorked efter utstämpling inkl. auto-rast. */
function computeHoursWorkedOnClockOut(params) {
    const breakMinutes = resolveBreakMinutesOnClockOut({
        date: params.date,
        clockIn: params.clockIn,
        clockOut: params.clockOut,
        breakMinutes: params.breakMinutes,
    });
    const hoursWorked = (0, timeMath_1.computeHoursWorked)({
        date: params.date,
        clockIn: params.clockIn,
        clockOut: params.clockOut,
        breakMinutes,
        scopePercent: params.scopePercent,
    });
    return { breakMinutes, hoursWorked };
}
/** Hjälp för tester: förväntat enligt golden fixture. */
function describeWeekForDate(isoDate) {
    const d = (0, timeMath_1.parseDateOnly)(isoDate);
    const weekType = isEvenISOWeek(d) ? 'even' : 'odd';
    return { weekType, flexTarget: weekType === 'even' ? livsmedel2026_1.EVEN_WEEK_TARGET_HOURS : livsmedel2026_1.ODD_WEEK_TARGET_HOURS };
}
//# sourceMappingURL=payTimeRules.js.map