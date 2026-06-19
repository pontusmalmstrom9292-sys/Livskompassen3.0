/**
 * Våg 29 — citat vs tolkning i children_logs.observation (WORM).
 * Kanon: `.cursor/rules/barn-observation-epistemik.mdc`
 */

export type EpistemicKind = 'citat' | 'tolkning';

const EPISTEMIC_PREFIX_RE = /^\[(citat|tolkning)\]/i;

export function hasEpistemicPrefix(text: string): boolean {
  return EPISTEMIC_PREFIX_RE.test(text.trim());
}

export function parseEpistemicKindFromObservation(text: string): EpistemicKind | null {
  const match = text.trim().match(EPISTEMIC_PREFIX_RE);
  if (!match?.[1]) return null;
  const kind = match[1].toLowerCase();
  return kind === 'citat' || kind === 'tolkning' ? kind : null;
}

export function epistemicKindLabel(kind: EpistemicKind): string {
  return kind === 'citat' ? 'Citat' : 'Tolkning';
}

/** Prefixera observation om den saknar [citat]/[tolkning]. */
export function formatChildObservation(text: string, kind: EpistemicKind): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (hasEpistemicPrefix(trimmed)) return trimmed;
  return `[${kind}] ${trimmed}`;
}

/** Barnfokus: epistemik + frågetyp (gladje, kunskap, …). */
export function formatBarnfokusObservation(
  text: string,
  epistemicKind: EpistemicKind,
  questionKind: string,
): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const withEpistemic = formatChildObservation(trimmed, epistemicKind);
  if (/^\[(citat|tolkning)\]\s+\[[\w_]+\]/i.test(withEpistemic)) return withEpistemic;
  return withEpistemic.replace(
    EPISTEMIC_PREFIX_RE,
    (match) => `${match} [${questionKind}]`,
  );
}

/** Visa-text — ta bort epistemik- och barnfokus-kind-prefix. */
export function stripEpistemicPrefixes(text: string): string {
  let out = text.trim();
  while (EPISTEMIC_PREFIX_RE.test(out)) {
    out = out.replace(EPISTEMIC_PREFIX_RE, '').trimStart();
  }
  out = out.replace(/^\[[\w_]+\]\s*/, '');
  return out;
}

export function inferEpistemicKind(input: {
  authorRole?: 'child' | 'parent';
  category?: string;
  channel?: string;
}): EpistemicKind {
  if (input.authorRole === 'child') return 'citat';
  if (input.category === 'barnfokus') return 'citat';
  if (input.channel === 'barnporten') return 'citat';
  return 'tolkning';
}
