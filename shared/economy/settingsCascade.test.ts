import { describe, expect, it } from 'vitest';
import {
  buildMonthlyPayslip,
  getPayslipPeriodForPayday,
  recomputePayProfilePreview,
} from '@economy/generatePayslipCore';
import { DEFAULT_MONTHLY_SALARY_SEK } from '@economy/payProfileContext';
import golden from '@economy/__fixtures__/sheet-golden.json';
import type { TimeEntryLike } from '@economy/payTimeRules';

describe('settingsCascade', () => {
  const period = getPayslipPeriodForPayday(new Date(2026, 4, 16));

  it('byt lön → omräkning OK', () => {
    const low = recomputePayProfilePreview({
      salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: 30_000 }],
    });
    const high = recomputePayProfilePreview({
      salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: 45_000 }],
    });
    expect(high.totalToBankSek).toBeGreaterThan(low.totalToBankSek);
    expect(high.profile.hourlyRateSek).toBeGreaterThan(low.profile.hourlyRateSek);
  });

  it('byt avtal av → lag semester i meta', () => {
    const withAgreement = recomputePayProfilePreview({ collectiveAgreementEnabled: true });
    const legalOnly = recomputePayProfilePreview({ collectiveAgreementEnabled: false });
    expect(withAgreement.vacationAccrualSek).toBeGreaterThan(legalOnly.vacationAccrualSek);
    expect(legalOnly.agreementMeta.enabled).toBe(false);
  });

  it('byt tabell → skatt OK', () => {
    const col1 = recomputePayProfilePreview({ taxColumn: 1 });
    const col4 = recomputePayProfilePreview({ taxColumn: 4 });
    expect(col4.taxSek).toBeLessThanOrEqual(col1.taxSek);
  });

  it('uppladdad skattetabell → lägre skatt vid sänkt bracket', () => {
    const embedded = recomputePayProfilePreview({ taxColumn: 1 });
    const customBrackets = [{ min: 1, max: 999999, col1: 0 }];
    const uploaded = recomputePayProfilePreview({
      taxColumn: 1,
      taxTable: 32,
      taxYear: 2026,
      activeTaxTablePack: {
        id: 'test',
        table: 32,
        year: 2026,
        brackets: customBrackets,
        checksum: 'test',
        sourceFileName: 'taxTable32-2026.json',
        uploadedAt: '',
      },
    });
    expect(uploaded.taxSek).toBeLessThan(embedded.taxSek);
  });

  it('uppladdat avtal → högre semester i preview', () => {
    const base = recomputePayProfilePreview({ collectiveAgreementEnabled: true });
    const uploaded = recomputePayProfilePreview({
      collectiveAgreementEnabled: true,
      activeAgreementPack: {
        id: 'p1',
        agreementId: 'SE.livs.livsmedel',
        config: {
          id: 'SE.livs.livsmedel',
          name: 'Livs upload',
          versionLabel: '2027',
          vacationPayFraction: 0.15,
          vacationDayDivisor: 21.75,
          atfAccrualFraction: 0.0292,
          karensWeeklySickPayFraction: 0.2,
          sickDay2_14EmployerLossFraction: 0.2,
          agsSickTopUpFraction: 0.1,
          agsEnabled: true,
          karensWaiverAfterDays: 10,
          vabNetReplacementFraction: 0.56,
          reSickGapDays: 5,
        },
        validFrom: '2000-01-01',
        versionLabel: '2027',
        checksum: 'x',
        sourceFileName: 'livs.yaml',
        uploadedAt: '',
      },
    });
    expect(uploaded.vacationAccrualSek).toBeGreaterThan(base.vacationAccrualSek);
  });

  it('frisk månad golden — netto arbete', () => {
    const result = buildMonthlyPayslip({
      entries: [],
      period,
      profileSettings: {
        salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: DEFAULT_MONTHLY_SALARY_SEK }],
      },
    });
    expect(result.taxSek).toBe(7312);
    expect(result.employerNetSek).toBe(DEFAULT_MONTHLY_SALARY_SEK - 7312);
  });

  it('sjuk dag 15+ — FK-rad på spec', () => {
    const entry = golden.absence.sickDay15PlusCategory.entry as TimeEntryLike;
    const result = buildMonthlyPayslip({
      entries: [entry],
      period: golden.absence.periodMay2026,
      profileSettings: {
        salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: DEFAULT_MONTHLY_SALARY_SEK }],
        collectiveAgreementEnabled: true,
      },
      referenceDate: new Date('2026-05-20'),
    });
    expect(result.fkTotalSek).toBeGreaterThan(0);
    expect(result.lineItems.some((l) => l.incomeSource === 'fk')).toBe(true);
  });

  it('VAB — FK-rad', () => {
    const entry = golden.absence.vabSingleDay.entry as TimeEntryLike;
    const result = buildMonthlyPayslip({
      entries: [entry],
      period: golden.absence.periodMay2026,
      referenceDate: new Date('2026-05-10'),
    });
    expect(result.fkTotalSek).toBeGreaterThan(0);
  });
});
