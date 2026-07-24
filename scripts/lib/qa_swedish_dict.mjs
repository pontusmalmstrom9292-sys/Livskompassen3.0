/**
 * Shared Swedish UI dictionary — typos, English leaks, banned copy.
 * Autofix ONLY applies to clear misspellings in string literals — never identifiers.
 */
export const BANNED_UI_TERMS = [
  'Mitt Vit',
  'Paralys-Brytaren',
  'Paralys-brytare',
  'Paralysbrytaren',
  'Känslokort',
  'Frågesport',
];

/**
 * Exact typo → correct Swedish.
 * NEVER include module prefixes like Mabra/MaBra (identifiers).
 * Product label "MåBra" is checked at runtime only.
 */
export const TYPO_FIXES = [
  { bad: 'Installningar', good: 'Inställningar' },
  { bad: 'Inställnigar', good: 'Inställningar' },
  { bad: 'Inställinger', good: 'Inställningar' },
  { bad: 'Välkommmen', good: 'Välkommen' },
  { bad: 'Välkomenn', good: 'Välkommen' },
  { bad: 'Reflextion', good: 'Reflektion' },
  { bad: 'Reflektionn', good: 'Reflektion' },
  { bad: 'Familijen', good: 'Familjen' },
  { bad: 'Barnfokuss', good: 'Barnfokus' },
  { bad: 'Drogfrihete', good: 'Drogfrihet' },
  { bad: 'Planeríng', good: 'Planering' },
  { bad: 'Arbetslivv', good: 'Arbetsliv' },
  { bad: 'Anteckninig', good: 'Anteckning' },
  { bad: 'Inkasst', good: 'Inkast' },
  { bad: 'Speglarr', good: 'Speglar' },
  { bad: 'Valvett', good: 'Valvet' },
];

/** Visible product-name slips (runtime UI only — never autofix identifiers). */
export const PRODUCT_LABEL_SLIPS = [
  { bad: 'Mabra', good: 'MåBra' },
  { bad: 'MaBra', good: 'MåBra' },
  { bad: 'Måbra', good: 'MåBra' },
];

/** English UI labels that should be Swedish in product chrome. */
export const ENGLISH_UI_LEAKS = [
  { re: /\bSave\b/, hint: 'Spara' },
  { re: /\bCancel\b/, hint: 'Avbryt' },
  { re: /\bDelete\b/, hint: 'Radera' },
  { re: /\bSettings\b/, hint: 'Inställningar' },
  { re: /\bLoading\.\.\./, hint: 'Laddar…' },
  { re: /\bSubmit\b/, hint: 'Skicka' },
  { re: /\bContinue\b/, hint: 'Fortsätt' },
  { re: /\bClick here\b/i, hint: 'Tryck här' },
  { re: /\bSign in\b/i, hint: 'Logga in' },
  { re: /\bSign out\b/i, hint: 'Logga ut' },
  { re: /\bWelcome\b/, hint: 'Välkommen' },
  { re: /\bRetry\b/, hint: 'Försök igen' },
];

export const WEIRD_UI = [
  { re: /\blorem ipsum\b/i, code: 'LOREM' },
  { re: /\bTODO:\b/, code: 'TODO_IN_UI' },
  { re: /\bFIXME:\b/, code: 'FIXME_IN_UI' },
  { re: /\[\s*object Object\s*\]/, code: 'OBJECT_UI' },
  { re: /\?\?\?+/, code: 'QUESTION_MARKS' },
];

export function allowEnglishContext(text) {
  return /localhost|http|chrome|webkit|firebase|playwright|maestro|sdk|api|json|css|tsx|npm|vite|dev\/|Theme Lab|Obsidian|Forge|HTML|CTA|PIN|SOS|BIFF|ADHD|GAD|RAG|WORM|CMEK|G85|Auth State|console\.|Error:/i.test(
    text,
  );
}

/** Extract JS/TS string literals for safe typo scanning. */
export function extractStringLiterals(source) {
  const out = [];
  const re = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let m;
  while ((m = re.exec(source))) {
    const lit = m[2];
    if (!lit || lit.length < 3 || lit.length > 120) continue;
    if (/^[\w./@$-]+$/.test(lit) && !/\s/.test(lit)) continue; // paths/ids
    out.push(lit);
  }
  return out;
}
