import { test, expect } from '@playwright/test';

const VARDAGEN_ROUTES = [
  { path: '/vardagen', label: 'default kompasser' },
  { path: '/vardagen?tab=ekonomi', label: 'ekonomi' },
  { path: '/vardagen?tab=mabra', label: 'mabra' },
];

async function expectPublicLoginWall(page: import('@playwright/test').Page) {
  const wall = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
  await expect(wall.first()).toBeVisible({ timeout: 25_000 });
}

/** Publikt läge: auth-vägg OK; inloggad: launcher ska synas — aldrig error boundary. */
async function assertVardagenEntryHealthy(page: import('@playwright/test').Page) {
  await expect(page.getByText('Liv och göra kunde inte laddas')).toHaveCount(0);
  await expect(page.getByText('Modulfel')).toHaveCount(0);

  const loginHeading = page.getByRole('heading', { name: /Inloggning krävs|Logga in|Säkra ditt konto/ });
  if (await loginHeading.count()) {
    await expect(loginHeading.first()).toBeVisible({ timeout: 25_000 });
    return;
  }

  await expect(page.locator('.liv-launcher-grid').first()).toBeVisible({ timeout: 20_000 });
}

test.describe('Vardagen entry — Liv och göra', () => {
  for (const route of VARDAGEN_ROUTES) {
    test(`${route.label} laddar utan error boundary`, async ({ page }) => {
      page.on('console', (msg) => {
        if (msg.type() === 'error' && msg.text().includes('ChunkLoadError')) {
          throw new Error(msg.text());
        }
      });

      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      await assertVardagenEntryHealthy(page);

      const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
      expect(bodyOverflow).not.toBe('hidden');
    });
  }

  test('legacy /liv?tab=mabra → /vardagen?tab=mabra', async ({ page }) => {
    await page.goto('/liv?tab=mabra');
    await page.waitForURL(/\/vardagen.*tab=mabra/, { timeout: 20_000 });
    expect(page.url()).toMatch(/tab=mabra/);
  });

  test('/vardagen kräver inloggning i publikt läge', async ({ page }) => {
    await page.goto('/vardagen');
    await page.waitForLoadState('networkidle');
    await expectPublicLoginWall(page);
    await expect(page.getByText('Liv och göra kunde inte laddas')).toHaveCount(0);
  });
});

test.describe('Vardagen launcher cards', () => {
  test('arbetsliv-kort navigerar till stämpel-input när inloggad', async ({ page }) => {
    await page.goto('/vardagen');
    await page.waitForLoadState('networkidle');

    const launcher = page.locator('.liv-launcher-grid');
    if ((await launcher.count()) === 0) {
      test.skip(true, 'Kräver Firebase-inloggning — publikt läge visar auth-vägg');
    }

    const arbetsliv = page.getByRole('option', { name: /Arbetsliv/i });
    await arbetsliv.first().click();
    await page.waitForURL(/\/arbetsliv\/input/, { timeout: 20_000 });
    expect(page.url()).toMatch(/inputMode=stampla/);
  });
});
