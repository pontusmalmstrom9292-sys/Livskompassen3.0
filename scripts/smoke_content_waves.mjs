/**
 * Smoke: Content Autorun — vågregister, curriculum catalog, bank parity.
 * Usage: npm run smoke:content-waves
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

function main() {
  console.log('[smoke:content-waves] Register + vågar...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'CUR-ADHD-01', 'CUR-GAD-01', 'Aktiv våg');
  mustInclude('docs/content/CURRICULUM-MALL.md', 'kunskap_fact_id', 'mabra_bank_ids');

  console.log('[smoke:content-waves] Curriculum catalog...');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/content/curriculumCatalog.ts',
    'CURRICULUMS',
    'CUR-ADHD-01',
    'CUR-GAD-01',
    'CUR-TAKTIK-01',
    'CUR-SOBRIETY-01',
  );

  console.log('[smoke:content-waves] VitCurriculumPanel...');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitCurriculumPanel.tsx',
    'VitCurriculumPanel',
    'CURRICULUMS',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/MabraPage.tsx', 'VitCurriculumPanel');

  console.log('[smoke:content-waves] Kunskap manifest...');
  mustInclude('docs/specs/modules/Kunskap-CONTENT-SEED.json', 'kunskap-fact-001', 'kunskap_content_seed');

  const catalog = read('src/modules/features/dailyLife/wellbeing/mabra/content/curriculumCatalog.ts');
  const bank = read('docs/specs/modules/Mabra-CONTENT-BANK.md');
  const seed = read('docs/specs/modules/Kunskap-CONTENT-SEED.md');

  const bankIds = [
    'MB-REF-ADHD-01',
    'MB-REF-GAD-01',
    'MB-PLAY-05',
    'MB-PLAY-GAD-01',
    'MB-REF-ACT-01',
    'DF-REF-11',
  ];
  for (const id of bankIds) {
    assert(bank.includes(id), `Mabra-CONTENT-BANK.md saknar ${id}`);
    assert(catalog.includes(id), `curriculumCatalog.ts refererar ${id} — saknas i catalog?`);
  }

  const factIds = ['kunskap-fact-026', 'kunskap-fact-029', 'kunskap-fact-043', 'kunskap-fact-df-001'];
  for (const id of factIds) {
    assert(seed.includes(id), `Kunskap-CONTENT-SEED.md saknar ${id}`);
  }

  console.log('[smoke:content-waves] Barn PLAY bank...');
  mustInclude('docs/specs/modules/Barnen-PLAY-BANK.md', 'BP-PLAY-01', 'KEEP');

  console.log('[smoke:content-waves] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:content-waves] FAIL:', err.message ?? err);
  process.exit(1);
}
