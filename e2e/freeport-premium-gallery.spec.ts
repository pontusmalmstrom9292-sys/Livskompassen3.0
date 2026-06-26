import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../docs/design/galleri/freeport-premium');

const SCREENS = [
  'hem',
  'dagbok',
  'ekonomi',
  'valvet',
  'barnfokus',
  'livslogg',
  'kanban',
  'inkorg',
  'checkin',
  'monster',
  'kunskapsbank',
  'aktorskarta',
  'dossier',
  'profil',
  'installningar',
] as const;

const SCREEN_LABELS: Record<(typeof SCREENS)[number], string> = {
  hem: 'Hem',
  dagbok: 'Dagbok',
  ekonomi: 'Ekonomi',
  valvet: 'Valvet',
  barnfokus: 'Barnfokus',
  livslogg: 'Livslogg',
  kanban: 'Kanban',
  inkorg: 'Inkorg',
  checkin: 'Check-in',
  monster: 'Mönster',
  kunskapsbank: 'Kunskapsbank',
  aktorskarta: 'Aktörskarta',
  dossier: 'Dossier',
  profil: 'Profil',
  installningar: 'Inställningar',
};

test.describe('Design Freeport — Executive Premium gallery', () => {
  test.beforeAll(() => {
    mkdirSync(OUT_DIR, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('lk.freeport.theme', 'executive-premium');
    });
    await page.goto('/dev/design-freeport');
    await page.locator('.design-freeport__tab', { hasText: 'Executive Premium' }).click();
  });

  for (const screen of SCREENS) {
    test(`capture ${screen}`, async ({ page }) => {
      await page.getByRole('tab', { name: SCREEN_LABELS[screen], exact: true }).click();
      const phone = page.locator('.design-freeport__phone--executive').first();
      await expect(phone).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(400);
      await phone.screenshot({
        path: resolve(OUT_DIR, `${screen}.png`),
      });
    });
  }
});
