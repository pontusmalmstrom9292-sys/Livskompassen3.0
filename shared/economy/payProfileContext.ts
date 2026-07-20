/**
 * Löneprofil — en källa till sanning (tre inställningar → härledda värden).
 */
import { resolveAgreementConfig, getAgreementDisplayName } from './agreements/resolver';
import type { AgreementConfig, CollectiveAgreementId, TaxColumn } from './agreements/types';
import type { AgreementPack, TaxTablePack } from './agreements/packTypes';
import { getPayslipPeriodForPayday, type PayslipPeriod } from './payPeriod';

export type { CollectiveAgreementId, TaxColumn } from './agreements/types';

export const PBB_2026_SEK = 59_200;
export const SGI_ANNUAL_CAP_SEK = 592_000;
export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_YEAR = 52;
export const HOURS_PER_WEEK = 40;
export const DAYS_PER_YEAR = 365;
export const DAILY_WORK_HOURS = 8;

export const DEFAULT_MONTHLY_SALARY_SEK = 36_470;
export const DEFAULT_TAX_TABLE = 32;
export const DEFAULT_TAX_COLUMN: TaxColumn = 1;

export type SalaryTerm = {
  effectiveFrom: string;
  monthlySalarySek: number;
};

export type PayProfileSettings = {
  salaryTerms: SalaryTerm[];
  collectiveAgreementEnabled: boolean;
  collectiveAgreementId: CollectiveAgreementId;
  taxTable: number;
  taxColumn: TaxColumn;
  taxYear?: number;
  activeAgreementPack?: AgreementPack | null;
  activeTaxTablePack?: TaxTablePack | null;
};

export type PayProfileContext = PayProfileSettings & {
  monthlySalarySek: number;
  hourlyRateSek: number;
  dailyRateSek: number;
  weeklySickPaySek: number;
  sgiAnnualSek: number;
  agreementConfig: AgreementConfig;
  agreementDisplayName: string;
  nextPayslipPeriod: PayslipPeriod;
};

export function deriveHourlyRate(monthlySalarySek: number): number {
  return (
    Math.round(((monthlySalarySek * MONTHS_PER_YEAR) / (WEEKS_PER_YEAR * HOURS_PER_WEEK)) * 100) / 100
  );
}

export function deriveDailyRate(monthlySalarySek: number): number {
  return Math.round(((monthlySalarySek * MONTHS_PER_YEAR) / DAYS_PER_YEAR) * 100) / 100;
}

export function deriveSgiAnnual(monthlySalarySek: number): number {
  return Math.min(Math.round(monthlySalarySek * MONTHS_PER_YEAR), SGI_ANNUAL_CAP_SEK);
}

/** Genomsnittlig veckosjuklön — månadslön × 12 / 52 (bas för karens 20 %). */
export function deriveWeeklySickPay(monthlySalarySek: number): number {
  return Math.round(((monthlySalarySek * MONTHS_PER_YEAR) / WEEKS_PER_YEAR) * 100) / 100;
}

export function resolveActiveSalaryTerm(
  salaryTerms: SalaryTerm[],
  referenceDate: Date = new Date(),
): SalaryTerm {
  const ref = referenceDate.toISOString().slice(0, 10);
  const sorted = [...salaryTerms].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
  const hit = sorted.find((t) => t.effectiveFrom <= ref);
  if (hit) return hit;
  return sorted[sorted.length - 1] ?? { effectiveFrom: '2000-01-01', monthlySalarySek: DEFAULT_MONTHLY_SALARY_SEK };
}

export function buildPayProfileContext(
  settings: Partial<PayProfileSettings> & { referenceDate?: Date },
): PayProfileContext {
  const referenceDate = settings.referenceDate ?? new Date();
  const salaryTerms =
    settings.salaryTerms && settings.salaryTerms.length > 0
      ? settings.salaryTerms
      : [{ effectiveFrom: '2000-01-01', monthlySalarySek: DEFAULT_MONTHLY_SALARY_SEK }];

  const collectiveAgreementEnabled = settings.collectiveAgreementEnabled ?? true;
  const collectiveAgreementId = settings.collectiveAgreementId ?? 'SE.livs.livsmedel';
  const taxTable = settings.taxTable ?? DEFAULT_TAX_TABLE;
  const taxColumn = settings.taxColumn ?? DEFAULT_TAX_COLUMN;
  const taxYear = settings.taxYear ?? 2026;
  const refIso = referenceDate.toISOString().slice(0, 10);

  const active = resolveActiveSalaryTerm(salaryTerms, referenceDate);
  const monthlySalarySek = active.monthlySalarySek;
  const agreementConfig = resolveAgreementConfig({
    collectiveAgreementEnabled,
    collectiveAgreementId,
    referenceDate: refIso,
    userPack: settings.activeAgreementPack ?? null,
  });

  return {
    salaryTerms,
    collectiveAgreementEnabled,
    collectiveAgreementId,
    taxTable,
    taxColumn,
    taxYear,
    activeAgreementPack: settings.activeAgreementPack ?? null,
    activeTaxTablePack: settings.activeTaxTablePack ?? null,
    monthlySalarySek,
    hourlyRateSek: deriveHourlyRate(monthlySalarySek),
    dailyRateSek: deriveDailyRate(monthlySalarySek),
    weeklySickPaySek: deriveWeeklySickPay(monthlySalarySek),
    sgiAnnualSek: deriveSgiAnnual(monthlySalarySek),
    agreementConfig,
    agreementDisplayName: getAgreementDisplayName(agreementConfig),
    nextPayslipPeriod: getPayslipPeriodForPayday(referenceDate),
  };
}

export function defaultPayProfileSettings(): PayProfileSettings {
  return {
    salaryTerms: [{ effectiveFrom: '2000-01-01', monthlySalarySek: DEFAULT_MONTHLY_SALARY_SEK }],
    collectiveAgreementEnabled: true,
    collectiveAgreementId: 'SE.livs.livsmedel',
    taxTable: DEFAULT_TAX_TABLE,
    taxColumn: DEFAULT_TAX_COLUMN,
  };
}

/** Pro-rata månadslön vid lönshöjning mitt i löneperiod. */
export function proRataMonthlySalary(params: {
  salaryTerms: SalaryTerm[];
  periodFrom: string;
  periodTo: string;
}): number {
  const from = new Date(`${params.periodFrom}T12:00:00`);
  const to = new Date(`${params.periodTo}T12:00:00`);
  const totalDays = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);

  let weighted = 0;
  for (let i = 0; i < totalDays; i += 1) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const term = resolveActiveSalaryTerm(params.salaryTerms, d);
    weighted += term.monthlySalarySek;
  }
  return Math.round(weighted / totalDays);
}
