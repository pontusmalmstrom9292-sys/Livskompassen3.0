import { test, expect } from '@playwright/test';

const LEGACY_REDIRECTS: Array<{ from: string; urlMatch: RegExp }> = [
  { from: '/dagbok?tab=reflektion', urlMatch: /\/hjartat/ },
  { from: '/dagbok?tab=bevis', urlMatch: /\/valvet/ },
  { from: '/ekonomi', urlMatch: /\/vardagen.*tab=ekonomi/ },
  { from: '/valv', urlMatch: /\/valvet/ },
  { from: '/kunskap', urlMatch: /\/valvet/ },
  { from: '/hamn', urlMatch: /\/familjen.*tab=hamn/ },
  { from: '/mabra', urlMatch: /\/vardagen.*tab=mabra/ },
  { from: '/liv', urlMatch: /\/vardagen/ },
  { from: '/familj', urlMatch: /\/familjen.*tab=reflektion/ },
  { from: '/barnen', urlMatch: /\/familjen.*tab=reflektion/ },
];

test.describe('Legacy redirects', () => {
  for (const item of LEGACY_REDIRECTS) {
    test(`${item.from} → kanon-route`, async ({ page }) => {
      await page.goto(item.from);
      await page.waitForURL(item.urlMatch, { timeout: 20_000 });
      expect(page.url()).toMatch(item.urlMatch);
    });
  }

  test('Okänd route → hem', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-xyz');
    await page.waitForURL(/\//, { timeout: 20_000 });
    expect(page.url()).not.toContain('this-route-does-not-exist-xyz');
  });
});
