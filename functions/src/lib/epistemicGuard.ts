import type { DcapResult } from '../agents/DCAP';
import type { GransArkitektenResult } from '../agents/gransArkitektenAgent';

/** Placeholder/fallback — räknas inte som observerbar fakta i meddelandet. */
const PLACEHOLDER_CLEAN_FACTS = [
  'extrahera logistik manuellt',
  'extrahera logistik manuellt från meddelandet',
];

const META_THEORY_INPUT =
  /\b(narcissist|alltid\s+varit|mönster\s+över\s+tid|hon\s+är\s+|han\s+är\s+)\b/i;

const LOGISTICS_IN_FACT =
  /\b(\d{4}-\d{2}-\d{2}|\d{1,2}[./]\d{1,2}|sms|mejl|mail|hämtning|lämning|tid|datum|soc|advokat|domstol)\b/i;

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function isPlaceholderFact(fact: string): boolean {
  const n = normalizeForMatch(fact);
  return PLACEHOLDER_CLEAN_FACTS.some((p) => n.includes(p));
}

/** Faktum anses jordat om det delar substantiell substring med inklistrad text. */
export function hasGroundedCleanFact(message: string, cleanFacts: string[]): boolean {
  const msgNorm = normalizeForMatch(message);
  if (msgNorm.length < 8) return false;

  for (const raw of cleanFacts) {
    const fact = normalizeForMatch(raw);
    if (fact.length < 12 || isPlaceholderFact(fact)) continue;
    if (fact.length >= 20 && msgNorm.includes(fact.slice(0, Math.min(24, fact.length)))) {
      return true;
    }
    const words = fact.split(/\s+/).filter((w) => w.length >= 5);
    const hits = words.filter((w) => msgNorm.includes(w)).length;
    if (words.length >= 2 && hits >= 2) return true;
    if (words.length === 1 && hits === 1 && fact.length >= 15) return true;
  }
  return false;
}

/** DCAP-träffar i inklistrad text = observerbart innehåll (Hamn ephemeral). */
export function hasDcapObservationInMessage(message: string, dcap: DcapResult): boolean {
  const msgNorm = normalizeForMatch(message);
  if (msgNorm.length < 12) return false;

  for (const detection of dcap.detections) {
    const pat = normalizeForMatch(detection.matchedPattern ?? '');
    if (pat.length >= 6 && msgNorm.includes(pat)) return true;
  }
  return false;
}

/**
 * Hamn/BIFF epistemisk guard — ephemeral-only (ingen WORM-läsning).
 * Kod vinner över LLM om resolver säger true.
 */
export function resolveHamnTheoryWithoutEvidence(
  message: string,
  grans: GransArkitektenResult,
  dcap: DcapResult,
  llmExplicit?: boolean,
): boolean {
  const techniques =
    grans.techniques.filter((t) => t && t !== 'UNKNOWN').length > 0
      ? grans.techniques
      : dcap.detections.map((d) => d.technique).filter((t) => t !== 'UNKNOWN');

  const grounded =
    hasGroundedCleanFact(message, grans.cleanFacts) ||
    hasDcapObservationInMessage(message, dcap);

  if (llmExplicit === true) return true;

  if (techniques.length > 0 && !grounded) return true;

  if (META_THEORY_INPUT.test(message) && !LOGISTICS_IN_FACT.test(grans.cleanFacts.join(' '))) {
    if (!grounded) return true;
  }

  return false;
}
