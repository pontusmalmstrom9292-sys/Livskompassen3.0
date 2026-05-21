/**
 * Deterministisk guardrail för Måbra-coach — ex/konflikt/gaslighting → Speglar.
 * Ingen LLM; lightweight heuristik (DCAP-liknande mönster, svenska).
 */

const STRONG_PATTERNS: RegExp[] = [
  /\bgaslight\w*/i,
  /\bdarvo\b/i,
  /\bbarnens (mamma|pappa)\b/i,
  /\bdu hittar på\b/i,
  /\bdu är (galen|psykisk|instabil)\b/i,
  /\b(silent treatment|tystnadstraff)\b/i,
  /\bnarciss\w*/i,
];

const WEAK_PATTERNS: RegExp[] = [
  /\b(ex|expartner|före detta|fd\.?)\b/i,
  /\b(sms|mejl|meddelande)\b/i,
  /\b(konflikt|gräl|bråk)\b/i,
  /\b(manipulation|projicera\w*|anklag\w*)\b/i,
  /\b(vårdnad|umgänges\w*)\b/i,
  /\b(grey rock|biff)\b/i,
  /\b(hon|han)\s+(sa|skrev|hotade|anklagade)\b/i,
];

export const MABRA_SPEGLAR_REDIRECT_MESSAGE =
  'Det här passar bättre i Speglar — validering och spegling kring konflikt och gaslighting. Måbra fokuserar på inåtvänd återhämtning efter övningen.';

export function shouldRedirectMabraCoachToSpeglar(text: string | undefined): boolean {
  const trimmed = text?.trim();
  if (!trimmed) return false;

  for (const pattern of STRONG_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }

  let weakHits = 0;
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(trimmed)) weakHits += 1;
  }
  return weakHits >= 2;
}
