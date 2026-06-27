#!/usr/bin/env node
/**
 * Push Prod Hem + Sandbox Hem to Figma (html-to-design).
 * Requires dev server on PORT (default 5175).
 *
 * Usage:
 *   node scripts/figma_capture_hem_compare.mjs <prodCaptureId> <sandboxCaptureId>
 */
import { chromium } from '@playwright/test';

const PORT = process.env.VITE_PORT || process.env.PORT || '5175';
const BASE = `http://127.0.0.1:${PORT}`;

const prodId = process.argv[2] || process.env.FIGMA_CAPTURE_PROD;
const sandboxId = process.argv[3] || process.env.FIGMA_CAPTURE_SANDBOX;

if (!prodId || !sandboxId) {
  console.error(
    'Usage: node scripts/figma_capture_hem_compare.mjs <prodCaptureId> <sandboxCaptureId>',
  );
  process.exit(1);
}

async function injectAndCapture(page, captureId, selector = '.app-shell') {
  const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit`;
  const scriptRes = await page.context().request.get(
    'https://mcp.figma.com/mcp/html-to-design/capture.js',
  );
  const scriptText = await scriptRes.text();
  await page.evaluate((s) => {
    const el = document.createElement('script');
    el.textContent = s;
    document.head.appendChild(el);
  }, scriptText);
  await page.waitForTimeout(800);
  return page.evaluate(
    ({ id, ep, sel }) =>
      window.figma?.captureForDesign?.({
        captureId: id,
        endpoint: ep,
        selector: sel,
      }),
    { id: captureId, ep: endpoint, sel: selector },
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  console.log('[figma:capture-hem] ▶ Prod Hem (Bästa design)');
  await page.addInitScript(() => {
    localStorage.removeItem('livskompassen_theme_override');
  });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const prodReady = await page
    .waitForSelector('.home-page--basta-design, .basta-design__hero', {
      timeout: 20_000,
    })
    .then(() => true)
    .catch(() => false);
  if (prodReady) {
    await page.waitForTimeout(2000);
    const prodResult = await injectAndCapture(page, prodId, '.app-shell');
    console.log('[figma:capture-hem]   prod result:', prodResult);
  } else {
    console.warn('[figma:capture-hem]   prod skip — executive hem ej synlig (auth/tema?)');
  }

  console.log('[figma:capture-hem] ▶ Sandbox Hem (FreeportPremiumScreensLab)');
  await page.addInitScript(() => {
    localStorage.setItem('lk.freeport.theme', 'executive-premium');
  });
  await page.goto(`${BASE}/dev/design-freeport`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('.design-freeport__tab', { hasText: 'Executive Premium' }).click();
  await page.getByRole('tab', { name: 'Hem', exact: true }).click();
  await page.waitForSelector('.design-freeport__phone--executive', { timeout: 30_000 });
  await page.waitForTimeout(1500);
  const sandboxResult = await injectAndCapture(
    page,
    sandboxId,
    '.design-freeport__phone--executive',
  );
  console.log('[figma:capture-hem]   sandbox result:', sandboxResult);

  await browser.close();
  console.log(
    `[figma:capture-hem] Submitted. Figma: https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm`,
  );
  console.log(`[figma:capture-hem] Poll: capture IDs ${prodId}, ${sandboxId}`);
}

main().catch((err) => {
  console.error('[figma:capture-hem] FAIL', err);
  process.exit(1);
});
