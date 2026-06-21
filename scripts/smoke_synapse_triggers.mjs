/**
 * Smoke: SynapseBus — 5 triggers registrerade (static).
 * Usage: npm run smoke:synapse-triggers
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  console.log('[smoke:synapse-triggers] SynapseBus handlers…');

  mustInclude(
    'functions/src/adk/synapses/synapseBus.ts',
    'drive_file_ingested',
    'journal_woven',
    'dcap_alert',
    'user_overwhelm',
    'widget_recording_ingested',
    'handleDriveIngest',
    'handleJournalWoven',
    'handleDcapAlert',
    'handleWidgetRecordingIngest',
  );
  mustInclude('functions/src/adk/synapses/driveIngestSynapse.ts', 'routeInboxToWorm', 'persistKunskapFromInbox');
  mustInclude('functions/src/adk/synapses/widgetRecordingIngestSynapse.ts', 'routeInboxToWorm', 'blockWidgetKunskapRouting');
  mustInclude('functions/src/lib/inboxPersist.ts', 'persistKunskapFromInbox', "collection: 'kb_docs'");
  mustInclude('functions/src/adk/synapses/journalWovenSynapse.ts', "collection('kampspar')");
  mustInclude('functions/src/adk/synapses/dcapAlertSynapse.ts', "collection('dcap_alerts')");
  mustInclude('functions/src/adk/synapses/paralysBrytarenSynapse.ts', 'applyParalysBreak');
  mustInclude('functions/src/index.ts', 'onVaultCreatePatternScan', 'onEvolutionHubWrite');

  console.log('[smoke:synapse-triggers] Frontend masterManifest alignment…');
  mustInclude(
    'src/modules/core/manifest/domainContract.ts',
    'widget_recording_ingested',
  );
  mustInclude(
    'src/modules/core/manifest/masterManifest.ts',
    "'widget_recording_ingested'",
    'ingestWidgetRecording',
  );

  console.log('\n[smoke:synapse-triggers] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:synapse-triggers] FAIL:', err.message ?? err);
  process.exit(1);
}
