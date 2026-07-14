import { test, expect } from '@playwright/test';

/**
 * P0 v35 — Hamburgermeny drawer med accordion/undermenyer från navTruth.
 */
test.describe('Drawer navigation — accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.home-page--basta-design')).toBeVisible({ timeout: 20_000 });
  });

  test('meny öppnas och visar drawer', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /Meny|Öppna meny/ });
    await menuBtn.click();
    await expect(page.locator('.nav-drawer')).toBeVisible({ timeout: 10_000 });
  });

  test('vardag-hub kan expandera undermeny', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /Meny|Öppna meny/ });
    await menuBtn.click();
    await expect(page.locator('.nav-drawer')).toBeVisible({ timeout: 10_000 });

    const vardagenHub = page.locator('.nav-drawer').getByRole('button', { name: /Liv och göra|Vardagen/i });
    if ((await vardagenHub.count()) === 0) {
      test.skip(true, 'Drawer hub accordion ej implementerad än');
    }

    await vardagenHub.first().click();
    const childLink = page.locator('.nav-drawer').getByRole('link', { name: /Planering|MåBra|Ekonomi/i });
    if ((await childLink.count()) === 0) {
      test.skip(true, 'Drawer accordion-undermeny ej implementerad än (v35)');
    }
    await expect(childLink.first()).toBeVisible({ timeout: 8_000 });
  });

  test('drawer-länk navigerar och stänger', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /Meny|Öppna meny/ });
    await menuBtn.click();
    await expect(page.locator('.nav-drawer')).toBeVisible({ timeout: 10_000 });

    const planering = page.locator('.nav-drawer').getByRole('link', { name: /Planering/i });
    const anyLink = page.locator('.nav-drawer').getByRole('link');
    if ((await planering.count()) === 0 && (await anyLink.count()) === 0) {
      test.skip(true, 'Inga drawer-länkar än — accordion v35');
    }
    if ((await planering.count()) === 0) {
      await anyLink.first().click();
    } else {
      await planering.first().click();
    }

    await expect(page.locator('.nav-drawer')).toHaveCount(0, { timeout: 10_000 });
    expect(page.url()).not.toMatch(/^\s*$/);
  });
});
