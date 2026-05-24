/**
 * Static smoke: ADK synapse wiring + orkester integration (no Firebase).
 * Usage: npm run smoke:orkester
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

function run(cmd, cwd = root) {
  execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' });
}

function main() {
  console.log('[smoke:orkester] SynapseBus handlers...');
  mustInclude(
    'functions/src/adk/synapses/synapseBus.ts',
    'handleDriveIngest',
    'handleJournalWoven',
    'handleDcapAlert',
    'applyParalysBreak',
    'drive_file_ingested',
    'journal_woven',
    'dcap_alert',
    'user_overwhelm',
  );
  mustNotInclude('functions/src/adk/synapses/synapseBus.ts', 'stub log', 'TODO: implement');

  console.log('[smoke:orkester] journal_woven opt-in...');
  mustInclude(
    'functions/src/adk/synapses/journalWovenSynapse.ts',
    'optIn !== true',
    "source: 'journal_woven'",
    "collection('kampspar')",
  );

  console.log('[smoke:orkester] dcap_alert WORM...');
  mustInclude(
    'functions/src/adk/synapses/dcapAlertSynapse.ts',
    "collection('dcap_alerts')",
    'hitlRequired',
    'hashPayload',
  );
  mustInclude('firestore.rules', 'match /dcap_alerts/{docId}', 'allow create, update, delete: if false');

  console.log('[smoke:orkester] Supervisor → dcap_alert...');
  mustInclude('functions/src/agents/kompis-supervisor.ts', "trigger: 'dcap_alert'");

  console.log('[smoke:orkester] Dagbok frontend weave...');
  mustInclude(
    'src/modules/dagbok/hooks/useJournalFlow.ts',
    'weaveJournalEntry',
    'journalWovenToKampspar',
  );
  mustInclude('functions/src/index.ts', 'journalWovenToKampspar', "trigger: 'journal_woven'");

  console.log('[smoke:orkester] Orkester UI registry...');
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultOrkesterPanel.tsx',
    'VaultOrkesterPanel',
    'OrkesterAgentTrio',
  );
  mustInclude('src/modules/verklighetsvalvet/components/VaultPage.tsx', "'orkester'", 'VaultOrkesterPanel');

  console.log('[smoke:orkester] Specialist agents + conductor...');
  for (const agent of [
    'orkester-conductor.md',
    'specialist-adk-weaver.md',
    'specialist-security-auditor.md',
    'specialist-smoke-runner.md',
    'specialist-ux-guardian.md',
  ]) {
    assert(existsSync(resolve(root, '.cursor/agents', agent)), `saknar .cursor/agents/${agent}`);
  }

  console.log('[smoke:orkester] functions build...');
  run('npm run build', resolve(root, 'functions'));

  console.log('[smoke:orkester] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:orkester] FAIL:', err.message ?? err);
  process.exit(1);
}
