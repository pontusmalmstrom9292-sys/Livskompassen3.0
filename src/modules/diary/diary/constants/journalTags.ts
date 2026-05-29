/** Förslagstaggar för Snabb-läge (max 10 per post, max 30 tecken vardera). */
export const JOURNAL_SUGGESTED_TAGS = [
  'Sömn',
  'Relationer',
  'Jobb',
  'Återhämtning',
  'Kroppen',
  'Familj',
  'Vardag',
  'Tacksamhet',
] as const;

export const JOURNAL_TAG_MAX_COUNT = 10;
export const JOURNAL_TAG_MAX_LENGTH = 30;

export function normalizeJournalTag(raw: string): string {
  return raw.trim().slice(0, JOURNAL_TAG_MAX_LENGTH);
}
