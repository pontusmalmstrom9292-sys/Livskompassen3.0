/**
 * Periodsammanfattning (Kalkylark I1–I5-lik) — ren logik.
 */
import { parseDateOnly } from '@/core/utils/timeMath';
import { getPayslipPeriodForPayday, type PayslipPeriod } from './generatePayslipCore';

export type LedgerRowLike = {
  date: string;
  category: string;
  amountSek: number;
  type: 'utgift' | 'inkomst';
};

export type PeriodEconomySummary = {
  period: PayslipPeriod;
  monthlySalarySek: number;
  fixedBillsSumSek: number;
  ledgerExpensesSek: number;
  ledgerIncomeSek: number;
  variableExpensesSek: number;
  estimatedBalanceSek: number;
  ledgerRowCount: number;
};

function isRorligCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c.includes('rörl') || c === 'rorliga';
}

export function filterLedgerInPeriod(
  rows: LedgerRowLike[],
  from: string,
  to: string,
): LedgerRowLike[] {
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  return rows.filter((row) => {
    const d = parseDateOnly(row.date);
    return d >= start && d <= end;
  });
}

export function computePeriodEconomySummary(params: {
  period?: PayslipPeriod;
  monthlySalarySek: number;
  fixedBillsSumSek: number;
  ledgerRows: LedgerRowLike[];
  referenceDate?: Date;
}): PeriodEconomySummary {
  const period = params.period ?? getPayslipPeriodForPayday(params.referenceDate);
  const inPeriod = filterLedgerInPeriod(params.ledgerRows, period.from, period.to);

  let ledgerExpensesSek = 0;
  let ledgerIncomeSek = 0;
  let variableExpensesSek = 0;

  for (const row of inPeriod) {
    if (row.type === 'inkomst') {
      ledgerIncomeSek += row.amountSek;
    } else {
      ledgerExpensesSek += row.amountSek;
      if (isRorligCategory(row.category)) {
        variableExpensesSek += row.amountSek;
      }
    }
  }

  ledgerExpensesSek = Math.round(ledgerExpensesSek);
  ledgerIncomeSek = Math.round(ledgerIncomeSek);
  variableExpensesSek = Math.round(variableExpensesSek);

  const estimatedBalanceSek = Math.round(
    params.monthlySalarySek - params.fixedBillsSumSek - ledgerExpensesSek + ledgerIncomeSek,
  );

  return {
    period,
    monthlySalarySek: params.monthlySalarySek,
    fixedBillsSumSek: Math.round(params.fixedBillsSumSek),
    ledgerExpensesSek,
    ledgerIncomeSek,
    variableExpensesSek,
    estimatedBalanceSek,
    ledgerRowCount: inPeriod.length,
  };
}
