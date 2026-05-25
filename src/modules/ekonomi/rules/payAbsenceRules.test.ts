import { describe, expect, it } from 'vitest';
import {
  computeAbsenceAdjustments,
  countKarensDaysInLookback,
  shouldWaiveKarens,
} from './payAbsenceRules';
import type { TimeEntryLike } from './payTimeRules';
import { HOURLY_RATE_SEK, SICK_KARENS_WAIVER_AFTER_DAYS } from './livsmedel2026';

function sickDay(date: string, hours = 8): TimeEntryLike {
  return {
    date,
    clockIn: '08:00',
    clockOut: '16:00',
    category: 'Sjuk',
    breakMinutes: 30,
    scopePercent: 100,
    hoursWorked: hours,
  };
}

describe('payAbsenceRules', () => {
  it('VAB — 100 % avdrag och simulerad ersättning', () => {
    const entries: TimeEntryLike[] = [
      {
        date: '2026-05-10',
        clockIn: '08:00',
        clockOut: '12:00',
        category: 'VAB',
        breakMinutes: 0,
        scopePercent: 100,
        hoursWorked: 4,
      },
    ];
    const r = computeAbsenceAdjustments(entries, '2026-05-01', '2026-05-31');
    expect(r.totalDeductionSek).toBe(4 * HOURLY_RATE_SEK);
    expect(r.totalExpectedIncomeSek).toBeGreaterThan(0);
  });

  it('karens dag 1 — 8 h avdrag', () => {
    const entries = [sickDay('2026-05-10')];
    const r = computeAbsenceAdjustments(entries, '2026-05-01', '2026-05-31');
    expect(r.totalDeductionSek).toBe(8 * HOURLY_RATE_SEK);
  });

  it('karens upphävs efter 10 episoder på 365 dagar', () => {
    const entries: TimeEntryLike[] = [];
    for (let i = 0; i < SICK_KARENS_WAIVER_AFTER_DAYS; i++) {
      const d = new Date(2025, 5, 1 + i * 14);
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      entries.push(sickDay(date));
    }
    expect(countKarensDaysInLookback(entries, new Date('2026-05-20'))).toBeGreaterThanOrEqual(
      SICK_KARENS_WAIVER_AFTER_DAYS,
    );
    expect(shouldWaiveKarens(entries, new Date('2026-05-20'))).toBe(true);
    const r = computeAbsenceAdjustments(
      [...entries, sickDay('2026-05-20')],
      '2026-05-01',
      '2026-05-31',
      new Date('2026-05-20'),
    );
    const day20 = r.lines.find((l) => l.date === '2026-05-20');
    expect(day20?.deductionSek).toBe(0);
  });
});
