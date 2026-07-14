/**
 * Smoke: G10 drive ingest dry-run — notifyNewFile → SynapseBus → classify utan persist.
 * Usage: npm run smoke:drive-ingest
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readCanonical(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

function smokeStatic() {
  const agents = readCanonical('functions/src/callables/agents.ts');
  assert(agents.includes('notifyNewFile'), 'agents.ts saknar notifyNewFile');
  assert(agents.includes("trigger: 'drive_file_ingested'"), 'notifyNewFile ska emitSynapse drive_file_ingested');
  assert(agents.includes('dryRun'), 'notifyNewFile saknar dryRun-stöd');

  const synapseBus = readCanonical('functions/src/adk/synapses/synapseBus.ts');
  assert(synapseBus.includes('handleDriveIngest'), 'synapseBus saknar handleDriveIngest');
  assert(synapseBus.includes('drive_file_ingested'), 'synapseBus saknar drive_file_ingested trigger');

  const driveSynapse = readCanonical('functions/src/adk/synapses/driveIngestSynapse.ts');
  assert(driveSynapse.includes('classifyInboxDocument'), 'drive synapse saknar classifyInboxDocument');
  assert(driveSynapse.includes('routeInboxToWorm'), 'drive synapse saknar routeInboxToWorm');
  assert(driveSynapse.includes('dryRun'), 'drive synapse saknar dryRun-gren');
  assert(driveSynapse.includes('allowBarnenAutoPersist: false'), 'drive synapse saknar barnen HITL-block');
  assert(
    driveSynapse.includes('journal_woven opt-in'),
    'drive synapse saknar kampspar opt-in-kommentar'
  );
  assert(
    !driveSynapse.includes("collection('kampspar')"),
    'drive synapse får inte auto-routa till kampspar'
  );

  const journalSynapse = readCanonical('functions/src/adk/synapses/journalWovenSynapse.ts');
  assert(journalSynapse.includes('optIn !== true'), 'journal_woven saknar optIn-gate');
  assert(journalSynapse.includes("source: 'journal_woven'"), 'journal_woven saknar source tag');
  assert(journalSynapse.includes("collection('kampspar')"), 'journal_woven saknar kampspar persist');

  const journalService = readCanonical(
    'src/modules/features/lifeJournal/diary/diary/api/journalWovenService.ts'
  );
  assert(journalService.includes('optIn: true'), 'journalWovenService saknar optIn: true');

  const inboxPersist = readCanonical('functions/src/lib/inboxPersist.ts');
  assert(inboxPersist.includes('persistKunskapFromInbox'), 'inboxPersist saknar persistKunskapFromInbox');
  assert(inboxPersist.includes("collection: 'kb_docs'"), 'inboxPersist saknar kb_docs routing');

  const classifier = readCanonical('functions/src/lib/inboxClassifier.ts');
  const hcfIdx = classifier.indexOf('covertHcfSignal');
  const kunskapIdx = classifier.indexOf("routing: 'kunskap'");
  assert(hcfIdx > 0 && kunskapIdx > 0 && hcfIdx < kunskapIdx, 'HCF-heuristik måste komma före kunskap-keywords');
}

function smokeFunctionsBuild() {
  execSync('npm run build', { cwd: resolve(root, 'functions'), stdio: 'pipe' });
}

console.log('[smoke:drive-ingest] static wiring (dry-run)…');
smokeStatic();
console.log('[smoke:drive-ingest] functions build…');
smokeFunctionsBuild();
console.log('[smoke:drive-ingest] PASS');
