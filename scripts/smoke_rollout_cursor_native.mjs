#!/usr/bin/env node
/**
 * Smoke: Cursor-native rollout Block A+B — statisk + nätverk (om .env).
 * Usage: npm run smoke:rollout
 *
 * Mappar mot docs/evaluations/2026-06-06-manuell-smoke-checklist.md
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

const STATIC_CMDS = [
  { id: 'locked-ux', label: 'Locked UX (Hem, Valv Samla, Barnfokus)', cmd: 'npm run smoke:locked-ux' },
  { id: 'design-modules', label: 'Design modules (Liv, Drogfrihet, SpeglarSuper)', cmd: 'npm run smoke:design-modules' },
  { id: 'arbetsliv', label: 'Arbetsliv hub', cmd: 'npm run smoke:arbetsliv' },
];

const NETWORK_CMDS = [
  { id: 'inkast', label: 'Kompass / Smart Inkast', cmd: 'npm run smoke:inkast', checklist: 'Kompass' },
  { id: 'inbox', label: 'Inbox routing (G10)', cmd: 'npm run smoke:inbox', checklist: 'Planering inkorg' },
  { id: 'speglar', label: 'Speglar callable', cmd: 'npm run smoke:speglar', checklist: 'Speglar' },
  { id: 'vault-worm', label: 'Valv WORM (#3)', cmd: 'npm run smoke:vault-worm', checklist: '#3' },
  { id: 'children', label: 'Barnen children_logs (#4 backend)', cmd: 'npm run smoke:children', checklist: '#4' },
];

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

function mustNotInclude(relPath, needle, reason) {
  const text = read(relPath);
  assert(!text.includes(needle), `${relPath} får inte innehålla ${needle} — ${reason}`);
}

function runStaticGuards() {
  console.log('[smoke:rollout] Statiska guards (rollout-specifika)...');

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx',
    'InboxReviewQueueLink',
    'PlaneringInkorgPanel',
  );
  mustNotInclude(
    'src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx',
    'InboxReviewQueue',
    'planering ska länka till Valv-kö, inte bädda in kö',
  );

  mustInclude(
    'src/modules/features/family/children/hooks/useFamiljenShell.ts',
    'optimisticId',
    'pending-',
    'setLogs((prev) => [optimistic',
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/mirror/components/ActCalibrationView.tsx',
    'Fortsätt till VIVIR',
    'onContinue',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/mirror/components/SpeglingsSystem.tsx',
    'ActCalibrationView',
    'onContinue={() => setShowForensic(true)}',
  );

  console.log('[smoke:rollout] Statiska guards PASS');
  return { id: 'rollout-static', label: 'Rollout static guards', status: 'PASS', durationMs: 0 };
}

function runCmd(phase) {
  const started = Date.now();
  try {
    execSync(phase.cmd, { cwd: root, stdio: 'pipe', encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return { ...phase, status: 'PASS', durationMs: Date.now() - started };
  } catch (err) {
    const stderr = err.stderr?.toString?.() ?? err.message ?? String(err);
    return {
      ...phase,
      status: 'FAIL',
      durationMs: Date.now() - started,
      error: stderr.slice(0, 4000),
    };
  }
}

function hasEnv() {
  return existsSync(envPath);
}

function main() {
  console.log('[smoke:rollout] Cursor-native Block A+B');
  const results = [];

  for (const phase of STATIC_CMDS) {
    console.log(`[smoke:rollout] → ${phase.label}...`);
    const result = runCmd(phase);
    results.push(result);
    console.log(`[smoke:rollout]   ${result.status} (${result.durationMs}ms)`);
    if (result.status === 'FAIL') {
      console.error(`[smoke:rollout] FAIL — ${phase.label}`);
      printSummary(results, false);
      process.exit(1);
    }
  }

  try {
    results.push(runStaticGuards());
  } catch (err) {
    console.error(`[smoke:rollout] Static guards FAIL — ${err.message}`);
    results.push({
      id: 'rollout-static',
      label: 'Rollout static guards',
      status: 'FAIL',
      durationMs: 0,
      error: err.message,
    });
    printSummary(results, false);
    process.exit(1);
  }

  if (!hasEnv()) {
    console.log('[smoke:rollout] Saknar .env — hoppar nätverksfas (SKIP_NO_ENV)');
    for (const phase of NETWORK_CMDS) {
      results.push({ ...phase, status: 'SKIP_NO_ENV', durationMs: 0 });
    }
    printSummary(results, true);
    process.exit(0);
  }

  console.log('[smoke:rollout] Nätverksfas (.env finns)...');
  let networkFail = false;
  for (const phase of NETWORK_CMDS) {
    console.log(`[smoke:rollout] → ${phase.label}...`);
    const result = runCmd(phase);
    results.push(result);
    console.log(`[smoke:rollout]   ${result.status} (${result.durationMs}ms)`);
    if (result.status === 'FAIL') networkFail = true;
  }

  printSummary(results, !networkFail);
  process.exit(networkFail ? 1 : 0);
}

function printSummary(results, ok) {
  console.log('');
  console.log('[smoke:rollout] === Checklista-mapping ===');
  const mapping = [
    ['Hem / CaptureSuper', results.find((r) => r.id === 'locked-ux')?.status ?? '?'],
    ['Kompass inkast', results.find((r) => r.id === 'inkast')?.status ?? 'SKIP_NO_ENV'],
    ['Liv 6 kort', results.find((r) => r.id === 'design-modules')?.status ?? '?'],
    ['Familjen/drogfrihet', results.find((r) => r.id === 'design-modules')?.status ?? '?'],
    ['Planering inkorg-länk', results.find((r) => r.id === 'rollout-static')?.status ?? '?'],
    ['Valv Samla canonical kö', results.find((r) => r.id === 'locked-ux')?.status ?? '?'],
    ['#3 WORM', results.find((r) => r.id === 'vault-worm')?.status ?? 'SKIP_NO_ENV'],
    ['#4 optimistic (kod)', results.find((r) => r.id === 'rollout-static')?.status ?? '?'],
    ['#4 children_logs', results.find((r) => r.id === 'children')?.status ?? 'SKIP_NO_ENV'],
    ['SpeglarSuperModule', results.find((r) => r.id === 'design-modules')?.status ?? '?'],
    ['Speglar callable', results.find((r) => r.id === 'speglar')?.status ?? 'SKIP_NO_ENV'],
    ['#2d bilaga', 'MANUELL'],
  ];
  for (const [item, status] of mapping) {
    console.log(`  ${item}: ${status}`);
  }
  console.log('');
  console.log(`[smoke:rollout] ${ok ? 'PASS' : 'FAIL'}`);
}

main();
