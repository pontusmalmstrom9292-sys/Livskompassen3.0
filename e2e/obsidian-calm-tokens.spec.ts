import { test, expect } from '@playwright/test';

function isDarkHex(hex: string): boolean {
  const match = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return false;
  const value = Number.parseInt(match[1], 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r + g + b) / 3 < 90;
}

/** Kanon guld-accenter — DEFAULT_THEME_ID = ME-basta-design (#d4af37). */
const CANONICAL_GOLD_ACCENTS = new Set([
  'd4af37', // ME-basta-design (prod default)
  'c9a66b', // ME-midnight-executive (legacy)
  'c9a227', // I-stone-draft-twilight
  'e8c547', // I-alchemical
  '9f852b', // E-skymning-darkest
]);

function isCanonicalGoldAccent(hex: string): boolean {
  const normalized = hex.trim().toLowerCase().replace(/^#/, '');
  return CANONICAL_GOLD_ACCENTS.has(normalized);
}

/** Obsidian Calm 2.0 + Executive Midnight — CSS-variabler och mörk bas i runtime. */
test.describe('Obsidian Calm tokens', () => {
  test('index.css-variabler är mörka och guld-accent finns', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.home-page--basta-design', { timeout: 30_000 });

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        surface: root.getPropertyValue('--surface').trim(),
        accent: root.getPropertyValue('--accent').trim(),
      };
    });

    expect(isDarkHex(tokens.surface)).toBe(true);
    expect(isCanonicalGoldAccent(tokens.accent)).toBe(true);
  });

  test('manifest theme_color är mörk Obsidian-bas', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response?.ok()).toBeTruthy();
    const manifest = await response!.json();
    expect(isDarkHex(manifest.theme_color)).toBe(true);
    expect(isDarkHex(manifest.background_color)).toBe(true);
  });
});
