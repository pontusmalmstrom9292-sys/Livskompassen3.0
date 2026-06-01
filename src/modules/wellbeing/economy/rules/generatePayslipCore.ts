/**
 * Lönespec — ren beräkning (ingen Firestore). Fas 2.
 */
import { formatDateLocal } from '@/shared/utils/dateHelpers';
import { parseDateOnly } from '../../../core/utils/timeMath';
import type { TimeEntryLike } from './payTimeRules';
import {
  computeAbsenceAdjustments,
  countKarensDaysInLookback,
  shouldWaiveKarens,
} from './payAbsenceRules';
import {
  BASE_SALARY_SEK,
  HOURLY_RATE_SEK,
  PBB_2026_SEK,
} from './livsmedel2026';
import { getTaxAmount } from './taxTable32';

export type PayslipPeriod = {
  from: string;
  to: string;
  label: string;
};

export type PayslipResult = {
  period: PayslipPeriod;
  baseSalarySek: number;
  grossBeforeDeductionsSek: number;
  absenceDeductionSek: number;
  taxableGrossSek: number;
  taxSek: number;
  netSalarySek: number;
  expectedIncomeAdjustmentSek: number;
  hourlyRateSek: number;
  pbb2026Sek: number;
  absenceLines: ReturnType<typeof computeAbsenceAdjustments>['lines'];
  karensDaysLast365: number;
  karensWaived: boolean;
};

/** Löneperiod: föregående månad 16 → innevarande månad 15 (körs 16:e). */
export function getPayslipPeriodForPayday(referenceDate = new Date()): PayslipPeriod {
  const y = referenceDate.getFullYear();
  const m = referenceDate.getMonth();
  const from = new Date(y, m - 1, 16, 12, 0, 0);
  const to = new Date(y, m, 15, 12, 0, 0);
  const fromStr = formatDateLocal(from);
  const toStr = formatDateLocal(to);
  return {
    from: fromStr,
    to: toStr,
    label: `${fromStr} – ${toStr}`,
  };
}

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
  monthlySalarySek?: number;
  referenceDate?: Date;
}): PayslipResult {
  const referenceDate = params.referenceDate ?? new Date();
  const baseSalarySek = params.monthlySalarySek ?? BASE_SALARY_SEK;
  const absence = computeAbsenceAdjustments(
    params.entries,
    params.period.from,
    params.period.to,
    referenceDate,
    HOURLY_RATE_SEK,
  );

  const karensDays = countKarensDaysInLookback(params.entries, referenceDate);
  const karensWaived = shouldWaiveKarens(params.entries, referenceDate);

  const grossBeforeDeductionsSek = baseSalarySek;
  const taxableGrossSek = Math.max(
    0,
    Math.round((grossBeforeDeductionsSek - absence.totalDeductionSek) * 100) / 100,
  );
  const taxSek = getTaxAmount(taxableGrossSek);
  const netSalarySek = Math.round((taxableGrossSek - taxSek) * 100) / 100;

  return {
    period: params.period,
    baseSalarySek,
    grossBeforeDeductionsSek,
    absenceDeductionSek: absence.totalDeductionSek,
    taxableGrossSek,
    taxSek,
    netSalarySek,
    expectedIncomeAdjustmentSek: absence.totalExpectedIncomeSek,
    hourlyRateSek: HOURLY_RATE_SEK,
    pbb2026Sek: PBB_2026_SEK,
    absenceLines: absence.lines,
    karensDaysLast365: karensDays,
    karensWaived,
  };
}
