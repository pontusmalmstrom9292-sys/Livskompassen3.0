import { test, expect } from '@playwright/test';

async function expectPublicLoginWall(page: import('@playwright/test').Page) {
  const wall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
  await expect(wall.first()).toBeVisible({ timeout: 25_000 });
}

/**
 * Locked UX — render- och routing-gate i publikt läge (utan Firebase-inloggning).
 * Kompletterar scripts/smoke_locked_ux.mjs (statisk källkod).
 */
test.describe('Locked UX — publikt läge', () => {
  test('Hem laddar Basta Design hero (prod default)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.home-page--basta-design')).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator('.basta-design__hero')).toBeVisible();

    const surface = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(),
    );
    expect(surface.length).toBeGreaterThan(0);
  });

  test('Theme Lab renderar utan auth', async ({ page }) => {
    await page.goto('/dev/theme-lab');
    await expect(page.getByRole('heading', { name: 'Theme Lab' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator('.theme-lab-page')).toBeVisible();
  });

  test('Design Freeport renderar utan auth', async ({ page }) => {
    await page.goto('/dev/design-freeport');
    await expect(page.getByRole('heading', { name: 'Design Freeport' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator('.design-freeport__page')).toBeVisible();
  });

  test('Familjen kräver inloggning — Barnfokus ej exponerat', async ({ page }) => {
    await page.goto('/familjen?tab=reflektion');
    await expectPublicLoginWall(page);
    await expect(page.getByText('Minneslista')).toHaveCount(0);
    await expect(page.getByText('Spara till')).toHaveCount(0);
  });

  test('Valvet kräver inloggning — Mönster-flik ej exponerad', async ({ page }) => {
    await page.goto('/valvet?vaultTab=monster');
    await expectPublicLoginWall(page);
    await expect(page.getByRole('tab', { name: 'Mönster' })).toHaveCount(0);
  });

  test('Hjärtat ?tab=bevis omdirigerar till Valvet (ej publik bevis-flik)', async ({ page }) => {
    await page.goto('/hjartat?tab=bevis');
    await page.waitForURL(/\/valvet/, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/valvet/);
  });

  test('Valv-drawer block finns inte utan upplåst session', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav-drawer__valv-block')).toHaveCount(0);
  });

  test('Menyknapp finns i header (touch target)', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.getByRole('button', { name: /Meny|Öppna meny/ });
    await expect(menuBtn).toBeVisible();
    const box = await menuBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(40);
    }
  });
});
