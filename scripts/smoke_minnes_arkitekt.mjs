/**
 * Static smoke: Minnes-Arkitekt (KASAM + adaptation + evolution memory).
 * Usage: npm run smoke:minnes-arkitekt
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

function run(cmd, cwd = root) {
  execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' });
}

function main() {
  console.log('[smoke:minnes-arkitekt] KASAM synapse + callable…');
  mustInclude(
    'functions/src/adk/synapses/kasamAggregationSynapse.ts',
    'scoreKasamFromSnippets',
    'findRecentAggregation',
    'kasam_aggregations',
  );
  mustInclude('functions/src/callables/kasam.ts', 'triggerKasamAggregation', 'kasam_aggregation');
  mustInclude('functions/src/index.ts', 'triggerKasamAggregation');

  console.log('[smoke:minnes-arkitekt] Adaptation + evolution flags…');
  mustInclude('functions/src/lib/ensureDefaultMemoryFlags.ts', 'adaptation_layer_v1');
  mustInclude('functions/src/triggers/onEvolutionHubWrite.ts', 'ensureDefaultMemoryFlags');
  mustInclude('src/modules/core/adaptation/fireAdaptationEvent.ts', 'fireAdaptationEvent');
  mustInclude('shared/evolution/childAgeBracket.ts', 'bracketFromBirthDate');

  console.log('[smoke:minnes-arkitekt] UI wiring…');
  mustInclude('src/modules/features/family/children/components/ChildBirthDatePrompt.tsx', 'ChildBirthDatePrompt');
  mustInclude('src/modules/core/home/homeProactiveTriggers.ts', 'proactive-kasam-weak', 'isoWeekKey');
  mustInclude('src/modules/core/firebase/kasamAggregationFirestore.ts', 'getLatestKasamAggregation');
  mustInclude('firestore.rules', 'kasam_aggregations');

  console.log('[smoke:minnes-arkitekt] MOD-CORE-MINNE register…');
  const reg = JSON.parse(read('.context/module-lock-register.json'));
  const mod = reg.modules.find((m) => m.id === 'MOD-CORE-MINNE');
  assert(mod, 'MOD-CORE-MINNE saknas i module-lock-register.json');
  assert(mod.status === 'locked', 'MOD-CORE-MINNE måste vara locked');

  console.log('[smoke:minnes-arkitekt] functions build…');
  run('npm run build', resolve(root, 'functions'));

  console.log('[smoke:minnes-arkitekt] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:minnes-arkitekt] FAIL:', err.message ?? err);
  process.exit(1);
}
