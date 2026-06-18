/**
 * Static smoke: Innehållskanon U6 — register, bankers, kurator-agenter, sharedRules lock.
 * Usage: npm run smoke:innehall
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
  console.log('[smoke:innehall] Register + kanon...');
  mustInclude(
    'docs/INNEHALL-REGISTER.md',
    'content_class',
    'specialist-innehall-dirigent',
    'specialist-mabra-curator',
    'specialist-kunskap-seed',
    'MUST NOT',
    'fjärde RAG-silo',
  );
  mustInclude('.context/innehall-kanon.md', 'U6', 'Utveckling (Vit)', 'Mabra-CONTENT-BANK');

  console.log('[smoke:innehall] Content banks...');
  mustInclude('docs/specs/modules/Mabra-CONTENT-BANK.md', 'INNEHALL-REGISTER', 'Kunskap-RAG');
  mustInclude('docs/specs/modules/Kunskap-CONTENT-SEED.md', 'content_class: FACT', 'ROUTE_MABRA');
  mustInclude('docs/specs/modules/Barnen-PLAY-BANK.md', 'barnfokus', 'reality_vault');
  mustInclude(
    'src/modules/features/family/children/content/barnfokusCatalog.ts',
    'BP-PLAY-06',
    'BP-PLAY-25',
    'BARNFOKUS_BRACKET_BANK_IDS',
    'BARNFOKUS_CATALOG_CHILD',
  );
  mustInclude(
    'src/modules/features/family/children/constants.ts',
    'barnfokusQuestionsForBracket',
    'kanslor',
  );

  mustInclude('docs/specs/modules/Mabra-CONTENT-BANK.md', 'DM-CARD-01', 'daglig_mix');
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog.ts', 'DM-CARD-01', 'DAGLIG_MIX_CARDS');
  mustInclude('docs/specs/modules/Mabra-CONTENT-BANK.md', 'DF-REF-01', 'drogfrihet');

  console.log('[smoke:innehall] Daglig mix — mount, bank parity, no RAG/streak...');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/views/MabraHubView.tsx',
    'DagligMixPanel',
    'MabraModulValjare'
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/MabraModulValjare.tsx',
    'ExamplePreviewCard',
    'ingen streak',
    'markMabraModulValjareSeen',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/mabraModulValjareStorage.ts',
    'lk_mabra_modulvaljare_seen_v1',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/DagligMixPanel.tsx', 'pickDagligMix', 'mix.card.bankId');
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/lib/pickDagligMix.ts', 'fnv1a', 'DAGLIG_MIX_PLAYS');
  const bankMd = read('docs/specs/modules/Mabra-CONTENT-BANK.md');
  const catalogTs = read('src/modules/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog.ts');
  const dmBankIds = [
    'DM-CARD-01',
    'DM-CARD-02',
    'DM-CARD-03',
    'DM-CARD-04',
    'DM-CARD-05',
    'DM-CARD-06',
    'DM-CARD-07',
    'DM-CARD-08',
    'DM-PLAY-01',
    'DM-PLAY-02',
    'DM-PLAY-03',
  ];
  for (const id of dmBankIds) {
    assert(catalogTs.includes(id), `dagligMixCatalog.ts saknar ${id}`);
    assert(bankMd.includes(id), `Mabra-CONTENT-BANK.md saknar ${id}`);
  }
  for (const rel of [
    'src/modules/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog.ts',
    'src/modules/features/dailyLife/wellbeing/mabra/lib/pickDagligMix.ts',
    'src/modules/features/dailyLife/wellbeing/mabra/components/DagligMixPanel.tsx',
  ]) {
    const text = read(rel);
    assert(!text.includes('knowledgeVaultQuery'), `${rel} får inte anropa Kunskap-RAG`);
    assert(!text.includes('kampspar'), `${rel} får inte läsa kampspar`);
    for (const pattern of [/streakCount/i, /currentStreak/i, /dailyStreak/i, /\bXP\b/]) {
      assert(!pattern.test(text), `${rel} får inte innehålla gamification: ${pattern}`);
    }
  }
  assert(
    catalogTs.includes('DAGLIG_MIX_BANK_IDS') && catalogTs.includes('DM-PLAY-03'),
    'dagligMixCatalog.ts saknar DAGLIG_MIX_BANK_IDS / full DM-pool',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/content/drogfrihetCatalog.ts',
    'DF-REF-01',
    'DROGFRIHET_CARDS',
  );

  console.log('[smoke:innehall] Cursor rules + grunder U6...');
  mustInclude('.cursor/rules/innehall-register.mdc', 'alwaysApply: true', 'U6');
  mustInclude('.cursor/rules/grunder-kanon.mdc', 'U6', 'INNEHALL-REGISTER');

  console.log('[smoke:innehall] Kurator agents...');
  for (const agent of [
    'specialist-innehall-dirigent.md',
    'specialist-mabra-curator.md',
    'specialist-kunskap-seed.md',
  ]) {
    assert(existsSync(resolve(root, '.cursor/agents', agent)), `saknar .cursor/agents/${agent}`);
    mustInclude(`.cursor/agents/${agent}`, 'INNEHALL-REGISTER', 'MUST NOT');
  }

  console.log('[smoke:innehall] Functions lock (mabraCoach)...');
  mustInclude(
    'functions/src/sharedRules.ts',
    'MABRA_COACHEN_SYSTEM_PROMPT',
    'Mabra-CONTENT-BANK',
    'Ingen RAG',
  );
  mustInclude('functions/src/lib/mabraCoachGuard.ts', 'shouldRedirectMabraCoachToSpeglar');
  mustInclude('functions/src/lib/mabraContentBank.ts', 'resolveCoachBankId', 'MB-REF-03', 'MB-REF-JOY-01', 'MB-REF-MIRROR-02');

  console.log('[smoke:innehall] Mabra no Kunskap RAG (spec)...');
  mustInclude(
    'docs/specs/modules/Mabra-SPEC.md',
    'knowledgeVaultQuery',
    'Ingen RAG-export',
  );

  console.log('[smoke:innehall] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:innehall] FAIL:', err.message ?? err);
  process.exit(1);
}
