/**
 * Server-side epistemik för children_logs — speglar klient
 * `src/modules/features/family/children/utils/childObservationEpistemics.ts`.
 * Kanon: `.cursor/rules/barn-observation-epistemik.mdc`
 */

export type EpistemicKind = 'citat' | 'tolkning';

const EPISTEMIC_PREFIX_RE = /^\[(citat|tolkning)\]/i;

export function hasEpistemicPrefix(text: string): boolean {
  return EPISTEMIC_PREFIX_RE.test(text.trim());
}

/** Prefixera observation om den saknar [citat]/[tolkning]. */
export function formatChildObservation(text: string, kind: EpistemicKind): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (hasEpistemicPrefix(trimmed)) return trimmed;
  return `[${kind}] ${trimmed}`;
}

export function inferEpistemicKind(input: {
  authorRole?: string;
  category?: string;
  channel?: string;
}): EpistemicKind {
  if (input.authorRole === 'child') return 'citat';
  if (input.category === 'barnfokus') return 'citat';
  if (input.channel === 'barnporten') return 'citat';
  return 'tolkning';
}

/** Synlig för förälder — Barnporten private_child får aldrig in i RAG/dossier. */
export function isParentVisibleChildLog(data: { visibility?: unknown }): boolean {
  return data.visibility !== 'private_child';
}
