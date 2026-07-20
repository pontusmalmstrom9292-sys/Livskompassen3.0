/**
 * Periodsammanfattning — canonical inkomst från payslip (ej dubbelräkning).
 */
import { parseDateOnly } from '@/core/utils/timeMath';
import { getPayslipPeriodForPayday, type PayslipPeriod } from './payPeriod';

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
  incomeSource: 'payslip' | 'profile';
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
  /** När true: räkna inte ledger-inkomst typ lön (undvik dubbelräkning). */
  usePayslipAsCanonical?: boolean;
}): PeriodEconomySummary {
  const period = params.period ?? getPayslipPeriodForPayday(params.referenceDate);
  const inPeriod = filterLedgerInPeriod(params.ledgerRows, period.from, period.to);

  let ledgerExpensesSek = 0;
  let ledgerIncomeSek = 0;
  let variableExpensesSek = 0;

  const salaryLikeCategories = new Set(['lon', 'lön', 'salary', 'fk', 'ovb']);

  for (const row of inPeriod) {
    if (row.type === 'inkomst') {
      if (params.usePayslipAsCanonical && salaryLikeCategories.has(row.category.toLowerCase())) {
        continue;
      }
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
    incomeSource: params.usePayslipAsCanonical ? 'payslip' : 'profile',
  };
}
