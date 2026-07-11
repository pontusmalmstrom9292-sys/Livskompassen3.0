import { test, expect } from '@playwright/test';

test.describe('Dock navigation — publikt läge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.home-page--basta-design')).toBeVisible({ timeout: 20_000 });
  });

  test('Anteckning → widget route', async ({ page }) => {
    await page.getByRole('button', { name: 'Anteckning' }).click();
    await page.waitForURL(/\/widget\/anteckning/, { timeout: 15_000 });
  });

  test('Familj → familjen route', async ({ page }) => {
    await page.getByRole('button', { name: 'Familj' }).click();
    await page.waitForURL(/\/familjen/, { timeout: 15_000 });
  });

  test('Mentil → hjartat route', async ({ page }) => {
    await page.getByRole('button', { name: 'Mentil' }).click();
    await page.waitForURL(/\/hjartat/, { timeout: 15_000 });
  });

  test('Inkast → planering input', async ({ page }) => {
    await page.getByRole('button', { name: 'Inkast' }).click();
    await page.waitForURL(/\/planering\/input/, { timeout: 15_000 });
  });

  test('Kompass kort-klick → hem från annan zon', async ({ page }) => {
    await page.getByRole('button', { name: 'Mentil' }).click();
    await page.waitForURL(/\/hjartat/, { timeout: 15_000 });
    await page.getByRole('button', { name: /Hamn\. Håll tre sekunder för Valv\./ }).click({ delay: 50 });
    await expect(page).toHaveURL(/\/$|\/\?/, { timeout: 20_000 });
  });

  test('Meny öppnas med touch target ≥40px', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /Meny|Öppna meny/ });
    await expect(menuBtn).toBeVisible();
    const box = await menuBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(40);
    }
    await menuBtn.click();
    await expect(page.locator('.nav-drawer')).toBeVisible({ timeout: 10_000 });
  });
});
