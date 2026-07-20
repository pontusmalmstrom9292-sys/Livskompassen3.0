/** Kollektivavtal — konfiguration från YAML-resolver. */

export type CollectiveAgreementId = 'SE.livs.livsmedel' | 'SE.handels' | 'none';

export type TaxColumn = 1 | 2 | 3 | 4;

export type AgreementConfig = {
  id: CollectiveAgreementId;
  name: string;
  versionLabel: string;
  /** Semesterersättning (andel av månadslön). Livs 0.132, lag 0.12 */
  vacationPayFraction: number;
  /** Semesterdagar divisor (Livs 21.75) */
  vacationDayDivisor: number;
  /** Arbetstidskonto — andel av månadslön (Livs 2026: 0.0292) */
  atfAccrualFraction: number;
  /** Karens: andel av veckosjuklön (0.20) */
  karensWeeklySickPayFraction: number;
  /** Sjuk dag 2–14: arbetsgivarens nettotapp (0.20 = 80 % sjuklön) */
  sickDay2_14EmployerLossFraction: number;
  /** AGS top-up dag 15+ (Livs 0.10) */
  agsSickTopUpFraction: number;
  /** AGS aktivt */
  agsEnabled: boolean;
  /** Karens upphävs efter N karensdagar / 365 */
  karensWaiverAfterDays: number;
  /** VAB simulerad nettoersättning */
  vabNetReplacementFraction: number;
  /** 5-dagars återinsjuknande — ny karens om >5 kalenderdagar mellan episoder */
  reSickGapDays: number;
};

export type AgreementYamlShape = {
  id: CollectiveAgreementId;
  name: string;
  versionLabel: string;
  vacationPayFraction: number;
  vacationDayDivisor: number;
  atfAccrualFraction: number;
  karensWeeklySickPayFraction: number;
  sickDay2_14EmployerLossFraction: number;
  agsSickTopUpFraction: number;
  agsEnabled: boolean;
  karensWaiverAfterDays: number;
  vabNetReplacementFraction: number;
  reSickGapDays: number;
};
