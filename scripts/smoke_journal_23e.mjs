/**
 * Static smoke: Fas 23E — Tyst läge / dissociation i Superdagbok.
 * Usage: npm run smoke:journal-23e
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

function main() {
  console.log('[smoke:journal-23e] Fas 23E Tyst läge…');

  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/dagbokInputModes.ts',
    "'tyst'",
    'parseDagbokCapacityParam',
    "capacity === 'minimal'",
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokTystDelegate.tsx',
    'DagbokTystDelegate',
    'data-capacity="minimal"',
    'dagbok-tyst-lage',
    'handleTystSave',
    'DagbokBurnDelegate',
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx',
    "case 'tyst':",
    'DagbokTystDelegate',
    'parseDagbokCapacityParam',
    'dagbok-hub--tyst',
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'handleTystSave',
    'moodOverride',
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/SavedStep.tsx',
    'minimalDone',
    'DAGBOK_TYST_DONE_LABEL',
    'Klart',
  );

  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/ReflectionStep.tsx',
    "lowCapacity ? 'tre-ord' : 'fritt'",
  );

  mustInclude('package.json', 'smoke:journal-23e');

  console.log('[smoke:journal-23e] PASS — tyst läge + tre-ord default + Klart-steg.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:journal-23e] FAIL:', err.message ?? err);
  process.exit(1);
}
