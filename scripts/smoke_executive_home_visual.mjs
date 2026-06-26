#!/usr/bin/env node
/**
 * Executive home visual smoke — struktur + valfri Playwright-screenshot @ 412×915.
 * Usage: npm run smoke:executive-home-visual
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

async function tryPlaywrightScreenshot() {
  const port = process.env.VITE_PORT || process.env.PORT || '5174';
  const base = `http://127.0.0.1:${port}`;
  let chromium;
  try {
    ({ chromium } = await import('@playwright/test'));
  } catch {
    console.log('[smoke:executive-home-visual] Playwright saknas — hoppar screenshot.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });
  await page.addInitScript(() => {
    localStorage.setItem('livskompassen_theme_override', 'ME-midnight-executive');
    localStorage.setItem('livskompassen_theme_auto_module', 'false');
    localStorage.setItem('livskompassen_home_layout', 'extended');
  });

  try {
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 12_000 });
    await page.waitForSelector('.app-shell--mockup-skin .executive-home-dashboard', {
      timeout: 12_000,
    });
    const shell = page.locator('.app-shell--mockup-skin');
    await shell.screenshot({
      path: resolve(root, 'docs/design/galleri/executive-home-capture-latest.png'),
    });
    console.log('[smoke:executive-home-visual] Screenshot: docs/design/galleri/executive-home-capture-latest.png');
  } catch (err) {
    console.log(
      `[smoke:executive-home-visual] Screenshot skip — dev server ej tillgänglig på ${base} (${err.message})`,
    );
  } finally {
    await browser.close();
  }
}

async function main() {
  assert(
    existsSync(resolve(root, 'docs/design/galleri/executive-home-extended-v1.png')),
    'facit-PNG saknas: docs/design/galleri/executive-home-extended-v1.png',
  );

  mustInclude(
    'src/modules/core/theme/themePackMidnightExecutive.ts',
    "preview: '/docs/design/galleri/executive-home-extended-v1.png'",
  );

  mustInclude(
    'src/modules/core/home/executive/ExecutiveHomeDashboard.tsx',
    'ExecutiveReflektionHero',
    'ExecutivePlaneringCard',
    'ExecutiveJournalHistoryRail',
  );

  mustInclude(
    'src/modules/core/home/executive/ExecutiveMixEHomeDashboard.tsx',
    'HomeExecutiveSnabbstart',
    'DagensRiktningCard',
  );

  mustInclude(
    'src/modules/core/design/DesignPackCenterHeader.tsx',
    'design-pack-header--executive-premium',
    'design-pack-header__actions',
  );

  mustInclude(
    'src/modules/core/layout/MainLayout.tsx',
    'ExecutiveDecorCompass',
    'executive-header',
  );

  mustInclude(
    'src/styles/executive-chrome.css',
    'min-width: 360px',
    'exec-reflektion-hero__watermark',
    'exec-dock-bar--mix-e',
  );

  await tryPlaywrightScreenshot();
  console.log('[smoke:executive-home-visual] PASS');
}

main().catch((err) => {
  console.error('[smoke:executive-home-visual] FAIL —', err.message || err);
  process.exit(1);
});
