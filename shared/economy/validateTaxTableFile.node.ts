/** Node-only sync validate — tests. */
import { sha256HexSync } from './checksum.node';
import { parseTaxTableContent, type ParsedTaxTableFile } from './validateTaxTableFile';

export function validateTaxTableFileSync(content: string, fileName: string): ParsedTaxTableFile {
  const parsed = parseTaxTableContent(content, fileName);
  const checksum = sha256HexSync({ table: parsed.table, year: parsed.year, brackets: parsed.brackets });
  return { ...parsed, checksum };
}
