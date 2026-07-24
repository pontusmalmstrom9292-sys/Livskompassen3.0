/**
 * Scroll diagnostics — measures which surface scrolls on key routes.
 * node scripts/debug_scroll_probe.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { appendNdjson, writeJson, ensureQaDir } from './lib/qa_harden_io.mjs';
import { PUBLIC_ROUTE_PATHS } from './lib/qa_public_routes.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:5173';
const OUT = resolve('.cursor/debug-scroll-probe.json');

ensureQaDir();

function dbg(hypothesisId, message, data) {
  appendNdjson({ run: 'scroll-probe', hypothesisId, message, data });
}

const ROUTES =
  process.env.QA_SCROLL_FULL === '1'
    ? PUBLIC_ROUTE_PATHS
    : [
        '/',
        '/familjen',
        '/hjartat',
        '/planering',
        '/vardagen?tab=mabra',
        '/inkast',
      ];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; moto g85) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
});

const results = [];

for (const path of ROUTES) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => null);
  await page.waitForTimeout(process.env.QA_SCROLL_FULL === '1' ? 2500 : 1200);

  const probe = await page.evaluate(async () => {
    const scrollEl = document.scrollingElement;
    const island = document.querySelector('.calm-scroll-island');
    const hubLock = document.querySelector('.hub-view-lock');
    const dock = document.querySelector('.dock-shell, .basta-dock-bar--v2, .floating-dock');

    const metrics = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        cls: (typeof el.className === 'string' ? el.className : '').slice(0, 100),
        sh: el.scrollHeight,
        ch: el.clientHeight,
        st: el.scrollTop,
        can: el.scrollHeight > el.clientHeight + 2,
        oy: cs.overflowY,
        pe: cs.pointerEvents,
        touchAction: cs.touchAction,
        overscroll: cs.overscrollBehaviorY || cs.overscrollBehavior,
        h: Math.round(r.height),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
      };
    };

    // Nested scrollables under main
    const nested = [...document.querySelectorAll('main *, .app-main *, .hub-view-lock *')]
      .filter((el) => {
        const cs = getComputedStyle(el);
        const oy = cs.overflowY;
        return (oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 2;
      })
      .slice(0, 8)
      .map((el) => metrics(el));

    const beforeWin = scrollEl?.scrollTop ?? 0;
    const beforeIsland = island?.scrollTop ?? 0;

    // Attempt window wheel
    window.scrollBy(0, 400);
    await new Promise((r) => setTimeout(r, 80));
    const afterWinWheel = scrollEl?.scrollTop ?? 0;
    const islandAfterWin = island?.scrollTop ?? 0;

    // Reset and try island scroll
    if (scrollEl) scrollEl.scrollTop = beforeWin;
    if (island) island.scrollTop = beforeIsland;
    if (island) {
      island.scrollBy(0, 400);
      await new Promise((r) => setTimeout(r, 80));
    }
    const afterIsland = island?.scrollTop ?? 0;
    const winAfterIsland = scrollEl?.scrollTop ?? 0;

    // Touch-ish: dispatch wheel on island center
    let wheelTargetDelta = 0;
    if (island) {
      const r = island.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + Math.min(120, r.height / 2);
      const before = island.scrollTop;
      island.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 300, bubbles: true, cancelable: true, clientX: cx, clientY: cy }),
      );
      await new Promise((r) => setTimeout(r, 80));
      wheelTargetDelta = island.scrollTop - before;
    }

    const bodyCs = getComputedStyle(document.body);
    const htmlCs = getComputedStyle(document.documentElement);

    return {
      path: location.pathname + location.search,
      window: metrics(scrollEl),
      island: metrics(island),
      hubLock: metrics(hubLock),
      dock: dock
        ? {
            pe: getComputedStyle(dock).pointerEvents,
            bottom: Math.round(dock.getBoundingClientRect().bottom),
            top: Math.round(dock.getBoundingClientRect().top),
            h: Math.round(dock.getBoundingClientRect().height),
          }
        : null,
      nestedScrollables: nested,
      bodyOverflowY: bodyCs.overflowY,
      htmlOverflowY: htmlCs.overflowY,
      tests: {
        windowScrollDelta: afterWinWheel - beforeWin,
        islandMovedOnWindowScroll: islandAfterWin - beforeIsland,
        islandScrollDelta: afterIsland - beforeIsland,
        windowMovedOnIslandScroll: winAfterIsland - beforeWin,
        islandWheelDelta: wheelTargetDelta,
      },
    };
  });

  results.push(probe);
  dbg('S', 'scroll probe', probe);
  const t = probe.tests;
  console.log(
    `[scroll] ${path.padEnd(28)} winΔ=${t.windowScrollDelta} islandΔ=${t.islandScrollDelta} nest=${probe.nestedScrollables.length} islandCan=${probe.island?.can ?? false}`,
  );
}

await browser.close();

const HARD = new Set([
  'DUAL_SCROLL',
  'ISLAND_SCROLL_BLOCKED',
  'NO_SCROLL_SURFACE',
  // LOCK_BUT_WINDOW_SCROLL is intentional: hub-view-lock uses document scroll (obsidian-calm-shells § Hub layout)
]);

const routeIssues = [];
for (const r of results) {
  const issues = [];
  if (r.island?.can && r.window?.can) issues.push('DUAL_SCROLL');
  if (r.nestedScrollables.length >= 2) issues.push(`NESTED_${r.nestedScrollables.length}`);
  if (r.island?.can && r.tests.islandScrollDelta === 0) issues.push('ISLAND_SCROLL_BLOCKED');
  if (!r.island && r.window?.can === false) issues.push('NO_SCROLL_SURFACE');
  // Document-scroll mode: hub lock + non-scrolling island + working window = OK
  if (r.hubLock && r.island && !r.island.can && r.window?.can) {
    if (r.tests.windowScrollDelta === 0) issues.push('NO_SCROLL_SURFACE');
    else issues.push('DOC_SCROLL_OK'); // informational only
  }
  // True dead end: lock present but neither surface scrolls
  if (r.hubLock && !r.window?.can && !(r.island?.can && r.tests.islandScrollDelta > 0)) {
    if (!issues.includes('NO_SCROLL_SURFACE')) issues.push('NO_SCROLL_SURFACE');
  }
  const hard = issues.filter((c) => HARD.has(c));
  routeIssues.push({ path: r.path, issues, hard });
  console.log(`  → ${r.path}: ${issues.length ? issues.join(',') : 'OK'}`);
}

const hardFails = routeIssues.filter((r) => r.hard.length > 0);
const summary = {
  probe: 'scroll-probe',
  base: BASE,
  at: new Date().toISOString(),
  results,
  routeIssues,
  hardFailCount: hardFails.length,
  hardFails,
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
writeJson('scroll-probe.json', summary);
console.log(`Wrote ${OUT} + .cursor/qa-harden/scroll-probe.json`);
console.log(`hardFails=${hardFails.length}`);
process.exit(hardFails.length ? 1 : 0);
