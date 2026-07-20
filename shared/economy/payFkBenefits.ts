/**
 * FK-ersättning + AGS — simulerad (ej FK:s beslut).
 */
import type { PayProfileContext } from './payProfileContext';
import { PBB_2026_SEK } from './payProfileContext';
import type { AbsenceLine } from './payAbsenceRules';

export type IncomeSource = 'employer' | 'fk' | 'ags' | 'akassa' | 'info';

export const PayslipLineType = {
  BASE_SALARY: 'BASE_SALARY',
  ABSENCE_DEDUCTION: 'ABSENCE_DEDUCTION',
  TAX_WITHHELD: 'TAX_WITHHELD',
  FK_SICK_PAY: 'FK_SICK_PAY',
  FK_VAB: 'FK_VAB',
  FK_PARENTAL: 'FK_PARENTAL',
  FK_TAX_WITHHELD: 'FK_TAX_WITHHELD',
  AGS_SICK_TOPUP: 'AGS_SICK_TOPUP',
  AKASSA_BENEFIT: 'AKASSA_BENEFIT',
  VACATION_ACCRUAL: 'VACATION_ACCRUAL',
  ATF_ACCRUAL: 'ATF_ACCRUAL',
  OB_SUPPLEMENT: 'OB_SUPPLEMENT',
  OT_SUPPLEMENT: 'OT_SUPPLEMENT',
  INFO: 'INFO',
} as const;

export type PayslipLineType = (typeof PayslipLineType)[keyof typeof PayslipLineType];

export type PayslipLineItem = {
  type: PayslipLineType;
  incomeSource: IncomeSource;
  label: string;
  amountSek: number;
  date?: string;
  meta?: string;
};

/** Sjukpenning per dag — min(SGI, 10×PBB) × 0,97 × 0,80 / 365. Tak ~1259 kr/dag 2026. */
export function computeFkSickPayPerDay(sgiAnnualSek: number): number {
  const base = Math.min(sgiAnnualSek, PBB_2026_SEK * 10);
  const daily = (base * 0.97 * 0.8) / 365;
  return Math.round(daily * 100) / 100;
}

export function computeFkSickPayTotal(sgiAnnualSek: number, days: number): number {
  return Math.round(computeFkSickPayPerDay(sgiAnnualSek) * days * 100) / 100;
}

/** AGS +10 % top-up på FK-sjukpenning (Livs dag 15+). */
export function computeAgsSickTopUp(fkSickPaySek: number, topUpFraction: number): number {
  if (topUpFraction <= 0 || fkSickPaySek <= 0) return 0;
  return Math.round(fkSickPaySek * topUpFraction * 100) / 100;
}

export function buildFkBenefitLines(params: {
  profile: PayProfileContext;
  absenceLines: AbsenceLine[];
}): PayslipLineItem[] {
  const lines: PayslipLineItem[] = [];
  const { profile, absenceLines } = params;
  const cfg = profile.agreementConfig;

  const sick15Days = absenceLines.filter(
    (l) => l.description.includes('dag 15') || l.category === 'Sjuk dag 15+',
  );
  const fkSickDays = sick15Days.length;
  if (fkSickDays > 0) {
    const fkAmount = computeFkSickPayTotal(profile.sgiAnnualSek, fkSickDays);
    lines.push({
      type: PayslipLineType.FK_SICK_PAY,
      incomeSource: 'fk',
      label: `Sjukpenning (${fkSickDays} dag${fkSickDays > 1 ? 'ar' : ''})`,
      amountSek: fkAmount,
      meta: 'Simulerad FK — jämför med beslut',
    });

    if (cfg.agsEnabled && cfg.agsSickTopUpFraction > 0) {
      const ags = computeAgsSickTopUp(fkAmount, cfg.agsSickTopUpFraction);
      if (ags > 0) {
        lines.push({
          type: PayslipLineType.AGS_SICK_TOPUP,
          incomeSource: 'ags',
          label: 'AGS tillägg sjuk dag 15+',
          amountSek: ags,
        });
      }
    }
  }

  const vabLines = absenceLines.filter((l) => l.category === 'VAB' && l.expectedIncomeSek > 0);
  if (vabLines.length > 0) {
    const vabTotal = Math.round(
      vabLines.reduce((s, l) => s + l.expectedIncomeSek, 0) * 100,
    ) / 100;
    lines.push({
      type: PayslipLineType.FK_VAB,
      incomeSource: 'fk',
      label: `VAB ersättning (${vabLines.length} dag${vabLines.length > 1 ? 'ar' : ''})`,
      amountSek: vabTotal,
      meta: 'Simulerad FK',
    });
  }

  return lines;
}

export function sumLinesBySource(
  lineItems: PayslipLineItem[],
  source: IncomeSource,
): number {
  return Math.round(
    lineItems.filter((l) => l.incomeSource === source).reduce((s, l) => s + l.amountSek, 0) * 100,
  ) / 100;
}

export function computeTotalToBank(lineItems: PayslipLineItem[]): number {
  return Math.round(lineItems.reduce((s, l) => s + l.amountSek, 0) * 100) / 100;
}
