import { describe, expect, it } from 'vitest';
import { validateTaxTableFileSync } from '@economy/validateTaxTableFile.node';
import { parseTaxTableFilename } from '@economy/validateTaxTableFile';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('validateTaxTableFile', () => {
  it('parsar filnamn taxTable32-2026.json', () => {
    expect(parseTaxTableFilename('taxTable32-2026.json')).toEqual({ table: 32, year: 2026 });
  });

  it('validerar fixture', () => {
    const json = readFileSync(resolve(__dirname, '__fixtures__/taxTable32-2026.json'), 'utf8');
    const parsed = validateTaxTableFileSync(json, 'taxTable32-2026.json');
    expect(parsed.table).toBe(32);
    expect(parsed.year).toBe(2026);
    expect(parsed.brackets.length).toBeGreaterThan(10);
    expect(parsed.checksum).toHaveLength(64);
  });

  it('fel filnamn → fel', () => {
    expect(() => parseTaxTableFilename('skatt.json')).toThrow(/Filnamnet måste/);
  });
});
