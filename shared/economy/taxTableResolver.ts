/**
 * Skattetabell-resolver — tabell, kolumn, år + valfri Firestore-pack.
 */
import embedded32 from './__fixtures__/taxTable32-2026.json';
import type { TaxBracketRow, TaxTablePack } from './agreements/packTypes';

export type TaxBracket = { min: number; max: number; col1: number };

const COLUMN_FACTOR: Record<1 | 2 | 3 | 4, number> = {
  1: 1,
  2: 1.02,
  3: 0.98,
  4: 0.95,
};

const EMBEDDED_TABLES: Record<string, TaxBracketRow[]> = {
  '32:2026': embedded32.brackets as TaxBracketRow[],
};

function cacheKey(table: number, year: number): string {
  return `${table}:${year}`;
}

function getBrackets(table: number, year: number, userPack?: TaxTablePack | null): TaxBracketRow[] {
  if (userPack && userPack.table === table && userPack.year === year) {
    return userPack.brackets;
  }
  const key = cacheKey(table, year);
  const hit = EMBEDDED_TABLES[key];
  if (hit) return hit;
  // Fallback: tabell 32 2026 om exakt match saknas
  if (table === 32) return EMBEDDED_TABLES['32:2026'];
  return EMBEDDED_TABLES['32:2026'];
}

function col1ForGross(gross: number, brackets: TaxBracketRow[]): number {
  const bracket = brackets.find((b) => gross >= b.min && gross <= b.max);
  if (bracket) return bracket.col1;
  const last = brackets[brackets.length - 1];
  if (last && gross > last.max) return last.col1;
  return 0;
}

/** Preliminärskatt för månadsbrutto (kr). */
export function getTaxAmount(
  monthlyGrossSek: number,
  taxColumn: 1 | 2 | 3 | 4 = 1,
  table = 32,
  year = 2026,
  userPack?: TaxTablePack | null,
): number {
  const gross = Math.round(monthlyGrossSek);
  if (gross <= 0) return 0;
  const brackets = getBrackets(table, year, userPack);
  const base = col1ForGross(gross, brackets);
  return Math.round(base * COLUMN_FACTOR[taxColumn]);
}

export function getTaxBracketForGross(
  monthlyGrossSek: number,
  table = 32,
  year = 2026,
  userPack?: TaxTablePack | null,
): TaxBracket | null {
  const gross = Math.round(monthlyGrossSek);
  const brackets = getBrackets(table, year, userPack);
  return brackets.find((b) => gross >= b.min && gross <= b.max) ?? null;
}

export function getTaxMetaFromPack(
  table: number,
  year: number,
  userPack?: TaxTablePack | null,
): { year: number; checksum: string } {
  if (userPack && userPack.table === table && userPack.year === year) {
    return { year: userPack.year, checksum: userPack.checksum };
  }
  return { year, checksum: 'embedded' };
}
