import type { InboxClassification } from './inboxClassifier';

/**
 * U6 — strikta FACT-grindar för auto-kunskap (kb_docs).
 * category "kunskap" ensam räcker INTE — kräver godkänd tag/prefix eller seed/manuell.
 */
const APPROVED_FACT_CATEGORIES = new Set([
  'covert_taktik',
  'barn_hcf',
  'myndighet',
  'neuro_psyk',
  'fact',
]);

const APPROVED_TAG_PREFIXES = [
  'kunskap-fact-',
  'cn-',
  'bh-',
  'bank:',
  'seed-approved',
  'manuell',
];

const APPROVED_EXACT_TAGS = new Set(['manuell', 'seed-approved', 'hitl-confirmed']);

/** Returnerar true om auto-persist till kb_docs är tillåten utan HITL-kö. */
export function isKunskapFactApproved(classification: InboxClassification): boolean {
  if (classification.tags.some((t) => APPROVED_EXACT_TAGS.has(t.toLowerCase()))) {
    return true;
  }
  const hasApprovedTag = classification.tags.some((tag) =>
    APPROVED_TAG_PREFIXES.some((prefix) => tag.startsWith(prefix) || tag.includes(prefix)),
  );
  if (hasApprovedTag) return true;

  const cat = classification.category.toLowerCase();
  // category "kunskap" alone is NOT enough (Evigt Minne M2)
  if (cat === 'kunskap') return false;
  return APPROVED_FACT_CATEGORIES.has(cat);
}
