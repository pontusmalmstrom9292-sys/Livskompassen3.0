import { describe, expect, it } from 'vitest';
import { computeVacationAccrual } from '@economy/payVacationRules';
import { buildPayProfileContext } from '@economy/payProfileContext';

describe('payVacationRules', () => {
  it('Livs 13,2 %', () => {
    const ctx = buildPayProfileContext({ collectiveAgreementEnabled: true });
    const v = computeVacationAccrual(ctx);
    expect(v.fraction).toBe(0.132);
    expect(v.monthlyAccrualSek).toBe(Math.round(ctx.monthlySalarySek * 0.132 * 100) / 100);
  });

  it('lag 12 % när avtal av', () => {
    const ctx = buildPayProfileContext({ collectiveAgreementEnabled: false });
    const v = computeVacationAccrual(ctx);
    expect(v.fraction).toBe(0.12);
  });
});
