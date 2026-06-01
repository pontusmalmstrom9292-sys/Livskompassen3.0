import type { VaultLog } from '@/core/types/firestore';

const STOPWORDS = new Set(['och', 'att', 'som', 'det', 'en', 'i', 'på', 'är', 'för', 'med', 'av', 'till']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function searchableText(log: VaultLog & { id: string }): string {
  const parts = [log.truth ?? ''];
  if (log.category) parts.push(log.category);
  const tags = (log as VaultLog & { weaverTags?: { emotions?: string[]; actors?: string[] } }).weaverTags;
  if (tags?.emotions?.length) parts.push(tags.emotions.join(' '));
  if (tags?.actors?.length) parts.push(tags.actors.join(' '));
  return parts.join(' ').toLowerCase();
}

export interface VaultMatch {
  log: VaultLog & { id: string };
  score: number;
}

export interface MatchVaultOptions {
  /** Exkludera Vävaren-metadata — visa endast faktiska bevis. */
  evidenceOnly?: boolean;
}

export function matchVaultEvidence(
  vivirText: string,
  vaultLogs: (VaultLog & { id: string })[],
  options: MatchVaultOptions = { evidenceOnly: true }
): VaultMatch[] {
  const tokens = tokenize(vivirText);
  if (tokens.length === 0) return [];

  const filtered = options.evidenceOnly
    ? vaultLogs.filter((log) => log.category !== 'vävaren_metadata')
    : vaultLogs;

  return filtered
    .map((log) => {
      const corpus = searchableText(log);
      const score = tokens.filter((t) => corpus.includes(t)).length;
      return { log, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
