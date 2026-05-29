/**
 * Lager 1 → Lager 2 handoff — deterministisk nyckelordsmatch (ingen LLM).
 * Visar mjuk Reality Vault-ruta; ingen auto-sync till reality_vault.
 */
const HANDOFF_KEYWORDS = [
  'bevis',
  'hotad',
  'hot ',
  'polis',
  'polisanmälan',
  'stämma',
  'stämning',
  'domstol',
  'händelseförlopp',
  'trakasserad',
  'trakasseri',
  'juridisk',
  'åtal',
  'förvaltningsrätt',
  'vårdnadstvist',
] as const;

export function shouldShowJournalHandoff(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  return HANDOFF_KEYWORDS.some((kw) => normalized.includes(kw));
}
