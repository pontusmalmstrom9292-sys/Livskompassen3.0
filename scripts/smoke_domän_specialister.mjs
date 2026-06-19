/**
 * Static smoke: 5 domän-specialister + INNEHALL-REGISTER routing.
 * Usage: npm run smoke:domän-specialister
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const DOMAIN_AGENTS = [
  'specialist-hcf-domän.md',
  'specialist-utveckling-kurator.md',
  'specialist-aterhamtning-hälsa.md',
  'specialist-myndighet-seed.md',
  'specialist-neuro-psyk-seed.md',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function main() {
  console.log('[smoke:domän-specialister] Agent-filer...');
  for (const file of DOMAIN_AGENTS) {
    const text = read(`.cursor/agents/${file}`);
    assert(text.includes('Obligatorisk mening'), `${file} saknar obligatorisk mening`);
    assert(text.includes('MUST NOT'), `${file} saknar MUST NOT`);
  }

  console.log('[smoke:domän-specialister] ORKESTER-AUTORUN...');
  const orkester = read('docs/ORKESTER-AUTORUN.md');
  for (const name of [
    'specialist-hcf-domän',
    'specialist-utveckling-kurator',
    'specialist-aterhamtning-hälsa',
    'specialist-myndighet-seed',
    'specialist-neuro-psyk-seed',
  ]) {
    assert(orkester.includes(name), `ORKESTER-AUTORUN saknar ${name}`);
  }

  console.log('[smoke:domän-specialister] Innehåll våg 31 + REST...');
  const seed = read('docs/specs/modules/Kunskap-CONTENT-SEED.json');
  for (const id of [
    'kunskap-fact-jur-010',
    'kunskap-fact-soc-002',
    'kunskap-fact-bh-021',
    'kunskap-fact-pu-001',
    'kunskap-fact-cn-049',
  ]) {
    assert(seed.includes(id), `Kunskap-CONTENT-SEED.json saknar ${id}`);
  }
  const bank = read('functions/src/lib/mabraContentBank.ts');
  assert(bank.includes('MB-REF-REST-01'), 'mabraContentBank saknar MB-REF-REST-01');

  console.log('[smoke:domän-specialister] DARVO kunskapFactId fix...');
  const tpl = read('shared/patterns/tacticPatternLibrary.ts');
  assert(tpl.includes("kunskapFactId: 'kunskap-fact-cn-008'"), 'DARVO ska peka på cn-008');

  console.log('[smoke:domän-specialister] PASS');
}

main();
