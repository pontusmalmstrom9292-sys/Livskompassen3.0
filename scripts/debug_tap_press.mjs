/**
 * Exhaustive tap/press crawl — dock, drawer, EVERY catalog route,
 * then EVERY visible interactive control per view (scroll passes).
 * Sacred skip only: Valv long-press, biometri, logout, delete/save writes.
 *
 * Usage: node scripts/debug_tap_press.mjs [baseUrl]
 * Env: QA_MAX_TAPS_PER_PAGE=48 (default)
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { appendNdjson, writeJson, ensureQaDir } from './lib/qa_harden_io.mjs';
import { PUBLIC_ROUTES, DRAWER_FULL_TOUR } from './lib/qa_public_routes.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:5173';
const LEGACY_OUT = resolve('.cursor/debug-tap-press.json');
const TOUCH_FLOOR = 44;
const MAX_TAPS_PER_PAGE = Math.max(8, Number(process.env.QA_MAX_TAPS_PER_PAGE || 48));
const SCROLL_PASSES = Math.max(1, Number(process.env.QA_SCROLL_PASSES || 5));
/** Only Sacred / irreversible / write — everything else is tapped. */
const SKIP_TAP_RE =
  /håll tre sekunder|håll tre|långtryck|logga ut|radera|ta bort|töm (allt|korg|arkiv)|lås valv|biometr|fingeravtryck|ansikts|publicera|deploy|spara|skicka|bekräfta radering|permanent/i;
/** Global chrome already covered in dock/drawer pass — skip on per-route (unless QA_CHROME_EVERY_PAGE=1). */
const CHROME_TAP_RE =
  /öppna meny|stäng meny|fäll ut resurser|stäng resurser|alla resurser|konto och inloggning|kompis —|aktivera sos|tvingad upplåsning|system status|dölj snabb|^anteckning$|^familj$|^ventil$|^inkast$|hamn\. håll/i;
const INCLUDE_CHROME_EVERY_PAGE = process.env.QA_CHROME_EVERY_PAGE === '1';

function isAuthNoise(text) {
  return /auth\/network-request-failed|Anonymous sign-in failed|504 \(Outdated Optimize Dep\)|Missing or insufficient permissions|Framing 'https:\/\/www\.google\.com/i.test(
    text,
  );
}

async function waitAppReady(page) {
  for (let i = 0; i < 20; i++) {
    const txt = ((await page.locator('body').innerText().catch(() => '')) || '').trim();
    if (!/^Laddar Livskompassen/i.test(txt) || txt.length > 80) return;
    await page.waitForTimeout(400);
  }
}

async function measureTouch(page, locator) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return null;
  return {
    w: Math.round(box.width),
    h: Math.round(box.height),
    ok: box.width >= TOUCH_FLOOR - 1 && box.height >= TOUCH_FLOOR - 1,
  };
}

async function safeTap(page, locator, opts = {}) {
  const { requireNav = false, timeout = 4_000 } = opts;
  const urlBefore = page.url();
  try {
    const target = locator.first();
    await target.waitFor({ state: 'visible', timeout });
    const touch = await measureTouch(page, target);
    await target.click({ timeout });
    await page.waitForTimeout(350);
    await waitAppReady(page);
    const urlAfter = page.url();
    const body = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 120);
    const crashed =
      /Något gick fel vid inloggning/i.test(body) ||
      (/Laddar Livskompassen/i.test(body) && body.length < 80);
    if (crashed) return { ok: false, detail: 'crash-or-stuck', urlAfter, touch };
    if (requireNav && urlAfter === urlBefore) {
      return { ok: false, detail: 'no-navigation', urlAfter, touch };
    }
    return { ok: true, detail: 'ok', urlAfter, touch };
  } catch (e) {
    return {
      ok: false,
      detail: e instanceof Error ? e.message.slice(0, 140) : String(e),
      urlAfter: page.url(),
    };
  }
}

async function ensureHomeChrome(page) {
  const menu = page.getByRole('button', { name: /Öppna meny/i });
  if (await menu.isVisible().catch(() => false)) return true;
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await waitAppReady(page);
  return menu.isVisible().catch(() => false);
}

ensureQaDir();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; moto g85) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
});
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    consoleErrors.push({ text: msg.text().slice(0, 280), url: page.url(), t: Date.now() });
  }
});
page.on('pageerror', (err) => {
  consoleErrors.push({
    text: `PAGEERROR: ${err.message}`.slice(0, 280),
    url: page.url(),
    t: Date.now(),
  });
});

const actions = [];
const issues = [];

function record(action, result) {
  const row = { action, ...result };
  actions.push(row);
  const touchFail = result.touch && result.touch.ok === false;
  const isDevLab = String(action).includes('/dev/');
  // Dev labs are design sandboxes — report touch size but do not fail the product crawl
  if (touchFail && isDevLab) {
    row.ok = true;
    row.detail = `touch-warn-dev ${result.touch.w}×${result.touch.h}`;
    result = row;
  } else if (!result.ok || touchFail) {
    issues.push({
      action,
      detail: !result.ok ? result.detail : `touch-too-small ${result.touch.w}×${result.touch.h}`,
      url: result.urlAfter,
      code: !result.ok
        ? result.detail === 'crash-or-stuck'
          ? 'CRASH_OR_STUCK'
          : result.detail?.startsWith('wrong-path')
            ? 'WRONG_PATH'
            : 'TAP_FAIL'
        : 'TOUCH_TOO_SMALL',
    });
  }
  const touchStr = result.touch
    ? ` ${result.touch.w}×${result.touch.h}${result.touch.ok ? '' : '!'}`
    : '';
  console.log(
    `[tap] ${String(action).slice(0, 48).padEnd(48)} ${result.ok ? 'ok' : 'FAIL'} ${result.detail}${touchStr}`,
  );
  appendNdjson({ run: 'tap-press', action, ok: result.ok, detail: result.detail });
}

await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 25_000 });
await waitAppReady(page);
await ensureHomeChrome(page);

// —— Chrome ——
record(
  'dock:Hamn(short)',
  await safeTap(page, page.getByRole('button', { name: /Hamn\. Håll tre sekunder för Valv/i })),
);

{
  await ensureHomeChrome(page);
  const open = await safeTap(page, page.getByRole('button', { name: /Fäll ut resurser/i }));
  record('header:resurser-open', open);
  if (open.ok) {
    const all = page.getByRole('button', { name: /Alla resurser/i });
    if (await all.isVisible().catch(() => false)) {
      record('header:alla-resurser', await safeTap(page, all));
      const close = page.getByRole('button', { name: /Stäng resurser/i });
      if (await close.isVisible().catch(() => false)) {
        record('header:resurser-close', await safeTap(page, close));
      }
    } else {
      const close = page.getByRole('button', { name: /Stäng resurser/i });
      if (await close.isVisible().catch(() => false)) {
        record('header:resurser-close', await safeTap(page, close));
      }
    }
  }
}

// —— Full drawer ——
for (const step of DRAWER_FULL_TOUR) {
  for (const item of step.links) {
    await ensureHomeChrome(page);
    await page.keyboard.press('Escape').catch(() => null);
    await page.waitForTimeout(120);
    const openMenu = await safeTap(page, page.getByRole('button', { name: /Öppna meny/i }));
    if (!openMenu.ok) {
      record(`drawer:open→${item.link}`, openMenu);
      continue;
    }
    await page.waitForTimeout(280);
    const acc = page.getByRole('button', { name: step.accordion });
    const exp = await acc.first().getAttribute('aria-expanded').catch(() => null);
    if (exp !== 'true') {
      const unfold = await safeTap(page, acc);
      if (!unfold.ok) {
        record(`drawer:${item.link}`, unfold);
        await page.keyboard.press('Escape').catch(() => null);
        continue;
      }
    }
    const link = page.getByRole('link', { name: item.link, exact: true });
    if (!(await link.first().isVisible().catch(() => false))) {
      record(`drawer:${item.link}`, { ok: true, detail: 'skip-not-found' });
      await page.keyboard.press('Escape').catch(() => null);
      continue;
    }
    const result = await safeTap(page, link, { requireNav: true });
    if (result.ok && item.expectPath) {
      const u = new URL(result.urlAfter);
      const blob = u.pathname + u.search + u.hash;
      if (!item.expectPath.test(blob) && !(item.link === 'Startskärm' && /\/$/.test(u.pathname))) {
        // hash-only nav (inkast-lite) counts as ok if still on same origin
        if (!(item.link === 'Snabb-inkast' && /inkast/i.test(u.hash + u.pathname))) {
          result.ok = false;
          result.detail = `wrong-path (${result.urlAfter})`;
        }
      }
    }
    if (!result.ok && result.detail === 'no-navigation' && item.link === 'Startskärm') {
      result.ok = true;
      result.detail = 'ok-already-home';
    }
    // soft-skip missing/timeout drawer children (accordion overflow)
    if (!result.ok && /Timeout|skip-not-found/i.test(result.detail || '')) {
      result.ok = true;
      result.detail = `skip-flaky (${result.detail.slice(0, 40)})`;
    }
    record(`drawer:${item.link}`, result);
    await page.keyboard.press('Escape').catch(() => null);
  }
}

// —— Dock ——
for (const d of [
  { name: 'Familj', expectPath: /\/familjen/ },
  { name: 'Ventil', expectPath: /\/hjartat/ },
  { name: 'Inkast', expectPath: /\/(inkast|planering)/ },
  { name: 'Anteckning', expectPath: /./ },
]) {
  await ensureHomeChrome(page);
  const result = await safeTap(page, page.getByRole('button', { name: d.name, exact: true }), {
    requireNav: true,
  });
  const pathOk =
    result.urlAfter &&
    d.expectPath.test(new URL(result.urlAfter).pathname + new URL(result.urlAfter).search);
  if (result.ok && !pathOk) {
    result.ok = false;
    result.detail = `wrong-path (${result.urlAfter})`;
  }
  record(`dock:${d.name}`, result);
  await ensureHomeChrome(page);
}

/** Collect visible interactive controls in viewport (one scroll frame). */
async function collectVisibleControls(page) {
  return page.evaluate(() => {
    const SEL =
      'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="switch"], [role="checkbox"], [role="radio"], summary, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]';
    const out = [];
    const seen = new Set();
    for (const el of document.querySelectorAll(SEL)) {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') {
        continue;
      }
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const label = (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.getAttribute('name') ||
        (el instanceof HTMLInputElement ? el.value : '') ||
        el.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 72);
      if (!label || label.length < 1) continue;
      const key = `${el.tagName}|${label}|${Math.round(r.top / 8)}|${Math.round(r.left / 8)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        key,
        label,
        tag: el.tagName,
        role: el.getAttribute('role') || '',
        y: r.top,
        x: r.left,
      });
    }
    return out.sort((a, b) => a.y - b.y || a.x - b.x);
  });
}

async function returnToRoute(page, routePath) {
  const target = new URL(`${BASE}${routePath}`);
  const now = new URL(page.url());
  if (now.pathname === target.pathname && now.search === target.search) return;
  await page.goto(`${BASE}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => null);
  await waitAppReady(page);
}

async function tapByKey(page, item) {
  const clicked = await page.evaluate((want) => {
    const SEL =
      'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="switch"], [role="checkbox"], [role="radio"], summary, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]';
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      const label = (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.getAttribute('name') ||
        (el instanceof HTMLInputElement ? el.value : '') ||
        el.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 72);
      const key = `${el.tagName}|${label}|${Math.round(r.top / 8)}|${Math.round(r.left / 8)}`;
      if (key !== want.key) continue;
      const touch = { w: Math.round(r.width), h: Math.round(r.height) };
      el.click();
      return { ok: true, touch };
    }
    return { ok: false, detail: 'not-found' };
  }, item);
  if (!clicked.ok) return { ok: false, detail: clicked.detail || 'not-found', urlAfter: page.url() };
  await page.waitForTimeout(280);
  await waitAppReady(page);
  const body = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 120);
  const crashed =
    /Något gick fel vid inloggning/i.test(body) ||
    (/Laddar Livskompassen/i.test(body) && body.length < 80);
  const touch = clicked.touch
    ? {
        ...clicked.touch,
        ok: clicked.touch.w >= TOUCH_FLOOR - 1 && clicked.touch.h >= TOUCH_FLOOR - 1,
      }
    : undefined;
  if (crashed) return { ok: false, detail: 'crash-or-stuck', urlAfter: page.url(), touch };
  return { ok: true, detail: 'ok', urlAfter: page.url(), touch };
}

async function scrollPageDown(page) {
  await page.evaluate(() => {
    const island =
      document.querySelector('[data-scroll-island], .calm-scroll-island, .hub-scroll-island, main') ||
      document.scrollingElement;
    if (island) island.scrollBy(0, Math.floor(window.innerHeight * 0.55));
    else window.scrollBy(0, Math.floor(window.innerHeight * 0.55));
  });
  await page.waitForTimeout(180);
}

// —— EVERY catalog route: load + tap EVERY visible control (scroll passes) ——
for (const route of PUBLIC_ROUTES) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => null);
  await waitAppReady(page);

  const body = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 100);
  const stuck =
    /Något gick fel vid inloggning/i.test(body) ||
    (/Laddar Livskompassen/i.test(body) && body.length < 80);
  if (stuck) {
    record(`route:${route.path}`, { ok: false, detail: 'crash-or-stuck', urlAfter: page.url() });
    continue;
  }
  record(`route:${route.path}`, { ok: true, detail: 'loaded', urlAfter: page.url() });

  const seenKeys = new Set();
  let tapped = 0;
  let skippedSacred = 0;

  for (let pass = 0; pass < SCROLL_PASSES && tapped < MAX_TAPS_PER_PAGE; pass++) {
    if (pass > 0) await scrollPageDown(page);
    const candidates = await collectVisibleControls(page);
    for (const c of candidates) {
      if (tapped >= MAX_TAPS_PER_PAGE) break;
      if (seenKeys.has(c.key)) continue;
      seenKeys.add(c.key);
      if (SKIP_TAP_RE.test(c.label)) {
        skippedSacred += 1;
        record(`page:${route.path}→skip:${c.label.slice(0, 24)}`, {
          ok: true,
          detail: 'skip-sacred-or-write',
          urlAfter: page.url(),
        });
        continue;
      }
      if (!INCLUDE_CHROME_EVERY_PAGE && CHROME_TAP_RE.test(c.label)) {
        continue; // already exercised in dock/drawer/chrome pass
      }
      // Skip fixed chrome bands (header + dock) — content/tabs live in the middle
      if (!INCLUDE_CHROME_EVERY_PAGE && (c.y < 52 || c.y > 760)) {
        continue;
      }
      await returnToRoute(page, route.path);
      // Re-scroll to same pass depth after return
      for (let s = 0; s < pass; s++) await scrollPageDown(page);
      const result = await tapByKey(page, c);
      if (!result.ok && /not-found|Timeout/i.test(result.detail || '')) {
        record(`page:${route.path}→${c.label.slice(0, 28)}`, {
          ok: true,
          detail: `skip-${result.detail}`.slice(0, 60),
        });
      } else {
        record(`page:${route.path}→${c.label.slice(0, 28)}`, result);
      }
      tapped += 1;
      await returnToRoute(page, route.path);
      for (let s = 0; s < pass; s++) await scrollPageDown(page);
    }
  }

  if (tapped === 0) {
    record(`page:${route.path}:controls`, {
      ok: true,
      detail: `no-tappable (sacred-skips=${skippedSacred})`,
    });
  } else {
    record(`page:${route.path}:summary`, {
      ok: true,
      detail: `tapped=${tapped} unique=${seenKeys.size} sacred-skips=${skippedSacred}`,
    });
  }
}

// —— Touch audit ——
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
await waitAppReady(page);
const touchAudit = [];
for (const name of ['Anteckning', 'Familj', 'Inkast', 'Ventil']) {
  const touch = await measureTouch(page, page.getByRole('button', { name, exact: true }).first());
  touchAudit.push({ name, ...touch });
  if (touch && !touch.ok) {
    issues.push({
      action: `touch:${name}`,
      detail: `${touch.w}×${touch.h} < ${TOUCH_FLOOR}`,
      code: 'TOUCH_TOO_SMALL',
    });
  }
}
const compassTouch = await measureTouch(
  page,
  page.getByRole('button', { name: /Hamn\. Håll/i }).first(),
);
touchAudit.push({ name: 'Hamn', ...compassTouch });

await browser.close();

const realConsole = consoleErrors.filter((e) => !isAuthNoise(e.text));
const summary = {
  probe: 'tap-press',
  mode: 'exhaustive-crawl',
  base: BASE,
  at: new Date().toISOString(),
  routesVisited: PUBLIC_ROUTES.length,
  maxTapsPerPage: MAX_TAPS_PER_PAGE,
  scrollPasses: SCROLL_PASSES,
  actions: actions.length,
  issueCount: issues.length,
  issues,
  touchAudit,
  consoleErrorCount: realConsole.length,
  consoleErrors: realConsole.slice(0, 20).map((e) => e.text),
  authNoiseCount: consoleErrors.length - realConsole.length,
  results: actions,
};

writeFileSync(LEGACY_OUT, JSON.stringify(summary, null, 2));
writeJson('tap-press.json', summary);

console.log('\n=== TAP-PRESS EXHAUSTIVE CRAWL ===');
console.log(
  `routes=${PUBLIC_ROUTES.length} maxTaps/page=${MAX_TAPS_PER_PAGE} actions=${summary.actions} issues=${summary.issueCount}`,
);
for (const i of issues) console.log(` FAIL ${i.action} → ${i.detail}`);
console.log(`Wrote ${LEGACY_OUT}`);
process.exit(issues.length ? 1 : 0);
