import { test, expect } from '@playwright/test';

type ScrollProbe = {
  scrollable: boolean;
  type: 'document' | 'island' | 'none';
};

async function probeScroll(page: import('@playwright/test').Page): Promise<ScrollProbe> {
  return page.evaluate(() => {
    const islands = Array.from(document.querySelectorAll('.calm-scroll-island')) as HTMLElement[];
    for (const el of islands) {
      if (el.scrollHeight > el.clientHeight + 8) {
        return { scrollable: true, type: 'island' as const };
      }
    }
    const docScroll =
      document.documentElement.scrollHeight > document.documentElement.clientHeight + 8;
    if (docScroll) return { scrollable: true, type: 'document' as const };
    return { scrollable: false, type: 'none' as const };
  });
}

async function assertScrollWorks(page: import('@playwright/test').Page) {
  const probe = await probeScroll(page);

  if (!probe.scrollable) {
    const nestedLockWithoutIsland = await page.evaluate(() => {
      const locks = document.querySelectorAll('.hub-view-lock');
      for (const lock of locks) {
        if (!lock.querySelector('.calm-scroll-island')) return true;
      }
      return false;
    });
    expect(nestedLockWithoutIsland).toBe(false);
    return;
  }

  if (probe.type === 'island') {
    const moved = await page.evaluate(() => {
      const el = document.querySelector('.calm-scroll-island') as HTMLElement | null;
      if (!el) return false;
      const start = el.scrollTop;
      el.scrollTop = Math.min(el.scrollHeight, start + 240);
      return el.scrollTop > start;
    });
    expect(moved).toBeTruthy();
    return;
  }

  const moved = await page.evaluate(() => {
    const start = window.scrollY;
    window.scrollTo(0, start + 240);
    return window.scrollY > start;
  });
  expect(moved).toBeTruthy();
}

const ZONE_ROUTES = [
  { path: '/', label: 'Hem' },
  { path: '/hjartat?tab=reflektion', label: 'Hjärtat reflektion' },
  { path: '/hjartat?tab=speglar', label: 'Hjärtat speglar' },
  { path: '/vardagen?tab=kompasser', label: 'Vardagen kompasser' },
  { path: '/vardagen?tab=ekonomi', label: 'Vardagen ekonomi' },
  { path: '/familjen?tab=reflektion', label: 'Familjen barnfokus' },
  { path: '/familjen?tab=hamn', label: 'Familjen hamn' },
  { path: '/valvet', label: 'Valvet' },
  { path: '/installningar', label: 'Inställningar' },
  { path: '/planering', label: 'Planering' },
];

test.describe('Mobil scroll — zoner (g85-mobile)', () => {
  for (const route of ZONE_ROUTES) {
    test(`${route.label} laddar utan body-scroll-lås`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
      expect(bodyOverflow).not.toBe('hidden');

      await assertScrollWorks(page);
    });
  }

  test('Resurser-overlay släpper body-scroll efter stäng', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Fäll ut resurser' }).click();
    await page.getByRole('button', { name: 'Alla resurser' }).click();
    await expect(page.getByRole('dialog', { name: 'Resurser' })).toBeVisible();

    await page.getByRole('button', { name: 'Stäng resurser' }).click();
    await expect(page.getByRole('dialog', { name: 'Resurser' })).toHaveCount(0);

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).not.toBe('hidden');
  });
});
