/**
 * Löneperiod — 16 föregående månad → 15 innevarande.
 */
import { formatDateLocal } from './timeMath';

export type PayslipPeriod = {
  from: string;
  to: string;
  label: string;
};

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
