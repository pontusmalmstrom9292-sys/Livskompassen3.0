/**
 * Smoke: ingest våg 2b — widget → classifyInboxDocument → routeInboxToWorm
 * Usage: npm run smoke:widget-ingest
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
  assert(agents.includes('ingestWidgetRecording'), 'agents.ts saknar ingestWidgetRecording');
  assert(agents.includes('classifyInboxDocument'), 'ingestWidgetRecording saknar classifyInboxDocument');
  assert(agents.includes('buildInboxClassifyBlob'), 'ingestWidgetRecording saknar buildInboxClassifyBlob');
  assert(agents.includes('routeInboxToWorm'), 'ingestWidgetRecording saknar routeInboxToWorm');
  assert(agents.includes('blockWidgetKunskapRouting'), 'ingestWidgetRecording saknar kunskap-block');

  const widgetApi = readCanonical('src/modules/features/widgets/api/widgetVaultRecording.ts');
  assert(!widgetApi.includes('saveVaultLog'), 'widgetVaultRecording ska inte anropa saveVaultLog direkt');
  assert(widgetApi.includes('withVaultSessionPayload'), 'widgetVaultRecording saknar vaultSessionToken');
  assert(widgetApi.includes('commit: true'), 'widgetVaultRecording saknar commit-läge');

  const classifier = readCanonical('functions/src/lib/inboxClassifier.ts');
  assert(classifier.includes('widget_recording'), 'inboxClassifier saknar widget_recording-heuristik');

  const inboxPersist = readCanonical('functions/src/lib/inboxPersist.ts');
  assert(inboxPersist.includes('sourceRef?:'), 'routeInboxToWorm saknar generisk sourceRef');

  const hcfIdx = classifier.indexOf('covertHcfSignal');
  const kunskapIdx = classifier.indexOf("routing: 'kunskap'");
  assert(hcfIdx > 0 && kunskapIdx > 0 && hcfIdx < kunskapIdx, 'HCF-heuristik måste komma före kunskap-keywords');
}

function smokeFunctionsBuild() {
  execSync('npm run build', { cwd: resolve(root, 'functions'), stdio: 'pipe' });
}

console.log('[smoke:widget-ingest] static wiring…');
smokeStatic();
console.log('[smoke:widget-ingest] functions build…');
smokeFunctionsBuild();
console.log('[smoke:widget-ingest] PASS');
