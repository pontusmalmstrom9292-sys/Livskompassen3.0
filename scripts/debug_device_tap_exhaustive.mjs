/**
 * Exhaustive button crawl on physical Android WebView via CDP (USB, free).
 * Same sacred skips as web tap-press: no Valv long-press, biometri, logout, save/delete.
 *
 * Usage: node scripts/debug_device_tap_exhaustive.mjs
 * Env: QA_MAX_TAPS_PER_PAGE=24  QA_SCROLL_PASSES=4  QA_DEVICE_SERIAL=ZY22L8WFBX
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { writeJson, ensureQaDir, ROOT } from './lib/qa_harden_io.mjs';
import { PUBLIC_ROUTES } from './lib/qa_public_routes.mjs';

ensureQaDir();

const PACKAGE = 'com.livskompassen.app';
const CDP_PORT = Number(process.env.QA_CDP_PORT || 9222);
const ORIGIN = 'https://localhost';
const MAX_TAPS_PER_PAGE = Math.max(
  4,
  Number(process.env.QA_MAX_TAPS_PER_PAGE || process.env.QA_PHONE_MAX_TAPS || 40),
);
const SCROLL_PASSES = Math.max(
  1,
  Number(process.env.QA_SCROLL_PASSES || process.env.QA_PHONE_SCROLL_PASSES || 6),
);
const TOUCH_FLOOR = 44;
const SKIP_TAP_RE =
  /håll tre sekunder|håll tre|långtryck|logga ut|radera|ta bort|töm (allt|korg|arkiv)|lås valv|biometr|fingeravtryck|ansikts|publicera|deploy|spara|skicka|bekräfta radering|permanent|projektnamn|nytt projekt|skapa projekt|uppgiftstitel|rubrik för|välj fil|ladda upp/i;
const CHROME_TAP_RE =
  /öppna meny|stäng meny|fäll ut resurser|stäng resurser|alla resurser|konto och inloggning|kompis —|aktivera sos|tvingad upplåsning|system status|dölj snabb|^anteckning$|^familj$|^ventil$|^inkast$|hamn\. håll/i;

function which(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  return '';
}

function adbBin() {
  const home = resolve(process.env.HOME || '', 'Library/Android/sdk/platform-tools/adb');
  return which('adb') || (existsSync(home) ? home : '');
}

function adb(args, opts = {}) {
  const bin = adbBin();
  if (!bin) return { status: 127, stdout: '', stderr: 'adb not found' };
  return spawnSync(bin, args, { encoding: 'utf8', cwd: ROOT, ...opts });
}

function deviceSerial() {
  if (process.env.QA_DEVICE_SERIAL) return process.env.QA_DEVICE_SERIAL;
  const out = adb(['devices']);
  const ready = (out.stdout || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /\tdevice$/.test(l))
    .map((l) => l.split('\t')[0]);
  return ready[0] || '';
}

function adbD(serial, args, opts = {}) {
  return adb(['-s', serial, ...args], opts);
}

async function waitAppReady(page) {
  for (let i = 0; i < 24; i++) {
    const txt = ((await page.locator('body').innerText().catch(() => '')) || '').trim();
    if (!/^Laddar Livskompassen/i.test(txt) || txt.length > 80) return;
    await page.waitForTimeout(400);
  }
}

async function collectVisibleControls(page) {
  return page.evaluate(() => {
    const SEL =
      'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="switch"], [role="checkbox"], [role="radio"], summary, input[type="button"], input[type="submit"]';
    const out = [];
    const seen = new Set();
    for (const el of document.querySelectorAll(SEL)) {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') continue;
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const label = (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 72);
      if (!label) continue;
      const key = `${el.tagName}|${label}|${Math.round(r.top / 8)}|${Math.round(r.left / 8)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, label, y: r.top, x: r.left });
    }
    return out.sort((a, b) => a.y - b.y || a.x - b.x);
  });
}

async function tapByKey(page, item) {
  const clicked = await page.evaluate((want) => {
    const SEL =
      'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="switch"], [role="checkbox"], [role="radio"], summary, input[type="button"], input[type="submit"]';
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      const label = (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
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
  if (!clicked.ok) return { ok: false, detail: 'not-found', urlAfter: page.url() };
  await page.waitForTimeout(320);
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

async function returnToRoute(page, routePath) {
  const target = `${ORIGIN}${routePath}`;
  const now = page.url();
  try {
    const n = new URL(now);
    const t = new URL(target);
    if (n.pathname === t.pathname && n.search === t.search) return;
  } catch {
    /* ignore */
  }
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => null);
  await waitAppReady(page);
}

async function scrollPageDown(page) {
  await page.evaluate(() => {
    const island =
      document.querySelector('[data-scroll-island], .calm-scroll-island, .hub-scroll-island, main') ||
      document.scrollingElement;
    if (island) island.scrollBy(0, Math.floor(window.innerHeight * 0.55));
    else window.scrollBy(0, Math.floor(window.innerHeight * 0.55));
  });
  await page.waitForTimeout(200);
}

const summary = {
  probe: 'device-tap-exhaustive',
  at: new Date().toISOString(),
  status: 'skip',
  detail: '',
  serial: '',
  routesVisited: 0,
  actions: 0,
  issueCount: 0,
  issues: [],
  results: [],
};

const serial = deviceSerial();
if (!adbBin()) {
  summary.detail = 'adb saknas';
  writeJson('device-tap-exhaustive.json', summary);
  console.log(`[device-tap] SKIP ${summary.detail}`);
  process.exit(0);
}
if (!serial) {
  summary.detail = 'Ingen USB-telefon';
  writeJson('device-tap-exhaustive.json', summary);
  console.log(`[device-tap] SKIP ${summary.detail}`);
  process.exit(0);
}
summary.serial = serial;

adbD(serial, ['shell', 'am', 'start', '-n', `${PACKAGE}/.MainActivity`], { timeout: 15_000 });
await new Promise((r) => setTimeout(r, 2500));

let pid = (adbD(serial, ['shell', 'pidof', PACKAGE]).stdout || '').trim().split(/\s+/)[0];
if (!pid) {
  summary.status = 'fail';
  summary.detail = 'appen startade inte (pid saknas)';
  writeJson('device-tap-exhaustive.json', summary);
  console.log(`[device-tap] FAIL ${summary.detail}`);
  process.exit(1);
}

const sock = `webview_devtools_remote_${pid}`;
adbD(serial, ['forward', '--remove', `tcp:${CDP_PORT}`]);
const fwd = adbD(serial, ['forward', `tcp:${CDP_PORT}`, `localabstract:${sock}`]);
if (fwd.status !== 0) {
  summary.status = 'fail';
  summary.detail = `cdp forward fail: ${(fwd.stderr || fwd.stdout || '').slice(0, 120)}`;
  writeJson('device-tap-exhaustive.json', summary);
  console.log(`[device-tap] FAIL ${summary.detail}`);
  process.exit(1);
}

console.log(`[device-tap] CDP → ${serial} pid=${pid} sock=${sock} routes=${PUBLIC_ROUTES.length}`);

let browser;
try {
  browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`, { timeout: 20_000 });
} catch (e) {
  summary.status = 'fail';
  summary.detail = `CDP connect: ${e instanceof Error ? e.message : String(e)}`;
  writeJson('device-tap-exhaustive.json', summary);
  console.log(`[device-tap] FAIL ${summary.detail}`);
  process.exit(1);
}

const pages = browser.contexts().flatMap((c) => c.pages());
const page =
  pages.find((p) => /localhost/i.test(p.url()) && !/sw\.js/i.test(p.url())) || pages[0];
if (!page) {
  summary.status = 'fail';
  summary.detail = 'ingen WebView-sida via CDP';
  writeJson('device-tap-exhaustive.json', summary);
  // Do NOT browser.close() — would tear down the phone WebView
  process.exit(1);
}

/** Dismiss native prompt/alert/confirm (Projekt window.prompt = black Android box). */
page.on('dialog', async (dialog) => {
  try {
    await dialog.dismiss();
  } catch {
    /* already closed */
  }
});

const actions = [];
const issues = [];

function record(action, result) {
  const row = { action, ...result };
  actions.push(row);
  const touchFail = result.touch && result.touch.ok === false;
  const isDevLab = String(action).includes('/dev/');
  if (touchFail && isDevLab) {
    row.detail = `touch-warn-dev ${result.touch.w}×${result.touch.h}`;
  } else if (!result.ok || touchFail) {
    issues.push({
      action,
      detail: !result.ok ? result.detail : `touch-too-small ${result.touch.w}×${result.touch.h}`,
      url: result.urlAfter,
      code: !result.ok ? 'TAP_FAIL' : 'TOUCH_TOO_SMALL',
    });
  }
  console.log(
    `[device-tap] ${String(action).slice(0, 46).padEnd(46)} ${result.ok ? 'ok' : 'FAIL'} ${result.detail}`,
  );
}

try {
  // Chrome once on home
  await page.goto(`${ORIGIN}/`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => null);
  await waitAppReady(page);
  record('device:home', { ok: true, detail: 'loaded', urlAfter: page.url() });

  for (const name of ['Anteckning', 'Familj', 'Ventil', 'Inkast']) {
    const loc = page.getByRole('button', { name, exact: true }).first();
    if (await loc.isVisible().catch(() => false)) {
      try {
        await loc.click({ timeout: 4000 });
        await page.waitForTimeout(400);
        await waitAppReady(page);
        record(`device:dock:${name}`, { ok: true, detail: 'ok', urlAfter: page.url() });
      } catch (e) {
        record(`device:dock:${name}`, {
          ok: false,
          detail: e instanceof Error ? e.message.slice(0, 100) : String(e),
          urlAfter: page.url(),
        });
      }
      await page.goto(`${ORIGIN}/`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => null);
      await waitAppReady(page);
    }
  }

  for (const route of PUBLIC_ROUTES) {
    // Skip heavy /dev labs on phone only if QA_DEVICE_DEV=0 (default: include — phone-primary)
    if (route.path.startsWith('/dev/') && process.env.QA_DEVICE_DEV === '0') {
      record(`device:route:${route.path}`, { ok: true, detail: 'skip-dev-on-phone' });
      continue;
    }
    await page.goto(`${ORIGIN}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => null);
    await waitAppReady(page);
    const body = ((await page.locator('body').innerText().catch(() => '')) || '').slice(0, 100);
    const stuck =
      /Något gick fel vid inloggning/i.test(body) ||
      (/Laddar Livskompassen/i.test(body) && body.length < 80);
    if (stuck) {
      record(`device:route:${route.path}`, { ok: false, detail: 'crash-or-stuck', urlAfter: page.url() });
      continue;
    }
    record(`device:route:${route.path}`, { ok: true, detail: 'loaded', urlAfter: page.url() });
    summary.routesVisited += 1;

    const seen = new Set();
    let tapped = 0;
    for (let pass = 0; pass < SCROLL_PASSES && tapped < MAX_TAPS_PER_PAGE; pass++) {
      if (pass > 0) await scrollPageDown(page);
      const candidates = await collectVisibleControls(page);
      for (const c of candidates) {
        if (tapped >= MAX_TAPS_PER_PAGE) break;
        if (seen.has(c.key)) continue;
        seen.add(c.key);
        if (SKIP_TAP_RE.test(c.label) || CHROME_TAP_RE.test(c.label)) continue;
        if (c.y < 52 || c.y > 760) continue;
        await returnToRoute(page, route.path);
        for (let s = 0; s < pass; s++) await scrollPageDown(page);
        const result = await tapByKey(page, c);
        if (!result.ok && /not-found/i.test(result.detail || '')) {
          record(`device:${route.path}→${c.label.slice(0, 26)}`, {
            ok: true,
            detail: 'skip-not-found',
          });
        } else {
          record(`device:${route.path}→${c.label.slice(0, 26)}`, result);
        }
        tapped += 1;
        await returnToRoute(page, route.path);
        for (let s = 0; s < pass; s++) await scrollPageDown(page);
      }
    }
    record(`device:${route.path}:summary`, {
      ok: true,
      detail: `tapped=${tapped} unique=${seen.size}`,
    });
  }

  summary.status = issues.length ? 'fail' : 'pass';
  summary.detail = `routes=${summary.routesVisited} actions=${actions.length} issues=${issues.length}`;
} catch (e) {
  summary.status = 'fail';
  summary.detail = e instanceof Error ? e.message.slice(0, 200) : String(e);
} finally {
  summary.actions = actions.length;
  summary.issueCount = issues.length;
  summary.issues = issues;
  summary.results = actions;
  writeJson('device-tap-exhaustive.json', summary);
  // Never browser.close() — keeps phone WebView alive
  try {
    adbD(serial, ['forward', '--remove', `tcp:${CDP_PORT}`]);
  } catch {
    /* ignore */
  }
}

console.log(`\n=== DEVICE TAP EXHAUSTIVE ===`);
console.log(`[device-tap] ${summary.status.toUpperCase()} ${summary.detail}`);
for (const i of issues.slice(0, 20)) console.log(` FAIL ${i.action} → ${i.detail}`);
process.exit(summary.status === 'fail' ? 1 : 0);
