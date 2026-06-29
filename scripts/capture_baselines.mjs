#!/usr/bin/env node
/**
 * Phase 0 baseline screenshots — 6 core routes @ mobile + desktop.
 * Requires a running Vite dev server. Example: `npm run dev -- --port 5174`
 * Output: docs/design/baselines/{route}-{viewport}-{date}.png
 *
 * Usage: node scripts/capture_baselines.mjs [--port 5174|--port=5174]
 */

import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function resolvePort(argv, env) {
  const isValidPort = (value) => {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535;
  };
  const cliPort = argv.reduce((value, arg, index) => {
    if (value) return value;
    if (/^\d{4,5}$/.test(arg)) return arg;
    if (arg === '--port') return argv[index + 1];
    if (arg.startsWith('--port=')) return arg.slice('--port='.length);
    return value;
  }, null);
  const candidate = cliPort ?? env.VITE_PORT ?? env.PORT ?? '5174';
  return isValidPort(candidate) ? String(candidate) : '5174';
}

const port = resolvePort(process.argv.slice(2), process.env);
const base = `http://127.0.0.1:${port}`;
const outDir = resolve(root, 'docs/design/baselines');

const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/vardagen', slug: 'vardagen' },
  { path: '/planering', slug: 'planering' },
  { path: '/valvet', slug: 'valvet' },
  { path: '/familjen', slug: 'familjen' },
  { path: '/hjartat', slug: 'hjartat' },
];

const VIEWPORTS = [
  { width: 390, height: 844, label: '390x844' },
  { width: 1280, height: 800, label: '1280x800' },
];

const date = new Date().toISOString().slice(0, 10);

async function run() {
  let chromium;
  try {
    ({ chromium } = await import('@playwright/test'));
  } catch {
    console.error('[baselines] Playwright not installed — run: npm install, then npx playwright install chromium');
    process.exit(1);
  }

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  let captured = 0;

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => {
      localStorage.removeItem('livskompassen_theme_override');
      localStorage.setItem('livskompassen_home_layout', 'extended');
    });

    for (const route of ROUTES) {
      const url = `${base}${route.path}`;
      const file = resolve(outDir, `${route.slug}-${vp.label}-${date}.png`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15_000 });
        await page.waitForTimeout(600);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`[baselines] ✓ ${route.path} @ ${vp.label}`);
        captured++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[baselines] ✗ ${route.path} @ ${vp.label}: ${message}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n[baselines] Done — ${captured}/${ROUTES.length * VIEWPORTS.length} screenshots saved to docs/design/baselines/`);
}

run().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('[baselines] Fatal:', message);
  process.exit(1);
});
