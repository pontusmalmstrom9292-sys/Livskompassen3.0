/** Tillåtna journal-kategorier (Lager 1) — valideras i klient tills rules-review. */
export const JOURNAL_CATEGORIES = [
  { id: 'tacksamhet', label: 'Tacksamhet' },
  { id: 'orostanke', label: 'Orostanke' },
  { id: 'relationer', label: 'Relationer' },
  { id: 'kropp', label: 'Kropp' },
  { id: 'vardag', label: 'Vardag' },
  { id: 'insikt', label: 'Insikt' },
] as const;

export type JournalCategoryId = (typeof JOURNAL_CATEGORIES)[number]['id'];

const CATEGORY_IDS = new Set<string>(JOURNAL_CATEGORIES.map((c) => c.id));

export function isJournalCategoryId(value: string): value is JournalCategoryId {
  return CATEGORY_IDS.has(value);
}
