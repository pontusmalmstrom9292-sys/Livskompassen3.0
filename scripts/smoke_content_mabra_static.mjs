/**
 * Static MåBra content parity — curriculum bankIds ↔ kod.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function assert(c, m) {
  if (!c) throw new Error(m);
}

function read(rel) {
  const p = resolve(root, rel);
  assert(existsSync(p), `saknar ${rel}`);
  return readFileSync(p, 'utf8');
}

function main() {
  const reflection = read('src/modules/features/dailyLife/wellbeing/mabra/content/mabraReflectionCards.ts');
  const plays = read('src/modules/features/dailyLife/wellbeing/mabra/content/mabraExtendedPlays.ts');
  for (const id of [
    'MB-REF-ADHD-01',
    'MB-REF-ADHD-02',
    'MB-REF-ADHD-05',
    'MB-REF-ADHD-06',
    'MB-REF-ADHD-07',
    'MB-REF-GAD-01',
    'MB-REF-GAD-02',
    'MB-REF-GAD-07',
    'MB-REF-GAD-08',
    'MB-REF-REST-01',
    'MB-REF-REST-02',
    'MB-REF-REST-03',
    'MB-REF-ACT-01',
  ]) {
    assert(reflection.includes(id), `mabraReflectionCards saknar ${id}`);
  }
  const bank = read('functions/src/lib/mabraContentBank.ts');
  for (const id of ['MB-REF-REST-01', 'MB-REF-REST-02', 'MB-REF-REST-03']) {
    assert(bank.includes(id), `mabraContentBank saknar ${id}`);
  }
  for (const id of [
    'MB-PLAY-05',
    'MB-PLAY-06',
    'MB-PLAY-GAD-01',
    'MB-PLAY-GAD-02',
    'MB-PLAY-GAD-03',
    'MB-PLAY-GAD-04',
    'MB-PLAY-08',
  ]) {
    assert(plays.includes(id), `mabraExtendedPlays saknar ${id}`);
  }
  assert(!reflection.includes('knowledgeVaultQuery'), 'MåBra får inte RAG');
  assert(!plays.includes('streakCount'), 'ingen gamification');
  console.log('[smoke:content-mabra-static] PASS');
}

try {
  main();
} catch (e) {
  console.error('[smoke:content-mabra-static] FAIL:', e.message);
  process.exit(1);
}
