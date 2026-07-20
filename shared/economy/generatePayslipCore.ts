/**
 * Lönespec — ren beräkning (ingen Firestore). Lönekontor Fas A–D.
 */
import { parseDateOnly } from './timeMath';
import type { TimeEntryLike } from './payTimeRules';
import { computeAbsenceAdjustments, countKarensDaysInLookback, shouldWaiveKarens } from './payAbsenceRules';
import { PBB_2026_SEK } from './payProfileContext';
import {
  buildPayProfileContext,
  deriveDailyRate,
  deriveHourlyRate,
  deriveSgiAnnual,
  deriveWeeklySickPay,
  proRataMonthlySalary,
  type PayProfileContext,
  type PayProfileSettings,
} from './payProfileContext';
import { getTaxAmount, getTaxMetaFromPack } from './taxTable32';
import { getAgreementMetaFromPack } from './agreements/resolver';
import {
  buildFkBenefitLines,
  computeTotalToBank,
  PayslipLineType,
  sumLinesBySource,
  type PayslipLineItem,
} from './payFkBenefits';
import { computeVacationAccrual } from './payVacationRules';
import { computeAtfAccrual } from './payAtfRules';
import { computeObOvertimeForEntry } from './payObOvertimeRules';
import { getPayslipPeriodForPayday, type PayslipPeriod } from './payPeriod';

export type { PayslipPeriod };
export { getPayslipPeriodForPayday };

export type PayslipResult = {
  period: PayslipPeriod;
  profile: PayProfileContext;
  baseSalarySek: number;
  grossBeforeDeductionsSek: number;
  absenceDeductionSek: number;
  obSupplementSek: number;
  otSupplementSek: number;
  taxableGrossSek: number;
  taxSek: number;
  netSalarySek: number;
  employerNetSek: number;
  fkTotalSek: number;
  agsTotalSek: number;
  totalToBankSek: number;
  expectedIncomeAdjustmentSek: number;
  hourlyRateSek: number;
  pbb2026Sek: number;
  absenceLines: ReturnType<typeof computeAbsenceAdjustments>['lines'];
  lineItems: PayslipLineItem[];
  karensDaysLast365: number;
  karensWaived: boolean;
  agreementMeta: {
    id: string;
    name: string;
    enabled: boolean;
    versionLabel?: string;
    checksum?: string;
  };
  taxMeta: {
    table: number;
    column: number;
    year?: number;
    checksum?: string;
  };
  calculationChecksum?: string;
  engineVersion?: string;
  vacationAccrualSek: number;
  atfAccrualSek: number;
};

export function filterEntriesInPeriod(
  entries: TimeEntryLike[],
  from: string,
  to: string,
): TimeEntryLike[] {
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  return entries.filter((e) => {
    const d = parseDateOnly(e.date);
    return d >= start && d <= end;
  });
}

export function buildMonthlyPayslip(params: {
  entries: TimeEntryLike[];
  period: PayslipPeriod;
  profile?: PayProfileContext;
  profileSettings?: Partial<PayProfileSettings>;
  /** @deprecated Använd profileSettings.salaryTerms */
  monthlySalarySek?: number;
  referenceDate?: Date;
}): PayslipResult {
  const referenceDate = params.referenceDate ?? new Date();
  const mergedSettings: Partial<PayProfileSettings> | undefined =
    params.profileSettings ??
    (params.monthlySalarySek != null
      ? { salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: params.monthlySalarySek }] }
      : undefined);
  const profile =
    params.profile ??
    buildPayProfileContext({ ...mergedSettings, referenceDate });

  const periodEntries = filterEntriesInPeriod(params.entries, params.period.from, params.period.to);

  const baseSalarySek = proRataMonthlySalary({
    salaryTerms: profile.salaryTerms,
    periodFrom: params.period.from,
    periodTo: params.period.to,
  });

  const profileForPeriod: PayProfileContext = {
    ...profile,
    monthlySalarySek: baseSalarySek,
    hourlyRateSek: deriveHourlyRate(baseSalarySek),
    dailyRateSek: deriveDailyRate(baseSalarySek),
    weeklySickPaySek: deriveWeeklySickPay(baseSalarySek),
    sgiAnnualSek: deriveSgiAnnual(baseSalarySek),
  };

  const absence = computeAbsenceAdjustments(
    params.entries,
    params.period.from,
    params.period.to,
    profileForPeriod,
    referenceDate,
  );

  let obSupplementSek = 0;
  let otSupplementSek = 0;
  for (const entry of periodEntries) {
    const { obSek, otSek } = computeObOvertimeForEntry(profileForPeriod, entry);
    obSupplementSek += obSek;
    otSupplementSek += otSek;
  }
  obSupplementSek = Math.round(obSupplementSek * 100) / 100;
  otSupplementSek = Math.round(otSupplementSek * 100) / 100;

  const gapDays = profile.agreementConfig.reSickGapDays;
  const karensDays = countKarensDaysInLookback(params.entries, referenceDate, gapDays);
  const karensWaived = shouldWaiveKarens(
    params.entries,
    referenceDate,
    profile.agreementConfig.karensWaiverAfterDays,
    gapDays,
  );

  const grossBeforeDeductionsSek = baseSalarySek + obSupplementSek + otSupplementSek;
  const taxableGrossSek = Math.max(
    0,
    Math.round((grossBeforeDeductionsSek - absence.totalDeductionSek) * 100) / 100,
  );
  const taxYear = profile.taxYear ?? 2026;
  const taxSek = getTaxAmount(
    taxableGrossSek,
    profile.taxColumn,
    profile.taxTable,
    taxYear,
    profile.activeTaxTablePack ?? null,
  );
  const netSalarySek = Math.round((taxableGrossSek - taxSek) * 100) / 100;

  const vacation = computeVacationAccrual(profileForPeriod);
  const atf = computeAtfAccrual(profileForPeriod);

  const lineItems: PayslipLineItem[] = [
    {
      type: PayslipLineType.BASE_SALARY,
      incomeSource: 'employer',
      label: 'Månadslön',
      amountSek: baseSalarySek,
    },
  ];

  if (obSupplementSek > 0) {
    lineItems.push({
      type: PayslipLineType.OB_SUPPLEMENT,
      incomeSource: 'employer',
      label: 'OB-tillägg',
      amountSek: obSupplementSek,
    });
  }
  if (otSupplementSek > 0) {
    lineItems.push({
      type: PayslipLineType.OT_SUPPLEMENT,
      incomeSource: 'employer',
      label: 'Övertid',
      amountSek: otSupplementSek,
    });
  }

  for (const line of absence.lines) {
    if (line.deductionSek > 0) {
      lineItems.push({
        type: PayslipLineType.ABSENCE_DEDUCTION,
        incomeSource: 'employer',
        label: line.description,
        amountSek: -line.deductionSek,
        date: line.date,
      });
    }
  }

  lineItems.push({
    type: PayslipLineType.TAX_WITHHELD,
    incomeSource: 'employer',
    label: `Preliminär skatt (tabell ${profile.taxTable}, kol ${profile.taxColumn})`,
    amountSek: -taxSek,
  });

  lineItems.push(...buildFkBenefitLines({ profile: profileForPeriod, absenceLines: absence.lines }));

  if (vacation.monthlyAccrualSek > 0) {
    lineItems.push({
      type: PayslipLineType.VACATION_ACCRUAL,
      incomeSource: 'info',
      label: vacation.label,
      amountSek: 0,
      meta: `Intjänas: ${vacation.monthlyAccrualSek} kr/mån`,
    });
  }
  if (atf.monthlyAccrualSek > 0) {
    lineItems.push({
      type: PayslipLineType.ATF_ACCRUAL,
      incomeSource: 'info',
      label: atf.label,
      amountSek: 0,
      meta: `Intjänas: ${atf.monthlyAccrualSek} kr (~${atf.hoursEquivalent} h)`,
    });
  }

  const employerNetSek = netSalarySek;
  const fkTotalSek = sumLinesBySource(lineItems, 'fk');
  const agsTotalSek = sumLinesBySource(lineItems, 'ags');
  const totalToBankSek = computeTotalToBank(
    lineItems.filter((l) => l.incomeSource !== 'info'),
  );

  const agreementMetaExtra = getAgreementMetaFromPack(
    profile.agreementConfig,
    profile.activeAgreementPack ?? null,
  );
  const taxMetaExtra = getTaxMetaFromPack(
    profile.taxTable,
    taxYear,
    profile.activeTaxTablePack ?? null,
  );

  return {
    period: params.period,
    profile: profileForPeriod,
    baseSalarySek,
    grossBeforeDeductionsSek,
    absenceDeductionSek: absence.totalDeductionSek,
    obSupplementSek,
    otSupplementSek,
    taxableGrossSek,
    taxSek,
    netSalarySek,
    employerNetSek,
    fkTotalSek,
    agsTotalSek,
    totalToBankSek,
    expectedIncomeAdjustmentSek: absence.totalExpectedIncomeSek + fkTotalSek + agsTotalSek,
    hourlyRateSek: profileForPeriod.hourlyRateSek,
    pbb2026Sek: PBB_2026_SEK,
    absenceLines: absence.lines,
    lineItems,
    karensDaysLast365: karensDays,
    karensWaived,
    agreementMeta: {
      id: profile.agreementConfig.id,
      name: profile.agreementDisplayName,
      enabled: profile.collectiveAgreementEnabled,
      versionLabel: agreementMetaExtra.versionLabel,
      checksum: agreementMetaExtra.checksum,
    },
    taxMeta: {
      table: profile.taxTable,
      column: profile.taxColumn,
      year: taxMetaExtra.year,
      checksum: taxMetaExtra.checksum,
    },
    vacationAccrualSek: vacation.monthlyAccrualSek,
    atfAccrualSek: atf.monthlyAccrualSek,
  };
}

/** Preview vid inställningsändring — ingen Firestore. */
export function recomputePayProfilePreview(
  settings: Partial<PayProfileSettings>,
  entries: TimeEntryLike[] = [],
  referenceDate = new Date(),
): PayslipResult {
  const period = getPayslipPeriodForPayday(referenceDate);
  return buildMonthlyPayslip({
    entries,
    period,
    profileSettings: settings,
    referenceDate,
  });
}
