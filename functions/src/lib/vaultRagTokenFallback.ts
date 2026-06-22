const STOPWORDS = new Set(['och', 'att', 'som', 'det', 'en', 'i', 'på', 'är', 'för', 'med', 'av', 'till']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function searchableText(log: any): string {
  const parts = [log.truth ?? ''];
  if (log.category) parts.push(log.category);
  const tags = log.weaverTags;
  if (tags?.emotions?.length) parts.push(tags.emotions.join(' '));
  if (tags?.actors?.length) parts.push(tags.actors.join(' '));
  return parts.join(' ').toLowerCase();
}

export function matchVaultEvidence(
  vivirText: string,
  vaultLogs: any[]
): { log: any; score: number }[] {
  const tokens = tokenize(vivirText);
  if (tokens.length === 0) return [];

  return vaultLogs
    .map((log) => {
      const corpus = searchableText(log);
      const score = tokens.filter((t) => corpus.includes(t)).length;
      return { log, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
