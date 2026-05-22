/**
 * U5.5 — Kompis/Kunskap → Barnen-modul (neutral ton, ingen Valv-RAG).
 * Deterministisk heuristik; läser aldrig children_logs.
 */

const VALV_FORENSIC_PATTERNS: RegExp[] = [
  /\b(verklighetsvalv|reality_vault|sanningens sköld)\b/i,
  /\b(dossier|bevisföring|forensik)\b/i,
  /\b(hamn|hamnen)\b/i,
  /\bgaslight\w*/i,
  /\b(grey rock|biff)\s+(svar|svara)\b/i,
  /\b(sms|mejl|meddelande)\s+(från|från min ex)\b/i,
  /\b(ex|expartner|manipulation|darvo)\b/i,
];

/** Dokumentationsintent för Barnen-silo — inte generella Minne-frågor om skola/rutin. */
const BARNEN_DOC_INTENT_PATTERNS: RegExp[] = [
  /\blivslogg\w*/i,
  /\bbalansmät\w*/i,
  /\bchildren_logs\b/i,
  /\bbbic\b/i,
  /\blogga\b.*\b(barn|barnens|sömn|aptit|rutin|skola|kasper|arvids?)\b/i,
  /\bdokumentera\b.*\b(barn|barnens|vardag|kasper|arvids?)\b/i,
  /\b(hur|var)\s+(loggar|skriver|sparar|dokumenterar)\s+.*\b(barn|barnens|kasper|arvids?)\b/i,
  /\b(familjen)\b.*\b(livslogg|bbic|logg)\b/i,
  /\b(barnens|barnets)\s+(sömn|aptit|skola|rutin|humör)\b.*\b(logg|spara|dokument)\b/i,
];

export const BARNEN_MODULE_ROUTE = {
  path: '/familjen',
  label: 'Familjen · Livsloggar',
  silo: 'barnen' as const,
};

export const BARNEN_MODULE_REDIRECT_MESSAGE =
  'Det hör till Familjen · Livsloggar — neutral dokumentation av barnens vardag (BBIC, sömn, aptit). Kunskapsvalvet svarar mot Minne; barn-data ligger i en separat silo utan Valv-ton.';

export function shouldRouteKompisToBarnen(text: string | undefined): boolean {
  const trimmed = text?.trim();
  if (!trimmed) return false;

  for (const pattern of VALV_FORENSIC_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  for (const pattern of BARNEN_DOC_INTENT_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }

  return false;
}
