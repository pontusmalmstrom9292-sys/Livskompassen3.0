/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/** Typer för DF content-banker (notis / fråga / citat). */

export type DfEvidenceTier = 'product_copy';

export type DfNotis = {
  id: string;
  text_sv: string;
  evidence_tier: DfEvidenceTier;
};

export type DfQuestionBucket = 'trigger' | 'kansla' | 'coping' | 'varde' | 'beredskap';

export type DfQuestion = {
  id: string;
  /** Saknas på äldre rader — behandla som generisk. */
  bucket?: DfQuestionBucket;
  text_sv: string;
  evidence_tier: DfEvidenceTier;
};

export type DfQuoteCategory =
  | 'vag'
  | 'halt'
  | 'varde'
  | 'urge'
  | 'ankare'
  | 'delay'
  | 'antikop'
  | 'kropp'
  | 'natt'
  | 'ensamhet'
  | 'lapse'
  | 'comeback'
  | 'adhd';

export type DfQuote = {
  id: string;
  category: DfQuoteCategory;
  text_sv: string;
  evidence_tier: DfEvidenceTier;
};

export const DF_QUESTION_BUCKETS = [
  'trigger',
  'kansla',
  'coping',
  'varde',
  'beredskap',
] as const satisfies readonly DfQuestionBucket[];

export function isDfQuestionBucket(value: unknown): value is DfQuestionBucket {
  return typeof value === 'string' && (DF_QUESTION_BUCKETS as readonly string[]).includes(value);
}

/** Defensiv text för bank-rader — trim + fallback. */
export function sanitizeDfBankText(text: unknown, fallback = '…'): string {
  if (typeof text !== 'string') return fallback;
  const trimmed = text.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
