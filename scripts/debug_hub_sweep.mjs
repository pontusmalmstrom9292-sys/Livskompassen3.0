/**
 * Runtime hub sweep — visits core routes, collects console errors + crash markers.
 * Usage: node scripts/debug_hub_sweep.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:5173';
const LOG = resolve('.cursor/debug-4bae45.log');
const OUT = resolve('.cursor/debug-hub-sweep-4bae45.json');

const ROUTES = [
  '/',
  '/familjen',
  '/familjen?tab=reflektion',
  '/familjen?tab=hamn',
  '/hjartat',
  '/hjartat?tab=speglar',
  '/vardagen',
  '/vardagen?tab=mabra',
  '/vardagen?tab=ekonomi',
  '/planering',
  '/planering?tab=handling',
  '/arbetsliv/input',
  '/inkast',
  '/projekt',
  '/installningar',
  '/mabra',
  '/valvet',
  '/sos',
];

function dbg(hypothesisId, location, message, data) {
  const line = JSON.stringify({
    sessionId: '4bae45',
    runId: 'hub-sweep',
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  appendFileSync(LOG, `${line}\n`);
}

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; moto g85) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
});
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    consoleErrors.push({ text: msg.text().slice(0, 300), url: page.url(), t: Date.now() });
  }
});
page.on('pageerror', (err) => {
  consoleErrors.push({ text: `PAGEERROR: ${err.message}`.slice(0, 300), url: page.url(), t: Date.now() });
});

for (const path of ROUTES) {
  const url = `${BASE}${path}`;
  const started = Date.now();
  let status = 'ok';
  let bodySnippet = '';
  let hasAuthBoundary = false;
  let hasLoadingStuck = false;
  let title = '';
  const beforeErr = consoleErrors.length;

  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 });
    await page.waitForTimeout(1800);
    title = await page.title();
    bodySnippet = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 180);
    hasAuthBoundary = /Något gick fel vid inloggning/i.test(bodySnippet);
    hasLoadingStuck = /Laddar Livskompassen/i.test(bodySnippet) && bodySnippet.length < 80;
    if (!res || !res.ok()) status = `http-${res?.status() ?? 'none'}`;
    if (hasAuthBoundary) status = 'auth-boundary';
    if (hasLoadingStuck) status = 'loading-stuck';
  } catch (e) {
    status = `nav-error: ${e instanceof Error ? e.message.slice(0, 120) : String(e)}`;
  }

  const newErrors = consoleErrors.slice(beforeErr);
  const row = {
    path,
    status,
    title,
    ms: Date.now() - started,
    authBoundary: hasAuthBoundary,
    loadingStuck: hasLoadingStuck,
    consoleErrorCount: newErrors.length,
    consoleErrors: newErrors.map((e) => e.text).slice(0, 5),
    bodySnippet,
  };
  results.push(row);
  dbg('H', `hub-sweep:${path}`, 'route visit', {
    status: row.status,
    ms: row.ms,
    authBoundary: row.authBoundary,
    loadingStuck: row.loadingStuck,
    consoleErrorCount: row.consoleErrorCount,
    consoleErrors: row.consoleErrors,
  });
  console.log(
    `[sweep] ${path.padEnd(36)} ${status.padEnd(16)} err=${newErrors.length} ${row.ms}ms`,
  );
}

await browser.close();

const summary = {
  base: BASE,
  at: new Date().toISOString(),
  routes: results.length,
  failures: results.filter((r) => r.status !== 'ok'),
  routesWithConsoleErrors: results.filter((r) => r.consoleErrorCount > 0),
  results,
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
dbg('H', 'hub-sweep:summary', 'sweep complete', {
  routes: summary.routes,
  failureCount: summary.failures.length,
  consoleErrorRoutes: summary.routesWithConsoleErrors.map((r) => r.path),
});

console.log('\n=== SUMMARY ===');
console.log(`routes=${summary.routes} failures=${summary.failures.length}`);
for (const f of summary.failures) {
  console.log(` FAIL ${f.path} → ${f.status}`);
}
for (const r of summary.routesWithConsoleErrors) {
  console.log(` WARN ${r.path} console×${r.consoleErrorCount}: ${r.consoleErrors[0] || ''}`);
}
console.log(`Wrote ${OUT}`);
process.exit(summary.failures.length ? 1 : 0);
