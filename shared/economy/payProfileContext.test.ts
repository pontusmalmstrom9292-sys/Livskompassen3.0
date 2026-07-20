import { describe, expect, it } from 'vitest';
import {
  buildPayProfileContext,
  deriveHourlyRate,
  deriveSgiAnnual,
  defaultPayProfileSettings,
} from '@economy/payProfileContext';
import { DEFAULT_MONTHLY_SALARY_SEK } from '@economy/payProfileContext';

describe('payProfileContext', () => {
  it('tre inställningar → timlön och SGI', () => {
    const ctx = buildPayProfileContext(defaultPayProfileSettings());
    expect(ctx.monthlySalarySek).toBe(DEFAULT_MONTHLY_SALARY_SEK);
    expect(ctx.hourlyRateSek).toBe(deriveHourlyRate(DEFAULT_MONTHLY_SALARY_SEK));
    expect(ctx.sgiAnnualSek).toBe(deriveSgiAnnual(DEFAULT_MONTHLY_SALARY_SEK));
    expect(ctx.taxTable).toBe(32);
    expect(ctx.taxColumn).toBe(1);
  });

  it('högre lön → högre timlön', () => {
    const ctx = buildPayProfileContext({
      salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: 40_000 }],
    });
    expect(ctx.hourlyRateSek).toBeGreaterThan(210);
  });

  it('avtal av → lag semester', () => {
    const ctx = buildPayProfileContext({
      collectiveAgreementEnabled: false,
    });
    expect(ctx.agreementConfig.vacationPayFraction).toBe(0.12);
    expect(ctx.agreementDisplayName).toContain('Endast lag');
  });
});
