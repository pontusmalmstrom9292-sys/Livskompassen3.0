/**
 * Runtime: button parity + Swedish visible-text audit across PUBLIC_ROUTES.
 * Usage: node scripts/debug_ui_consistency.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ensureQaDir, writeJson, QA_DIR } from './lib/qa_harden_io.mjs';
import { PUBLIC_ROUTES } from './lib/qa_public_routes.mjs';
import {
  BANNED_UI_TERMS,
  TYPO_FIXES,
  PRODUCT_LABEL_SLIPS,
  ENGLISH_UI_LEAKS,
  WEIRD_UI,
  allowEnglishContext,
} from './lib/qa_swedish_dict.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:5173';
ensureQaDir();

const GOLD_RGB = { r: 253, g: 230, b: 138 }; // #FDE68A
const TOUCH = 44;

function colorDist(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function parseRgb(s) {
  const m = String(s || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}

async function waitReady(page) {
  for (let i = 0; i < 16; i++) {
    const t = ((await page.locator('body').innerText().catch(() => '')) || '').trim();
    if (!/^Laddar Livskompassen/i.test(t) || t.length > 80) return;
    await page.waitForTimeout(350);
  }
}

const issues = [];
const samples = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

// Core product routes — skip /dev for parity (labs may differ by design)
const routes = PUBLIC_ROUTES.filter((r) => !r.path.startsWith('/dev/'));

for (const route of routes) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => null);
  await waitReady(page);

  const bodyText = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 8000);

  for (const banned of BANNED_UI_TERMS) {
    if (bodyText.includes(banned)) {
      issues.push({
        code: 'BANNED_COPY',
        path: route.path,
        detail: banned,
        swedish: `Förbjuden term synlig på ${route.path}: «${banned}».`,
      });
    }
  }
  for (const { bad, good } of [...TYPO_FIXES, ...PRODUCT_LABEL_SLIPS]) {
    if (bodyText.includes(bad)) {
      issues.push({
        code: 'SWEDISH_TYPO',
        path: route.path,
        detail: `${bad} → ${good}`,
        swedish: `Stavfel synligt på ${route.path}: «${bad}» → «${good}».`,
      });
    }
  }
  for (const { re, code } of WEIRD_UI) {
    if (code === 'MULTI_SPACE') continue;
    if (re.test(bodyText)) {
      issues.push({
        code: 'WEIRD_UI',
        path: route.path,
        detail: code,
        swedish: `Konstig text (${code}) på ${route.path}.`,
      });
    }
  }

  // Visible short labels — English leak
  const labels = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button, a, [role="button"], [role="tab"]')) {
      const t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t && t.length <= 32) out.push(t);
    }
    return [...new Set(out)].slice(0, 80);
  });
  for (const label of labels) {
    if (allowEnglishContext(label)) continue;
    for (const { re, hint } of ENGLISH_UI_LEAKS) {
      if (re.test(label)) {
        issues.push({
          code: 'ENGLISH_UI',
          path: route.path,
          detail: `«${label}» → ${hint}`,
          swedish: `Engelsk knapp/etikett på ${route.path}: «${label}» (bör vara «${hint}»).`,
        });
        break;
      }
    }
  }

  // Button parity sample (content area, not dock band)
  const btnStats = await page.evaluate((touchFloor) => {
    const rows = [];
    const nodes = [
      ...document.querySelectorAll(
        '.btn-pill, .ui-cta-gold, button.hub-chip, .calm-chip, [data-cta="primary"]',
      ),
    ];
    for (const el of nodes.slice(0, 24)) {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      if (r.top > innerHeight - 78) continue; // dock band
      const cs = getComputedStyle(el);
      rows.push({
        label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        w: Math.round(r.width),
        h: Math.round(r.height),
        radius: cs.borderRadius,
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.borderColor,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 48),
        touchOk: r.height >= touchFloor - 1,
      });
    }
    return rows;
  }, TOUCH);

  for (const b of btnStats) {
    samples.push({ path: route.path, ...b });
    if (!b.touchOk) {
      issues.push({
        code: 'BUTTON_TOUCH',
        path: route.path,
        detail: `${b.label || '?'} ${b.w}×${b.h}`,
        swedish: `Knapp för liten på ${route.path}: ${b.label || 'okänd'} (${b.h}px).`,
      });
    }
    // Accent gold proximity for ui-cta-gold / accent pills
    const bg = parseRgb(b.bg);
    const fg = parseRgb(b.color);
    const looksAccent =
      /guld|gold|accent|spara|fortsätt|skriv|öppna/i.test(b.label || '') ||
      (fg && colorDist(fg, GOLD_RGB) < 55);
    if (looksAccent && fg && colorDist(fg, GOLD_RGB) > 90 && bg && colorDist(bg, GOLD_RGB) > 120) {
      // soft: only report if neither text nor bg near gold
      issues.push({
        code: 'BUTTON_COLOR_DRIFT',
        path: route.path,
        detail: `${b.label} fg=${b.color} bg=${b.bg}`,
        swedish: `Knappfärg avviker från mockup-guld på ${route.path}: «${b.label}».`,
      });
    }
  }
}

await browser.close();

// Dedupe
const seen = new Set();
const unique = [];
for (const i of issues) {
  const k = `${i.code}|${i.path}|${i.detail}`;
  if (seen.has(k)) continue;
  seen.add(k);
  unique.push(i);
}

const summary = {
  probe: 'ui-consistency',
  at: new Date().toISOString(),
  base: BASE,
  routes: routes.length,
  issueCount: unique.length,
  issues: unique,
  buttonSamples: samples.slice(0, 80),
};

writeJson('ui-consistency.json', summary);
writeFileSync(resolve(QA_DIR, 'ui-consistency.json'), JSON.stringify(summary, null, 2));

console.log(`\n=== UI CONSISTENCY === routes=${routes.length} issues=${unique.length}`);
for (const i of unique.slice(0, 30)) {
  console.log(`  [${i.code}] ${i.path}: ${i.detail}`);
}
process.exit(unique.some((i) => ['BANNED_COPY', 'BUTTON_TOUCH'].includes(i.code)) ? 1 : 0);
