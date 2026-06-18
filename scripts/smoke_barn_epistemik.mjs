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

const rollout = read('src/modules/features/onboarding/barnporten/constants/barnportenRollout.ts');
assert(rollout.includes('BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED'), 'saknar rollout-flagga');
assert(rollout.includes('BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = false'), 'barn-PWA ska vara pausad');

if (errors.length) {
  console.error('[smoke:barn-epistemik] FAIL');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}

console.log('[smoke:barn-epistemik] PASS — våg 29 epistemik + 28.1 grounding wire');
