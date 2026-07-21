/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Content safety gate — kör före merge av DF-bankar.
 * Returnerar lista med fel (tom = PASS).
 */

const FORBIDDEN = [
  /ring\s*113\b/i,
  /tel:113\b/i,
  /\bstreak\b/i,
  /\bXP\b/,
  /leaderboard/i,
  /community feed/i,
  /skärp dig/i,
  /du borde skämmas/i,
  /du föll\b/i,
  /misslyckades/i,
  /tänk på barnen/i,
  /hur man får tag/i,
  /dosråd/i,
] as const;

const REQUIRED_EMERGENCY_HINTS = [/112/, /90101|1177|Droghjälpen/];

export function lintDfText(text: string, id = 'unknown'): string[] {
  const errors: string[] = [];
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`${id}: forbidden pattern ${re}`);
  }
  return errors;
}

export function lintDfCorpus(
  items: ReadonlyArray<{ id: string; text_sv: string }>,
): string[] {
  const errors: string[] = [];
  for (const item of items) {
    errors.push(...lintDfText(item.text_sv, item.id));
  }
  return errors;
}

export function assertEmergencyCopyPresent(blob: string): string[] {
  const errors: string[] = [];
  for (const re of REQUIRED_EMERGENCY_HINTS) {
    if (!re.test(blob)) errors.push(`missing emergency hint: ${re}`);
  }
  return errors;
}
