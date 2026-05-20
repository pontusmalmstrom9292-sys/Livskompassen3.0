import type { VaultLog } from '../../core/types/firestore';

const STOPWORDS = new Set(['och', 'att', 'som', 'det', 'en', 'i', 'på', 'är', 'för', 'med', 'av', 'till']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export interface VaultMatch {
  log: VaultLog & { id: string };
  score: number;
}

export function matchVaultEvidence(
  vivirText: string,
  vaultLogs: (VaultLog & { id: string })[]
): VaultMatch[] {
  const tokens = tokenize(vivirText);
  if (tokens.length === 0) return [];

  return vaultLogs
    .map((log) => {
      const truth = (log.truth ?? '').toLowerCase();
      const score = tokens.filter((t) => truth.includes(t)).length;
      return { log, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
