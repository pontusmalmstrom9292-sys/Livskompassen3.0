import { describe, expect, it } from 'vitest';
import golden from '@economy/__fixtures__/sheet-golden.json';
import {
  computeDayFlexDelta,
  computeHoursWorkedOnClockOut,
  computeWeekFlexSummary,
  describeWeekForDate,
  getWeekFlexTarget,
  isAbsenceCategory,
  isEvenISOWeek,
  resolveBreakMinutesOnClockOut,
} from './payTimeRules';
import type { TimeEntryLike } from './payTimeRules';

describe('payTimeRules', () => {
  it('jämn/ojämn vecka enligt golden weekTargets', () => {
    const even = golden.weekTargets.evenWeekExample;
    const odd = golden.weekTargets.oddWeekExample;
    expect(isEvenISOWeek(new Date(even.isoDate))).toBe(even.expectEven);
    expect(getWeekFlexTarget(new Date(even.isoDate))).toBe(even.flexTargetHours);
    expect(isEvenISOWeek(new Date(odd.isoDate))).toBe(odd.expectEven);
    expect(getWeekFlexTarget(new Date(odd.isoDate))).toBe(odd.flexTargetHours);
  });

  it('auto-rast vid pass > 5 h', () => {
    const c = golden.autoBreak.longShiftNoBreak;
    const br = resolveBreakMinutesOnClockOut({
      date: c.date,
      clockIn: c.clockIn,
      clockOut: c.clockOut,
      breakMinutes: c.breakMinutesIn,
    });
    expect(br).toBe(c.expectBreakMinutes);
    const { hoursWorked } = computeHoursWorkedOnClockOut({
      date: c.date,
      clockIn: c.clockIn,
      clockOut: c.clockOut,
      breakMinutes: c.breakMinutesIn,
      scopePercent: 100,
    });
    expect(hoursWorked).toBeGreaterThanOrEqual(c.expectHoursWorkedMin);
  });

  it('ingen auto-rast vid kort pass', () => {
    const c = golden.autoBreak.shortShiftNoBreak;
    expect(
      resolveBreakMinutesOnClockOut({
        date: c.date,
        clockIn: c.clockIn,
        clockOut: c.clockOut,
        breakMinutes: c.breakMinutesIn,
      }),
    ).toBe(0);
    const { hoursWorked } = computeHoursWorkedOnClockOut({
      date: c.date,
      clockIn: c.clockIn,
      clockOut: c.clockOut,
      breakMinutes: c.breakMinutesIn,
      scopePercent: 100,
    });
    expect(hoursWorked).toBe(c.expectHoursWorked);
  });

  it('behåller befintlig rast', () => {
    const c = golden.autoBreak.alreadyHasBreak;
    expect(
      resolveBreakMinutesOnClockOut({
        date: c.date,
        clockIn: c.clockIn,
        clockOut: c.clockOut,
        breakMinutes: c.breakMinutesIn,
      }),
    ).toBe(c.expectBreakMinutes);
  });

  it('flex: endast Arbete mot veckomål', () => {
    const ref = new Date('2026-05-19');
    const arbete = golden.flexWeek.arbeteOnly as TimeEntryLike[];
    const s1 = computeWeekFlexSummary(arbete, ref);
    expect(s1.workHoursWeek).toBe(golden.flexWeek.expectWorkHoursWeek);

    const mixed = golden.flexWeek.absenceExcluded as TimeEntryLike[];
    const s2 = computeWeekFlexSummary(mixed, ref);
    expect(s2.workHoursWeek).toBe(golden.flexWeek.expectWorkHoursWeekAbsence);
  });

  it('frånvarokategorier', () => {
    expect(isAbsenceCategory('VAB')).toBe(true);
    expect(isAbsenceCategory('Sjuk dag 15+')).toBe(true);
    expect(isAbsenceCategory('Arbete')).toBe(false);
  });

  it('dagflex för Arbete', () => {
    const d = golden.dayFlex.arbeteEightHours;
    expect(computeDayFlexDelta(d.entry as TimeEntryLike)).toBe(d.expectDayFlexDelta);
    const u = golden.dayFlex.arbeteUnderTarget;
    expect(computeDayFlexDelta(u.entry as TimeEntryLike)).toBe(u.expectDayFlexDelta);
  });

  it('describeWeekForDate', () => {
    const { weekType, flexTarget } = describeWeekForDate('2026-05-18');
    expect(['even', 'odd']).toContain(weekType);
    expect(flexTarget).toBe(weekType === 'even' ? 30 : 50);
  });
});
