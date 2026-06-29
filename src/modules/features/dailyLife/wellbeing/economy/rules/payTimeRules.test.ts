import { describe, expect, it } from 'vitest';
import golden from '@economy/__fixtures__/sheet-golden.json';
import {
  buildPerDayFlexRows,
  computeDayFlexDelta,
  computeHoursWorkedOnClockOut,
  computeWeekFlexSummary,
  describeWeekForDate,
  getWeekFlexTarget,
  isAbsenceCategory,
  isEvenISOWeek,
  isWorkCategory,
  resolveBreakMinutesOnClockOut,
} from './payTimeRules';
import type { TimeEntryLike } from './payTimeRules';

type AutoBreakCase = {
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutesIn: number;
  scopePercent?: number;
  expectBreakMinutes: number;
  expectHoursWorked?: number;
  expectHoursWorkedMin?: number;
};

function assertAutoBreakCase(c: AutoBreakCase) {
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
    scopePercent: c.scopePercent ?? 100,
  });

  if (c.expectHoursWorked != null) {
    expect(hoursWorked).toBe(c.expectHoursWorked);
  }
  if (c.expectHoursWorkedMin != null) {
    expect(hoursWorked).toBeGreaterThanOrEqual(c.expectHoursWorkedMin);
  }
}

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
    assertAutoBreakCase(golden.autoBreak.longShiftNoBreak);
  });

  it('ingen auto-rast vid kort pass', () => {
    assertAutoBreakCase(golden.autoBreak.shortShiftNoBreak);
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

  it('ingen auto-rast vid exakt 5 h (tröskel > 5)', () => {
    assertAutoBreakCase(golden.autoBreak.exactlyFiveHours);
  });

  it('auto-rast vid pass strax över 5 h', () => {
    assertAutoBreakCase(golden.autoBreak.justOverFiveHours);
  });

  it('delomfattning påverkar hoursWorked efter utstämpling', () => {
    assertAutoBreakCase(golden.autoBreak.partialScope);
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

  it('flex: veckosaldo ojämn/jämn vecka enligt golden', () => {
    const odd = golden.flexWeek.oddWeekSummary;
    const oddSummary = computeWeekFlexSummary(
      golden.flexWeek.arbeteOnly as TimeEntryLike[],
      new Date(odd.referenceDate),
    );
    expect(oddSummary.flexTarget).toBe(odd.expectFlexTarget);
    expect(oddSummary.flexLeft).toBe(odd.expectFlexLeft);
    expect(oddSummary.weekType).toBe(odd.expectWeekType);

    const even = golden.flexWeek.evenWeekSummary;
    const evenSummary = computeWeekFlexSummary(
      even.entries as TimeEntryLike[],
      new Date(even.referenceDate),
    );
    expect(evenSummary.workHoursWeek).toBe(even.expectWorkHoursWeek);
    expect(evenSummary.flexTarget).toBe(even.expectFlexTarget);
    expect(evenSummary.flexLeft).toBe(even.expectFlexLeft);
    expect(evenSummary.weekType).toBe(even.expectWeekType);
  });

  it('frånvarokategorier enligt golden absenceCategories', () => {
    for (const cat of golden.absenceCategories.expectAbsent) {
      expect(isAbsenceCategory(cat)).toBe(true);
      expect(isWorkCategory(cat)).toBe(false);
    }
    for (const cat of golden.absenceCategories.expectWork) {
      expect(isAbsenceCategory(cat)).toBe(false);
      expect(isWorkCategory(cat)).toBe(true);
    }
  });

  it('dagflex för Arbete och frånvaro enligt golden dayFlex', () => {
    const cases = [
      golden.dayFlex.arbeteEightHours,
      golden.dayFlex.arbeteUnderTarget,
      golden.dayFlex.arbeteOverTarget,
      golden.dayFlex.partialScopeBalanced,
      golden.dayFlex.vabZeroFlex,
      golden.dayFlex.semesterZeroFlex,
    ];
    for (const row of cases) {
      expect(computeDayFlexDelta(row.entry as TimeEntryLike)).toBe(row.expectDayFlexDelta);
    }
  });

  it('dagflex summerar flera pass samma dag', () => {
    const m = golden.dayFlex.multiPassSameDay;
    const rows = buildPerDayFlexRows(m.entries as TimeEntryLike[], new Date(m.referenceDate));
    expect(rows).toHaveLength(1);
    expect(rows[0].flexDelta).toBe(m.expectDayFlexDelta);
    expect(rows[0].hoursWorked).toBe(m.expectHoursWorkedDay);
  });

  it('describeWeekForDate', () => {
    const { weekType, flexTarget } = describeWeekForDate('2026-05-18');
    expect(['even', 'odd']).toContain(weekType);
    expect(flexTarget).toBe(weekType === 'even' ? 30 : 50);
  });
});
