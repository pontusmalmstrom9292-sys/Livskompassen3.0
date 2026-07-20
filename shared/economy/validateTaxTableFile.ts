/**
 * Validera skattetabell-JSON (taxTable{N}-{year}.json).
 */
import type { TaxBracketRow } from './agreements/packTypes';
import { sha256Hex } from './checksum';

export type ParsedTaxTableFile = {
  table: number;
  year: number;
  brackets: TaxBracketRow[];
  source?: string;
  checksum: string;
};

const FILENAME_RE = /^taxTable(\d+)-(\d{4})\.json$/i;

export function parseTaxTableFilename(fileName: string): { table: number; year: number } {
  const base = fileName.split('/').pop() ?? fileName;
  const m = base.match(FILENAME_RE);
  if (!m) {
    throw new Error('Filnamnet måste vara taxTable32-2026.json (tabell + år).');
  }
  return { table: Number(m[1]), year: Number(m[2]) };
}

function normalizeBrackets(raw: unknown): TaxBracketRow[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Filen saknar brackets-lista.');
  }
  return raw.map((row, i) => {
    if (!row || typeof row !== 'object') {
      throw new Error(`Ogiltig bracket rad ${i + 1}.`);
    }
    const r = row as Record<string, unknown>;
    const min = Number(r.min);
    const max = Number(r.max);
    const col1 = Number(r.col1);
    if ([min, max, col1].some((n) => Number.isNaN(n))) {
      throw new Error(`Ogiltiga tal i bracket rad ${i + 1}.`);
    }
    return { min, max, col1 };
  });
}

export function parseTaxTableContent(
  content: string,
  fileName: string,
): Omit<ParsedTaxTableFile, 'checksum'> {
  const { table, year } = parseTaxTableFilename(fileName);
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(content) as Record<string, unknown>;
  } catch {
    throw new Error('Filen saknar rätt format.');
  }
  const brackets = normalizeBrackets(raw.brackets);
  const source = raw.source != null ? String(raw.source) : undefined;
  return { table, year, brackets, source };
}

export async function validateTaxTableFile(content: string, fileName: string): Promise<ParsedTaxTableFile> {
  const parsed = parseTaxTableContent(content, fileName);
  const checksum = await sha256Hex({ table: parsed.table, year: parsed.year, brackets: parsed.brackets });
  return { ...parsed, checksum };
}
