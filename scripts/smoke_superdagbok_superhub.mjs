/**
 * Static smoke: Superdagbok Universal Input Superhub (Fas 11A→11C — W4).
 * Usage: node scripts/smoke_superdagbok_superhub.mjs
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

const W4_FILES = [
  'docs/evaluations/2026-06-14-superdagbok-superhub-djupanalys.md',
  'docs/specs/Superdagbok-INPUT-SUPERHUB-SPEC.md',
  'src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx',
  'src/modules/features/lifeJournal/diary/supermodule/dagbokInputModes.ts',
  'src/modules/features/lifeJournal/diary/supermodule/index.ts',
  'src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokReflektionDelegate.tsx',
  'src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokQuickMirrorDelegate.tsx',
  'src/modules/features/lifeJournal/diary/routing/DagbokInputRoutes.tsx',
];

const EXPECTED_MODES = ['reflektion', 'quick_mirror', 'arkiv'];

/** Firestore write patterns routern får inte innehålla */
const ROUTER_FORBIDDEN_WRITES = [
  'saveJournalEntry',
  'addDoc',
  'setDoc',
  'writeBatch',
  'weaveJournalEntry',
  'fetchJournalQuickMirror',
  'getJournalEntries',
  'useJournalFlow',
];

function main() {
  console.log('[smoke:superdagbok-superhub] W4 fil-existens…');
  for (const rel of W4_FILES) {
    read(rel);
  }

  console.log('[smoke:superdagbok-superhub] Mode-export (dagbokInputModes.ts)…');
  const modesSrc = read('src/modules/features/lifeJournal/diary/supermodule/dagbokInputModes.ts');
  for (const mode of EXPECTED_MODES) {
    assert(modesSrc.includes(`'${mode}'`), `dagbokInputModes.ts saknar mode: ${mode}`);
  }
  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/dagbokInputModes.ts',
    'export type DagbokInputMode',
    'export const DEFAULT_DAGBOK_INPUT_MODE',
    'export function parseDagbokInputMode',
    'export function isDagbokInputMode',
    'export const DAGBOK_INPUT_MODES_PRIMARY',
    'export const DAGBOK_INPUT_MODES_FAS11C',
    'dagbokLegacyModeToInputMode',
  );

  console.log('[smoke:superdagbok-superhub] index.ts barrel…');
  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/index.ts',
    'DagbokInputSuperModule',
    'parseDagbokInputMode',
    'DagbokInputMode',
    'DagbokReflektionDelegate',
    'DagbokQuickMirrorDelegate',
  );

  console.log('[smoke:superdagbok-superhub] Router utan Firestore-skrivningar…');
  const routerSrc = read(
    'src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx',
  );
  for (const needle of ROUTER_FORBIDDEN_WRITES) {
    assert(!routerSrc.includes(needle), `DagbokInputSuperModule får inte innehålla: ${needle}`);
  }
  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx',
    'parseDagbokInputMode',
    'DagbokReflektionDelegate',
    'DagbokQuickMirrorDelegate',
    'inputMode',
    'glow="blue"',
    'DagbokArkivDelegate',
    'calm-scroll-island',
  );
  mustNotInclude(
    'src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx',
    'glow="gold"',
    'glow-bottom-gold',
  );

  console.log('[smoke:superdagbok-superhub] Skuggrutt utan writes…');
  const routesSrc = read('src/modules/features/lifeJournal/diary/routing/DagbokInputRoutes.tsx');
  mustInclude(
    'src/modules/features/lifeJournal/diary/routing/DagbokInputRoutes.tsx',
    'path="input"',
    'DagbokInputSuperModule',
    'DagbokInputRoutes',
    '/hjartat/input',
  );
  for (const needle of ROUTER_FORBIDDEN_WRITES) {
    assert(!routesSrc.includes(needle), `DagbokInputRoutes får inte innehålla: ${needle}`);
  }

  console.log('[smoke:superdagbok-superhub] Delegater → skrivskyddade API:er…');
  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokReflektionDelegate.tsx',
    'useJournalFlow',
    'MoodStep',
    'ReflectionStep',
    'ConfirmStep',
    'SavedStep',
    'journal_worm',
    'DagbokArkivDelegate',
    'JournalArchiveReadonly',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokQuickMirrorDelegate.tsx',
    'useJournalFlow',
    'JournalQuickMode',
    'handleQuickSave',
    'journal_worm',
  );

  console.log('[smoke:superdagbok-superhub] SPEC + djupanalys…');
  mustInclude(
    'docs/specs/Superdagbok-INPUT-SUPERHUB-SPEC.md',
    'reflektion',
    'quick_mirror',
    'arkiv',
    'glow-bottom-blue',
    'DagbokInputSuperModule',
    '/hjartat/input',
  );
  mustInclude(
    'docs/evaluations/2026-06-14-superdagbok-superhub-djupanalys.md',
    'DagbokInputSuperModule',
    'W4',
    'W5',
    'weaveJournalEntry',
    'journalQuickMirror',
  );

  console.log('[smoke:superdagbok-superhub] W5 integration (AppRoutes + HjartatPage)…');
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'DagbokInputRoutes',
    '${NAV_PATHS.HJARTAT}/*',
  );
  mustInclude(
    'src/modules/core/pages/DagbokPage.tsx',
    'DagbokInputSuperModule',
    'dagbokLegacyModeToInputMode',
    'HjartatReflektionPanel',
  );
  mustInclude('package.json', 'smoke:superdagbok-superhub');

  console.log('[smoke:superdagbok-superhub] Skrivskydd — journal API oförändrat (import-only)…');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'export function useJournalFlow',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/api/journalQuickMirrorService.ts',
    'fetchJournalQuickMirror',
  );

  console.log('[smoke:superdagbok-superhub] PASS — W4 superhub skelett verifierat.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:superdagbok-superhub] FAIL:', err.message ?? err);
  process.exit(1);
}
