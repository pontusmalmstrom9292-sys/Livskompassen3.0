/**
 * Barnfokus-text — epistemik-prefix innan WORM (citat vs tolkning).
 */

/**
 * Formaterar föräldersvar till barn-silo.
 * Citat om svaret börjar/slutar med citationstecken, annars [tolkning].
 */
export function formatBarnfokusCaptureText(question: string, answer: string): string {
  const q = question.trim();
  const a = answer.trim();
  if (!a) return '';

  const quoted =
    (a.startsWith('"') && a.endsWith('"')) ||
    (a.startsWith('“') && a.endsWith('”')) ||
    (a.startsWith('«') && a.endsWith('»'));

  const core = quoted ? a.replace(/^["“«]|["”»]$/g, '').trim() : a;
  const prefix = quoted ? '[citat]' : '[tolkning]';
  return `${prefix} ${q}\n${core}`.trim();
}
