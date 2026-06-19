import type { InboxClassification } from './inboxClassifier';

/** U6 — godkända FACT-kategorier/taggar för auto-kunskap ingest (P1.2). */
const APPROVED_FACT_CATEGORIES = new Set([
  'covert_taktik',
  'barn_hcf',
  'myndighet',
  'neuro_psyk',
  'fact',
  'kunskap',
]);

const APPROVED_TAG_PREFIXES = [
  'kunskap-fact-',
  'cn-',
  'bh-',
  'bank:',
  'seed-approved',
  'manuell',
];

/** Returnerar true om auto-persist till kampspar är tillåten utan HITL-kö. */
export function isKunskapFactApproved(classification: InboxClassification): boolean {
  if (classification.tags.some((t) => t === 'manuell' || t === 'seed-approved')) {
    return true;
  }
  if (APPROVED_FACT_CATEGORIES.has(classification.category.toLowerCase())) {
    return true;
  }
  return classification.tags.some((tag) =>
    APPROVED_TAG_PREFIXES.some((prefix) => tag.startsWith(prefix) || tag.includes(prefix)),
  );
}
