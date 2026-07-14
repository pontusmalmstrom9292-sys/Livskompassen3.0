/**
 * Playwright auth setup — sparar storageState för live E2E.
 * Kräver SEED_FIREBASE_EMAIL + SEED_FIREBASE_PASSWORD i .env
 */
import { test as setup, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const authFile = 'e2e/.auth/user.json';

function loadEnv() {
  const root = resolve(process.cwd());
  const envPath = resolve(root, '.env');
  const env: Record<string, string> = {};
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

setup('authenticate seed user', async ({ page }) => {
  const env = loadEnv();
  const email = env.SEED_FIREBASE_EMAIL ?? process.env.SEED_FIREBASE_EMAIL;
  const password = env.SEED_FIREBASE_PASSWORD ?? process.env.SEED_FIREBASE_PASSWORD;

  if (!email || !password) {
    setup.skip(true, 'SEED_FIREBASE_* saknas — live E2E körs i publikt läge');
    return;
  }

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const loginHeading = page.getByRole('heading', { name: /Logga in|Inloggning krävs|Säkra ditt konto/ });
  if (await loginHeading.count()) {
    const emailInput = page.getByLabel(/E-post|Email/i).or(page.locator('input[type="email"]')).first();
    const passInput = page.getByLabel(/Lösenord|Password/i).or(page.locator('input[type="password"]')).first();
    await emailInput.fill(email);
    await passInput.fill(password);
    await page.getByRole('button', { name: /Logga in|Sign in/i }).first().click();
    await expect(page.getByRole('heading', { name: /Logga in|Inloggning krävs/ })).toHaveCount(0, {
      timeout: 30_000,
    });
  }

  await page.context().storageState({ path: authFile });
});
