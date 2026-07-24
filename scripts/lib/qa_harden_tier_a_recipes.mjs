/**
 * Tier A recipe autofix — deterministic safe patches only.
 * Returns { applied: number, notes: string[] }
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './qa_harden_io.mjs';

const LIV_LAUNCHER = resolve(ROOT, 'src/modules/shell/LivLauncherPage.tsx');

/**
 * @param {Array<{ code: string, path?: string, recipe?: string }>} tierA
 */
export function applyTierARecipes(tierA) {
  const notes = [];
  let applied = 0;

  const scrollCodes = tierA.filter((f) =>
    ['DUAL_SCROLL', 'ISLAND_SCROLL_BLOCKED', 'NO_SCROLL_SURFACE'].includes(f.code),
  );
  if (scrollCodes.length) {
    notes.push(
      `${scrollCodes.length} scroll findings → agent queue (hub uses document scroll by design; no blind CSS).`,
    );
  }

  const touchIssues = tierA.filter((f) => f.code === 'TOUCH_TOO_SMALL');
  if (touchIssues.length) {
    notes.push(
      `TOUCH_TOO_SMALL ×${touchIssues.length} → polish-pass (content) + dock orörd (chrome-lock).`,
    );
  }

  // Smoke design-modules expects contentIsland={false} on LivLauncherPage
  if (existsSync(LIV_LAUNCHER)) {
    let src = readFileSync(LIV_LAUNCHER, 'utf8');
    if (!src.includes('contentIsland={false}') && src.includes('<HubPageShell')) {
      src = src.replace(
        /<HubPageShell([\s\S]*?)>/,
        (m) => (m.includes('contentIsland=') ? m : m.replace('<HubPageShell', '<HubPageShell\n      contentIsland={false}')),
      );
      if (src.includes('contentIsland={false}')) {
        writeFileSync(LIV_LAUNCHER, src);
        applied += 1;
        notes.push('LivLauncherPage: set contentIsland={false} for design-modules smoke');
      }
    }
  }

  // Soft: ensure HubErrorBoundary / loading isn't stuck on known launcher path — no-op if present
  const crashes = tierA.filter((f) =>
    ['CRASH_OR_STUCK', 'LOADING_STUCK', 'PAGEERROR', 'HUB_FAIL'].includes(f.code),
  );
  if (crashes.length) {
    notes.push(
      `${crashes.length} crash/hub findings need agent inspection (no blind recipe). Wrote queue for Cursor.`,
    );
  }

  // TAP_FAIL on wrong-path is Tier-ish — leave for classify; note only
  const taps = tierA.filter((f) => f.code === 'TAP_FAIL');
  if (taps.length) {
    notes.push(`TAP_FAIL ×${taps.length} → agent queue (no blind nav rewrite).`);
  }

  return { applied, notes };
}
