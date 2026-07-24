/**
 * Kör hub-sweep → scroll-probe → tap-press; skriver unified .cursor/qa-harden/latest.json
 * Usage: node scripts/debug_ui_suite.mjs [baseUrl]
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { writeLatest, writeJson, QA_DIR, ROOT } from './lib/qa_harden_io.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:5173';

const steps = [
  ['swedish-static', 'scripts/debug_swedish_static.mjs'],
  ['hub-sweep', 'scripts/debug_hub_sweep.mjs'],
  ['scroll-probe', 'scripts/debug_scroll_probe.mjs'],
  ['tap-press', 'scripts/debug_tap_press.mjs'],
  ['ui-consistency', 'scripts/debug_ui_consistency.mjs'],
];

const stepResults = [];
let failed = 0;
for (const [name, script] of steps) {
  console.log(`\n======== ${name} ========`);
  const r = spawnSync(process.execPath, [resolve(ROOT, script), BASE], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  });
  const code = r.status ?? 1;
  stepResults.push({ name, exit: code });
  if (code !== 0) failed += 1;
}

function loadProbe(name) {
  const p = resolve(QA_DIR, `${name}.json`);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

const probes = {
  hubSweep: loadProbe('hub-sweep'),
  scrollProbe: loadProbe('scroll-probe'),
  tapPress: loadProbe('tap-press'),
  swedishStatic: loadProbe('swedish-static'),
  uiConsistency: loadProbe('ui-consistency'),
};

const latest = writeLatest({
  kind: 'ui-suite',
  base: BASE,
  failedSteps: failed,
  stepResults,
  probes,
});
writeJson('ui-suite.json', latest);

console.log(`\n=== UI SUITE === failed_steps=${failed}/${steps.length}`);
console.log(`Wrote ${resolve(QA_DIR, 'latest.json')}`);
process.exit(failed ? 1 : 0);
