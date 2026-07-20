import { describe, expect, it } from 'vitest';
import {
  buildFkBenefitLines,
  computeFkSickPayPerDay,
  computeFkSickPayTotal,
  computeAgsSickTopUp,
} from '@economy/payFkBenefits';
import { buildPayProfileContext } from '@economy/payProfileContext';

describe('payFkBenefits', () => {
  it('sjukpenning per dag för standard SGI', () => {
    const ctx = buildPayProfileContext({});
    const perDay = computeFkSickPayPerDay(ctx.sgiAnnualSek);
    expect(perDay).toBeGreaterThan(900);
    expect(perDay).toBeLessThan(1000);
    expect(computeFkSickPayTotal(ctx.sgiAnnualSek, 3)).toBe(Math.round(perDay * 3 * 100) / 100);
  });

  it('AGS +10 % på FK sjukpenning', () => {
    expect(computeAgsSickTopUp(1000, 0.1)).toBe(100);
  });

  it('FK + AGS rader vid sjuk dag 15+', () => {
    const ctx = buildPayProfileContext({});
    const lines = buildFkBenefitLines({
      profile: ctx,
      absenceLines: [
        {
          date: '2026-05-20',
          category: 'Sjuk dag 15+',
          description: 'Sjuk dag 15+ — dagsavdrag (FK)',
          deductionSek: 1199,
          expectedIncomeSek: 0,
          isFkPhase: true,
        },
      ],
    });
    expect(lines.some((l) => l.incomeSource === 'fk')).toBe(true);
    expect(lines.some((l) => l.incomeSource === 'ags')).toBe(true);
  });
});
