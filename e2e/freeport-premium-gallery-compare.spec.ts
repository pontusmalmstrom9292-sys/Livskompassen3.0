import { expect, test } from '@playwright/test';

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

test.describe('Design Freeport — Executive Premium visual compare', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('lk.freeport.theme', 'executive-premium');
    });
    await page.goto('/dev/design-freeport');
    await page.locator('.design-freeport__tab', { hasText: 'Executive Premium' }).click();
  });

  for (const screen of SCREENS) {
    test(`compare ${screen}`, async ({ page }) => {
      await page.getByRole('tab', { name: SCREEN_LABELS[screen], exact: true }).click();
      const phone = page.locator('.design-freeport__phone--executive').first();
      await expect(phone).toBeVisible({ timeout: 15_000 });
      await expect(phone).toHaveScreenshot(`${screen}.png`, {
        animations: 'disabled',
        caret: 'hide',
      });
    });
  }
});
