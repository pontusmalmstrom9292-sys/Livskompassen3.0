#!/usr/bin/env node
/**
 * Smoke: våg 29 epistemik — [citat]/[tolkning] i children_logs-sparande.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function read(rel) {
  return readFileSync(resolve(root, rel), 'utf8');
}

function assert(cond, msg) {
  if (!cond) errors.push(msg);
}

const util = read('src/modules/features/family/children/utils/childObservationEpistemics.ts');
assert(util.includes('formatChildObservation'), 'saknar formatChildObservation');
assert(util.includes('formatBarnfokusObservation'), 'saknar formatBarnfokusObservation');
assert(util.includes('stripEpistemicPrefixes'), 'saknar stripEpistemicPrefixes');

const firestore = read('src/modules/core/firebase/firestore.ts');
assert(firestore.includes('childObservationEpistemics'), 'saveChildrenLog saknar epistemik-import');
assert(firestore.includes('epistemicKind'), 'saveChildrenLog saknar epistemicKind');

const barnfokus = read(
  'src/modules/features/family/children/supermodule/delegates/FamiljenBarnfokusDelegate.tsx',
);
assert(barnfokus.includes('epistemicKind'), 'BarnfokusDelegate saknar epistemik-väljare');

const livslogg = read(
  'src/modules/features/family/children/supermodule/delegates/FamiljenLivsloggObservationDelegate.tsx',
);
assert(livslogg.includes('epistemicKind'), 'LivsloggDelegate saknar epistemik-väljare');

const barnporten = read('src/modules/features/onboarding/barnporten/components/BarnportenBracketPanel.tsx');
assert(barnporten.includes('toddler_preschool'), 'BarnportenBracketPanel saknar toddler-läge');

const grounding = read('src/modules/features/dailyLife/wellbeing/mabra/views/MabraExerciseView.tsx');
assert(grounding.includes('MB_PLAY_54321_BANK_ID'), 'grounding saknar MB-PLAY-54321 wire');

const constants = read('src/modules/features/family/children/constants.ts');
assert(constants.includes('barnfokusQuestionsForBracket'), 'constants saknar bracket-pool');
assert(constants.includes("kanslor: 'Känslor'"), 'saknar kanslor-label (våg 29.3)');

const catalog = read('src/modules/features/family/children/content/barnfokusCatalog.ts');
for (const id of ['BP-PLAY-25', 'BP-PLAY-26', 'BP-PLAY-27', 'BP-PLAY-28', 'BP-PLAY-29']) {
  assert(catalog.includes(`bankId: '${id}'`), `barnfokusCatalog saknar ${id}`);
}
assert(catalog.includes('BARNFOKUS_BRACKET_BANK_IDS'), 'saknar bracket bank-id export');

const rollout = read('src/modules/features/onboarding/barnporten/constants/barnportenRollout.ts');
assert(rollout.includes('BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED'), 'saknar rollout-flagga');
assert(
  rollout.includes('BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = true'),
  'barn-PWA rollout ska vara ON (YOLO W2)',
);

const serverEpistemik = read('functions/src/lib/childObservationEpistemics.ts');
assert(serverEpistemik.includes('formatChildObservation'), 'server saknar formatChildObservation');
assert(serverEpistemik.includes('isParentVisibleChildLog'), 'server saknar isParentVisibleChildLog');

const rag = read('functions/src/lib/childrenLogsQueryRag.ts');
assert(rag.includes('isParentVisibleChildLog'), 'RAG saknar private_child-filter');

const entityStore = read('functions/src/lib/entityProfileStore.ts');
assert(entityStore.includes('loadBarnenEntityBundle'), 'saknar loadBarnenEntityBundle');

const inboxPersist = read('functions/src/lib/inboxPersist.ts');
assert(inboxPersist.includes('allowBarnenAutoPersist'), 'inbox saknar barnen HITL-gate');
assert(inboxPersist.includes('formatChildObservation'), 'inbox ingest saknar epistemik');

if (errors.length) {
  console.error('[smoke:barn-epistemik] FAIL');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}

console.log('[smoke:barn-epistemik] PASS — våg 29 epistemik + 29.3 bracket catalog + 28.1 grounding');
