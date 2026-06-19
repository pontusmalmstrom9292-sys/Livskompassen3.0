/**
 * Smoke: Adaptation L3a — deterministisk coach-ton (pure, no Firebase).
 * Usage: npm run smoke:adaptation-l3a
 */
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

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

const require = createRequire(resolve(root, 'functions/package.json'));

function main() {
  mustInclude('functions/src/lib/adaptationCoachTone.ts', 'resolveCoachToneForUser');
  mustInclude('functions/src/lib/mabraContentBank.ts', 'coachTone: CoachTone');
  mustInclude('functions/src/lib/mabraCapacityParafras.ts', 'coachTone: CoachTone');
  mustInclude('functions/src/callables/agents.ts', 'resolveCoachToneForUser');
  mustInclude('src/modules/core/auth/authService.ts', 'resetAdaptationSignalThrottle');
  mustInclude('src/modules/core/auth/authService.ts', 'useAdaptationStore.getState().reset()');

  const bankPath = resolve(root, 'functions/lib/functions/src/lib/mabraContentBank.js');
  assert(existsSync(bankPath), `kör functions build först — saknar ${bankPath}`);

  const { parafraseCoachFromBank, getMabraCoachBankEntry } = require(
    './lib/functions/src/lib/mabraContentBank.js',
  );

  const entry = getMabraCoachBankEntry('MB-REF-01');
  assert(entry, 'MB-REF-01 saknas i bank');

  const minimal = parafraseCoachFromBank(entry, 'find_self', 'breathing', 'minimal');
  const standard = parafraseCoachFromBank(entry, 'find_self', 'breathing', 'standard');
  const detailed = parafraseCoachFromBank(entry, 'find_self', 'breathing', 'detailed');

  assert(minimal.length < standard.length, 'minimal ska vara kortare än standard');
  assert(detailed.length >= standard.length, 'detailed ska vara minst lika lång som standard');
  assert(!minimal.includes('Perspektiv:'), 'minimal ska inte inkludera lens-rad');
  assert(detailed.includes('Perspektiv: act'), 'detailed ska inkludera bank lens');

  console.log('[smoke:adaptation-l3a] PASS — coach-ton deterministisk parafras.');
}

main();
