/**
 * Deterministic KASAM scoring — no LLM (cost-guard).
 * Begriplighet, Hanterbarhet, Meningsfullhet från journal + kampspar-text.
 */

export interface KasamScores {
  comprehensible: number;
  manageable: number;
  meaningful: number;
  overall: number;
  journalSnippetCount: number;
  kampsparSnippetCount: number;
}

const COMPREHENSIBLE_HINTS = [
  'förstod',
  'begripl',
  'klart',
  'logiskt',
  'mening',
  'struktur',
  'plan',
  'vet vad',
  'tydlig',
];

const MANAGEABLE_HINTS = [
  'hanter',
  'klarade',
  'fixade',
  'steg',
  'orkade',
  'gick',
  'lugn',
  'paus',
  'micro',
  'liten',
];

const MEANINGFUL_HINTS = [
  'mening',
  'viktigt',
  'tacksam',
  'glad',
  'närvar',
  'barn',
  'familj',
  'kärlek',
  'syfte',
  'värde',
  'stolthet',
];

function scoreDimension(text: string, hints: string[]): number {
  const lower = text.toLowerCase();
  if (!lower.trim()) return 40;
  let hits = 0;
  for (const hint of hints) {
    if (lower.includes(hint)) hits += 1;
  }
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  const density = Math.min(hits / 3, 1);
  const volume = Math.min(wordCount / 80, 1);
  return Math.round(35 + density * 40 + volume * 25);
}

/** Aggregate snippets into KASAM scores (0–100 per dimension). */
export function scoreKasamFromSnippets(
  journalSnippets: string[],
  kampsparSnippets: string[],
): KasamScores {
  const combined = [...journalSnippets, ...kampsparSnippets].join('\n');
  const comprehensible = scoreDimension(combined, COMPREHENSIBLE_HINTS);
  const manageable = scoreDimension(combined, MANAGEABLE_HINTS);
  const meaningful = scoreDimension(combined, MEANINGFUL_HINTS);
  const overall = Math.round((comprehensible + manageable + meaningful) / 3);

  return {
    comprehensible,
    manageable,
    meaningful,
    overall,
    journalSnippetCount: journalSnippets.length,
    kampsparSnippetCount: kampsparSnippets.length,
  };
}
