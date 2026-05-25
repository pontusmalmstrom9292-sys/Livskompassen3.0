/**
 * Skattetabell 32, kolumn 1 — månadslön 2026 (SKVFS 2025:20).
 * Källa: fixtures/taxTable32-2026.json (parsad från Skatteverket PDF).
 */
import tableData from './__fixtures__/taxTable32-2026.json';

export type TaxBracket = { min: number; max: number; col1: number };

const BRACKETS: TaxBracket[] = tableData.brackets;

/** Preliminärskatt Tabell 32 kolumn 1 för månadsbrutto (kr). */
export function getTaxAmount(monthlyGrossSek: number): number {
  const gross = Math.round(monthlyGrossSek);
  if (gross <= 0) return 0;

  const bracket = BRACKETS.find((b) => gross >= b.min && gross <= b.max);
  if (bracket) return bracket.col1;

  const last = BRACKETS[BRACKETS.length - 1];
  if (gross > last.max) return last.col1;

  return 0;
}

export function getTaxBracketForGross(monthlyGrossSek: number): TaxBracket | null {
  const gross = Math.round(monthlyGrossSek);
  return BRACKETS.find((b) => gross >= b.min && gross <= b.max) ?? null;
}
