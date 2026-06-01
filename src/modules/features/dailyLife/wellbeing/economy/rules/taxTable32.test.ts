import { describe, expect, it } from 'vitest';
import { getTaxAmount } from './taxTable32';
import { BASE_SALARY_SEK } from './livsmedel2026';

describe('taxTable32', () => {
  it('Tabell 32 kolumn 1 — 36 470 kr → 7 312 kr skatt', () => {
    expect(getTaxAmount(BASE_SALARY_SEK)).toBe(7312);
  });

  it('0 kr brutto → 0 skatt', () => {
    expect(getTaxAmount(0)).toBe(0);
  });
});
