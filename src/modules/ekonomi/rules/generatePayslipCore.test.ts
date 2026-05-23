import { describe, expect, it } from 'vitest';
import { buildMonthlyPayslip, getPayslipPeriodForPayday } from './generatePayslipCore';
import { BASE_SALARY_SEK } from './livsmedel2026';

describe('generatePayslipCore', () => {
  it('löneperiod vid utbetalning 16 maj', () => {
    const p = getPayslipPeriodForPayday(new Date(2026, 4, 16));
    expect(p.from).toBe('2026-04-16');
    expect(p.to).toBe('2026-05-15');
  });

  it('baslön minus skatt Tabell 32', () => {
    const result = buildMonthlyPayslip({
      entries: [],
      period: getPayslipPeriodForPayday(new Date(2026, 4, 16)),
      monthlySalarySek: BASE_SALARY_SEK,
    });
    expect(result.taxSek).toBe(7312);
    expect(result.netSalarySek).toBe(BASE_SALARY_SEK - 7312);
  });
});
