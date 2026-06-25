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

/** Obsidian Calm 2.0 — CSS-variabler och mörk bas i runtime. */
test.describe('Obsidian Calm tokens', () => {
  test('index.css-variabler är mörka och guld-accent finns', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.home-hero-kanon', { timeout: 30_000 });

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        surface: root.getPropertyValue('--surface').trim(),
        accent: root.getPropertyValue('--accent').trim(),
      };
    });

    expect(isDarkHex(tokens.surface)).toBe(true);
    // Theme Pack I — accepterar samtliga registrerade guld/brons-accenter
    // (I-stone, I-stone-draft-twilight, I-stone-draft-bronze, I-alchemical, I-skymning).
    // Tidigare regex matchade endast d4af37; default-temat kan vara brons-variant.
    expect(tokens.accent.toLowerCase()).toMatch(
      /d4af37|212|175|55|c9a66b|c9a227|9f852b|e8c547/,
    );
  });

  test('manifest theme_color är mörk Obsidian-bas', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response?.ok()).toBeTruthy();
    const manifest = await response!.json();
    expect(isDarkHex(manifest.theme_color)).toBe(true);
    expect(isDarkHex(manifest.background_color)).toBe(true);
  });
});
