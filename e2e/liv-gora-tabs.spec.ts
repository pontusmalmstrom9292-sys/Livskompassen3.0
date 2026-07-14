import { test, expect } from '@playwright/test';

/**
 * P0 v35 — Liv och göra inline-flikar (Kompasser, Ekonomi, MåBra) ska svara på tryck.
 */
test.describe('Liv och göra — inline tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vardagen');
    await page.waitForLoadState('networkidle');
  });

  test('kompasser är default utan ?tab', async ({ page }) => {
    const loginWall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
    if (await loginWall.count()) {
      test.skip(true, 'Kräver inloggning — kör med auth setup');
    }

    await expect(page.locator('.liv-launcher-grid')).toBeVisible({ timeout: 20_000 });
    const kompasser = page.getByRole('option', { name: /Kompasser/i });
    await expect(kompasser.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('ekonomi-flik byter tab och URL', async ({ page }) => {
    const loginWall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
    if (await loginWall.count()) {
      test.skip(true, 'Kräver inloggning');
    }

    await page.getByRole('option', { name: /Ekonomi/i }).first().click();
    await page.waitForURL(/tab=ekonomi/, { timeout: 10_000 });
    await expect(page.getByRole('option', { name: /Ekonomi/i }).first()).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('måbra-flik byter tab och URL', async ({ page }) => {
    const loginWall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
    if (await loginWall.count()) {
      test.skip(true, 'Kräver inloggning');
    }

    await page.getByRole('option', { name: /MåBra|Må bra/i }).first().click();
    await page.waitForURL(/tab=mabra/, { timeout: 10_000 });
    await expect(page.getByRole('option', { name: /MåBra|Må bra/i }).first()).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('kompasser-flik rensar ?tab från URL', async ({ page }) => {
    const loginWall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
    if (await loginWall.count()) {
      test.skip(true, 'Kräver inloggning');
    }

    await page.goto('/vardagen?tab=ekonomi');
    await page.waitForLoadState('networkidle');
    await page.getByRole('option', { name: /Kompasser/i }).first().click();
    await page.waitForURL((url) => !url.searchParams.has('tab'), { timeout: 10_000 });
  });
});
