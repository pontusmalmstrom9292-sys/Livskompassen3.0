import { describe, expect, it } from 'vitest';
import golden from '@economy/__fixtures__/sheet-golden.json';
import {
  computeAbsenceAdjustments,
  countKarensDaysInLookback,
  groupSickEpisodes,
  shouldWaiveKarens,
} from './payAbsenceRules';
import type { TimeEntryLike } from './payTimeRules';

const period = golden.absence.periodMay2026;

function sickFromTemplate(date: string, hoursWorked = 8): TimeEntryLike {
  return {
    date,
    ...golden.absence.sickEntryTemplate,
    hoursWorked,
  };
}

describe('payAbsenceRules', () => {
  it('VAB — golden vabSingleDay', () => {
    const c = golden.absence.vabSingleDay;
    const r = computeAbsenceAdjustments(
      [c.entry as TimeEntryLike],
      period.from,
      period.to,
    );
    expect(r.totalDeductionSek).toBe(c.expectTotalDeductionSek);
    expect(r.totalExpectedIncomeSek).toBe(c.expectTotalExpectedIncomeSek);
    expect(r.lines[0]?.description).toContain(c.expectLineDescriptionContains);
  });

  it('sjuk dag 1 — golden sickDay1Karens', () => {
    const c = golden.absence.sickDay1Karens;
    const r = computeAbsenceAdjustments(
      [c.entry as TimeEntryLike],
      period.from,
      period.to,
    );
    expect(r.totalDeductionSek).toBe(c.expectTotalDeductionSek);
    expect(r.totalExpectedIncomeSek).toBe(c.expectTotalExpectedIncomeSek);
    expect(r.lines[0]?.description).toContain(c.expectLineDescriptionContains);
  });

  it('sjuk dag 2 — golden sickDay2EmployerLoss', () => {
    const c = golden.absence.sickDay2EmployerLoss;
    const r = computeAbsenceAdjustments(
      c.entries as TimeEntryLike[],
      period.from,
      period.to,
    );
    expect(r.totalDeductionSek).toBe(c.expectTotalDeductionSek);
    const day2 = r.lines.find((l) => l.date === '2026-05-11');
    expect(day2?.deductionSek).toBe(c.expectDay2DeductionSek);
    expect(day2?.description).toContain(c.expectDay2DescriptionContains);
  });

  it('sjuk dag 15+ kategori — golden sickDay15PlusCategory', () => {
    const c = golden.absence.sickDay15PlusCategory;
    const r = computeAbsenceAdjustments(
      [c.entry as TimeEntryLike],
      period.from,
      period.to,
    );
    expect(r.totalDeductionSek).toBe(c.expectTotalDeductionSek);
    expect(r.lines[0]?.description).toContain(c.expectLineDescriptionContains);
  });

  it('grupperar konsekutiva sjukdagar — golden groupSickEpisodes', () => {
    const c = golden.absence.groupSickEpisodes;
    expect(groupSickEpisodes(c.inputDates)).toEqual(c.expectEpisodes);
  });

  it('karens upphävs — golden karensWaiver', () => {
    const c = golden.absence.karensWaiver;
    const prior = c.priorKarensEpisodeDates.map((date) => sickFromTemplate(date));
    const ref = new Date(c.referenceDate);

    expect(countKarensDaysInLookback(prior, ref)).toBe(c.expectKarensDaysInLookback);
    expect(shouldWaiveKarens(prior, ref)).toBe(c.expectShouldWaiveKarens);

    const r = computeAbsenceAdjustments(
      [...prior, sickFromTemplate(c.newSickDate)],
      period.from,
      period.to,
      ref,
    );
    const newDay = r.lines.find((l) => l.date === c.newSickDate);
    expect(newDay?.deductionSek).toBe(c.expectNewDayDeductionSek);
    expect(newDay?.description).toContain(c.expectNewDayDescriptionContains);
  });
});
