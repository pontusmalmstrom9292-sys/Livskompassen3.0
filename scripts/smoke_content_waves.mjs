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

  console.log('[smoke:content-waves] Våg 9 — vit_hub / vit_entries...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Vit hub P1', 'C-se-01..10', '**done**');
  mustInclude('firestore.rules', 'match /vit_hub/{uid}', 'match /vit_entries/{docId}', 'allow update, delete: if false');
  mustInclude(
    'src/modules/core/firebase/vitHubFirestore.ts',
    'ensureVitHub',
    'saveVitEntry',
    'listVitEntries',
    'assertWormPayload',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitCardFlowPanel.tsx',
    'saveVitEntry',
    'kind: \'card\'',
    'bankId: pick.card.bankId',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/content/selfEsteemCards.ts', 'C-se-01', 'C-se-10');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/pickVitProjectCard.ts',
    'emotional_memory',
    'C-feel-01',
    'who_am_i',
    'C-identity-01',
  );

  const selfEsteem = read('src/modules/features/dailyLife/wellbeing/mabra/content/selfEsteemCards.ts');
  for (let i = 1; i <= 10; i += 1) {
    const id = `C-se-${String(i).padStart(2, '0')}`;
    assert(bank.includes(id), `Mabra-CONTENT-BANK.md saknar ${id}`);
    assert(selfEsteem.includes(id), `selfEsteemCards.ts saknar ${id}`);
  }

  console.log('[smoke:content-waves] Våg 10 — Valv Mitt Vit P2...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Valv Mitt Vit P2', 'mitt_vit', '**done**');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/utils/vaultTabs.ts', 'mitt_vit', "'vit'");
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultVitHubPanel.tsx',
    'VaultVitHubPanel',
    'computeVitHubStats',
    'VIT_HUB_KRAVLOST',
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', 'valv_vit', "vaultDrawerPath('mitt_vit')");

  console.log('[smoke:content-waves] Våg 11 — Vit chat P3...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Vit chat P3', 'vit_chat', '**done**');
  mustInclude('functions/src/callables/agents.ts', "mode === 'vit_chat'", 'askVitChatCoach');
  mustInclude('functions/src/sharedRules.ts', 'VIT_CHAT_COACH_SYSTEM_PROMPT');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitChatFlowPanel.tsx',
    'fetchVitChatCoach',
    "kind: 'chat_turn'",
    'MabraSpeglarGuardHint',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/VitHubPreview.tsx', 'VitChatFlowPanel');

  console.log('[smoke:content-waves] Våg 12 — Export + minnes-UI...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Export + minnes-UI', '**done**');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/exportVitHubReport.ts',
    'printVitHubReport',
    'buildVitHubExportReport',
    'VIT_HUB_EXPORT_DISCLAIMER',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitMemoryFlowPanel.tsx',
    "kind: 'memory'",
    'Vem är jag',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultVitHubPanel.tsx',
    'printVitHubReport',
    'Minneslista',
    'Skriv ut / PDF',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/VitHubPreview.tsx', 'VitMemoryFlowPanel');

  console.log('[smoke:content-waves] Våg 13 — Minnes-filter Valv...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Minnes-filter Valv', 'vitKind', '**done**');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/filterVitEntries.ts',
    'filterVitEntries',
    'parseVitKindFilter',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VitEntryFilterBar.tsx',
    'VitEntryFilterBar',
    'Rensa filter',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultVitHubPanel.tsx',
    'vitKind',
    'VitEntryFilterBar',
  );

  console.log('[smoke:content-waves] Våg 14 — Vit-hub copy polish...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Vit-hub copy polish', '**done**');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/vitHubCopy.ts',
    'VIT_HUB_KRAVLOST',
    'ingen streak',
    'VIT_HUB_LANDED',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/vitHubLinks.ts',
    'vitHubFilteredLink',
    'VIT_VAULT_TAB',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitCardFlowPanel.tsx',
    'VIT_HUB_LANDED',
    'vitHubFilteredLink',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/VitHubPreview.tsx',
    'VIT_HUB_KRAVLOST',
    'VIT_HUB_VAULT_LINK',
  );

  console.log('[smoke:content-waves] Våg 15 — Vit översikt P4...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Vit översikt P4', '**done**');
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VitRecentOverview.tsx',
    'VitRecentOverview',
    'Senaste',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultVitHubPanel.tsx',
    'VitRecentOverview',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/MabraProjectHub.tsx',
    'VAULT_VIT_TAB_LINK',
    'VIT_HUB_VAULT_LINK',
  );

  console.log('[smoke:content-waves] Våg 16 — Vit spec + utveckling P5...');
  mustInclude('docs/content/CONTENT-WAVES.md', 'Vit spec + utveckling P5', '**done**');
  mustInclude('docs/design/MABRA-PROJEKT-VIT-HUB-SPEC.md', '**done** våg 9', 'ingen streak');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/vitHubStats.ts',
    'computeVitWeeklyActivity',
    'weeklyActivity',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VitDevelopmentPanel.tsx',
    'VitDevelopmentPanel',
    'VIT_HUB_DEVELOPMENT_HINT',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VitMabraPassPanel.tsx',
    'VitMabraPassPanel',
    'VIT_HUB_MOOD_HINT',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultVitHubPanel.tsx',
    'VitDevelopmentPanel',
    'VitMabraPassPanel',
  );

  console.log('[smoke:content-waves] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:content-waves] FAIL:', err.message ?? err);
  process.exit(1);
}
