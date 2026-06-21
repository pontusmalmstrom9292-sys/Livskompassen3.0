/**
 * Static smoke: Planering Universal Input Superhub (Fas 9A→9C, W1).
 * Usage: node scripts/smoke_planering_superhub.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

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

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

const W1_FILES = [
  'docs/archive/evaluations-fas19-2026-06/2026-06-14-planering-superhub-djupanalys.md',
  'docs/specs/Planering-INPUT-SUPERHUB-SPEC.md',
  'src/modules/features/admin/planning/supermodule/PlaneringInputSuperModule.tsx',
  'src/modules/features/admin/planning/supermodule/planeringInputModes.ts',
  'src/modules/features/admin/planning/supermodule/index.ts',
  'src/modules/features/admin/planning/supermodule/delegates/PlaneringTaskQuickDelegate.tsx',
  'src/modules/features/admin/planning/supermodule/delegates/PlaneringInkastDelegate.tsx',
  'src/modules/features/admin/planning/supermodule/delegates/PlaneringQuickListDelegate.tsx',
  'src/modules/features/admin/planning/routing/PlaneringInputRoutes.tsx',
];

const EXPECTED_MODES = ['task_quick', 'inkast', 'quick_list'];

/** Firestore write patterns routern får inte innehålla */
const ROUTER_FORBIDDEN_WRITES = [
  'createPlanningTask',
  'updatePlanningTask',
  'addDoc',
  'setDoc',
  'writeBatch',
  'planningTasksApi',
];

function main() {
  console.log('[smoke:planering-superhub] W1 fil-existens…');
  for (const rel of W1_FILES) {
    read(rel);
  }

  console.log('[smoke:planering-superhub] Mode-export (planeringInputModes.ts)…');
  const modesSrc = read('src/modules/features/admin/planning/supermodule/planeringInputModes.ts');
  for (const mode of EXPECTED_MODES) {
    assert(modesSrc.includes(`'${mode}'`), `planeringInputModes.ts saknar mode: ${mode}`);
  }
  mustInclude(
    'src/modules/features/admin/planning/supermodule/planeringInputModes.ts',
    'export type PlaneringInputMode',
    'export const DEFAULT_PLANERING_INPUT_MODE',
    'export function parsePlaneringInputMode',
    'export function isPlaneringInputMode',
    'export const PLANERING_INPUT_MODES_PRIMARY',
    'export const PLANERING_INPUT_MODES_FAS9C',
  );

  console.log('[smoke:planering-superhub] index.ts barrel…');
  mustInclude(
    'src/modules/features/admin/planning/supermodule/index.ts',
    'PlaneringInputSuperModule',
    'parsePlaneringInputMode',
    'PlaneringInputMode',
  );

  console.log('[smoke:planering-superhub] Router utan Firestore-skrivningar…');
  const routerSrc = read(
    'src/modules/features/admin/planning/supermodule/PlaneringInputSuperModule.tsx',
  );
  for (const needle of ROUTER_FORBIDDEN_WRITES) {
    assert(!routerSrc.includes(needle), `PlaneringInputSuperModule får inte innehålla: ${needle}`);
  }
  mustInclude(
    'src/modules/features/admin/planning/supermodule/PlaneringInputSuperModule.tsx',
    'parsePlaneringInputMode',
    'PlaneringTaskQuickDelegate',
    'PlaneringInkastDelegate',
    'PlaneringQuickListDelegate',
    'inputMode',
    'glow="gold"',
  );

  console.log('[smoke:planering-superhub] Skuggrutt utan writes…');
  const routesSrc = read('src/modules/features/admin/planning/routing/PlaneringInputRoutes.tsx');
  mustInclude(
    'src/modules/features/admin/planning/routing/PlaneringInputRoutes.tsx',
    'path="input"',
    'PlaneringInputSuperModule',
    'PlaneringInputRoutes',
  );
  for (const needle of ROUTER_FORBIDDEN_WRITES) {
    assert(!routesSrc.includes(needle), `PlaneringInputRoutes får inte innehålla: ${needle}`);
  }

  console.log('[smoke:planering-superhub] Delegater → befintliga komponenter…');
  mustInclude(
    'src/modules/features/admin/planning/supermodule/delegates/PlaneringTaskQuickDelegate.tsx',
    'usePlanningTasks',
    'addTask',
  );
  mustInclude(
    'src/modules/features/admin/planning/supermodule/delegates/PlaneringInkastDelegate.tsx',
    'CaptureSuperModule',
    'variant="planering"',
  );
  mustInclude(
    'src/modules/features/admin/planning/supermodule/delegates/PlaneringQuickListDelegate.tsx',
    'PlaneringQuickListPanel',
  );

  console.log('[smoke:planering-superhub] SPEC + djupanalys…');
  mustInclude(
    'docs/specs/Planering-INPUT-SUPERHUB-SPEC.md',
    'task_quick',
    'inkast',
    'quick_list',
    'PlaneringInputSuperModule',
  );
  mustInclude(
    'docs/archive/evaluations-fas19-2026-06/2026-06-14-planering-superhub-djupanalys.md',
    'PlaneringInputSuperModule',
    'W1',
    'W3',
  );

  console.log('[smoke:planering-superhub] PASS — W1 superhub skelett verifierat.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:planering-superhub] FAIL:', err.message ?? err);
  process.exit(1);
}
