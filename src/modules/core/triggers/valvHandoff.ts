/**
 * Deterministisk Valv-handoff (ingen LLM) — delad av Dagbok, Hamn och Valv-logga.
 * Ingen auto-sync till reality_vault.
 */
const VALV_HANDOFF_KEYWORDS = [
  'bevis',
  'valv',
  'reality vault',
  'verklighetsvalv',
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
  'vårdnad',
  'motpart',
  'familjerätt',
  'myndighet',
  'gaslighting',
  'grey rock',
  'biff',
  'sms från',
  'mejl från',
  'mot mig',
] as const;

export function shouldShowValvHandoff(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  return VALV_HANDOFF_KEYWORDS.some((kw) => normalized.includes(kw));
}

export function shouldSuggestVaultPatternScan(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  return ['mönster', 'monster', 'upprep', 'igen', 'alltid', 'aldrig'].some((kw) =>
    normalized.includes(kw),
  );
}
