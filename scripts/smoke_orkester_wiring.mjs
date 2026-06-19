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
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'weaveJournalEntry',
    'journalWovenToKampspar',
    'if (hasVaultGate())',
    'weaveJournalEntry({ journalEntryId: id, mood, text: entryText })',
  );
  mustNotInclude(
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'optInKampspar && hasVaultGate()',
  );
  mustInclude('functions/src/callables/agents.ts', 'journalWovenToKampspar', "trigger: 'journal_woven'");
  mustInclude('functions/src/callables/agents.ts', 'breakDownResponse', "trigger: 'user_overwhelm'");
  mustInclude(
    'functions/src/index.ts',
    'journalWovenToKampspar',
    'weaveJournalEntry',
    'approveWeaverMetadata',
    'rejectWeaverMetadata',
  );
  mustInclude('functions/src/lib/weaverPending.ts', 'weaver_pending', 'approveWeaverPending');
  mustInclude('firestore.rules', 'weaver_pending');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/WeaverApprovalPanel.tsx',
    'approveWeaverMetadata',
    'VAVAREN_APPROVAL_APPROVE_BUTTON',
  );

  console.log('[smoke:orkester] Valv-zoner...');
  mustInclude(
    'docs/specs/modules/VAULT-ZONE-REGISTER.md',
    'familjen_forensic',
    'dagbok_forensic',
    'hamn_forensic',
  );
  mustInclude('docs/design/VALV-HUBB-SPEC.md', 'Samla', 'Analysera', 'Exportera');
  mustInclude('src/modules/core/triggers/valvHandoff.ts', 'shouldShowValvHandoff');
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    'vaultDrawerPath',
    'familjen_monster',
    'kunskapsbank',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/DagbokPage.tsx',
    'hasVaultGate',
    'vaultSessionOpen',
  );
  mustInclude('src/modules/core/auth/sessionService.ts', 'VAULT_SESSION_IDLE_MS', '60 * 60 * 1000');
  mustInclude('src/modules/core/auth/useZeroFootprint.ts', 'VAULT_SESSION_IDLE_MS', 'hasVaultGate');
  mustInclude(
    'functions/src/callables/agents.ts',
    'journalQuickMirror',
    'askDagbokSnabbCoach',
  );
  mustInclude('functions/src/sharedRules.ts', 'DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT');
  mustInclude('functions/src/sharedRules.ts', 'DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT');
  mustInclude('functions/src/agents/DCAP.ts', 'DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT');
  mustInclude('src/modules/features/lifeJournal/diary/diary/api/journalQuickMirrorService.ts', 'journalQuickMirror');
  mustInclude(
    'src/modules/features/family/safeHarbor/components/TryggHamnHub.tsx',
    'BiffPublicPanel',
    'vaultDrawerPath',
    'hamn_analys',
  );

  console.log('[smoke:orkester] Arbetsliv hub...');
  mustInclude(
    'src/modules/features/admin/stampla/components/StampClockPage.tsx',
    'recordTimeIn',
    'recordTimeOut',
  );
  mustInclude('src/modules/core/firebase/arbetslivFirestore.ts', 'time_entries');
  // W3: legacy shim redirects frånvaro/lön via vaultRedirectSearch; canonical Valv-länkar i supermodule.
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/components/ArbetslivHubPage.tsx',
    'vaultRedirectSearch',
    'arbetsliv_franvaro',
    'arbetsliv_lon',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivValvBroDelegate.tsx',
    'vaultDrawerPath',
    'arbetsliv_franvaro',
    'arbetsliv_lon',
  );
  mustInclude('src/modules/shell/LivLauncherPage.tsx', 'arbetsliv', '/arbetsliv');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'NAV_PATHS.VARDAGEN', 'LivLauncherPage');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'path="/arbetsliv"', 'ArbetslivHubPage');
  mustInclude('functions/src/index.ts', 'generatePayslip');
  mustInclude('firestore.rules', 'match /time_entries/{docId}');
  mustInclude('firestore.rules', 'payslip_snapshots');
  mustInclude('docs/specs/modules/VAULT-ZONE-REGISTER.md', 'arbetsliv_forensic');
  mustInclude(
    'src/modules/core/security/useVaultZoneIdle.ts',
    'VAULT_SESSION_IDLE_MS',
    'pointerdown',
  );
  mustInclude(
    'src/modules/core/layout/NavigationDrawer.tsx',
    'vaultOpen',
    'section="vardag"',
    'section="valv"',
    'DrawerModeToggle',
  );

  console.log('[smoke:orkester] Orkester UI registry...');
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx',
    'VaultOrkesterPanel',
    'OrkesterAgentTrio',
    'AgentRegistryProvider',
    'AdkAgentRegistryPanel',
    'AgentRoutingBadge',
    'analyzeBiffMessageInVault',
    'callProcessBrusfilter',
    'P1 Brusfilter',
    'Assistentroller',
  );
  mustInclude(
    'src/modules/shared/agents/api/agentRegistryService.ts',
    'fetchAgentRegistry',
    'getAgentRegistry',
  );
  mustInclude('functions/src/callables/processBrusfilter.ts', 'processBrusfilter', 'guardSensitiveCallableV2');
  mustInclude('functions/src/index.ts', 'processBrusfilter');
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvAnalyseraZone.tsx',
    "'orkester'",
    'VaultOrkesterPanel',
  );
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx', 'ValvInputSuperModule');

  console.log('[smoke:orkester] Specialist agents + conductor...');
  for (const agent of [
    'orkester-conductor.md',
    'specialist-adk-weaver.md',
    'specialist-security-auditor.md',
    'specialist-smoke-runner.md',
    'specialist-ux-guardian.md',
    'specialist-innehall-dirigent.md',
    'specialist-mabra-curator.md',
    'specialist-kunskap-seed.md',
  ]) {
    assert(existsSync(resolve(root, '.cursor/agents', agent)), `saknar .cursor/agents/${agent}`);
  }

  console.log('[smoke:orkester] Innehållskanon U6...');
  run('npm run smoke:innehall', root);

  console.log('[smoke:orkester] Capacitor Google auth (Android)...');
  mustInclude(
    'src/modules/core/auth/authService.ts',
    'isCapacitorNative',
    'capacitorGoogleSignIn',
  );
  mustInclude('src/modules/core/auth/googleAuthProvider.ts', 'isCapacitorNative()');
  mustInclude('capacitor.config.ts', 'FirebaseAuthentication', 'google.com');
  mustInclude('android/variables.gradle', 'rgcfaIncludeGoogle');
  mustInclude('package.json', '@capacitor-firebase/authentication');

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
