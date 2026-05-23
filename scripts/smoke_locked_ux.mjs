/**
 * Static smoke: Locked UX features must exist in source (no Firebase).
 * Usage: npm run smoke:locked-ux
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
  // Middagsfrågan
  mustInclude(
    'src/modules/barnens_livsloggar/components/MiddagsfraganPanel.tsx',
    'Middagsfrågan',
    'Minneslista',
    'Spara till',
    's logg',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/components/BarnensPage.tsx',
    'MiddagsfraganPanel',
    'handleSaveMiddag',
    "category: 'middag'",
  );
  mustInclude(
    'src/modules/barnens_livsloggar/constants.ts',
    'MIDDAGS_QUESTIONS',
    'middagsQuestionForToday',
    "value: 'middag'",
  );

  // Valv Mönster + Orkester
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultPage.tsx',
    "'monster'",
    "'orkester'",
    'label: \'Mönster\'',
    'label: \'Orkester\'',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultMonsterPanel.tsx',
    'Frekvensanalys',
    'buildVaultFrequencyReport',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultOrkesterPanel.tsx',
    'AI-Orkestern',
    'Kör mönstersökning',
    'analyzeBiffMessage',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/utils/vaultPatternScan.ts',
    'buildVaultFrequencyReport',
  );

  // Planeringssidan (design lock)
  mustInclude(
    'docs/design/PLANERINGSSIDA-SPEC.md',
    '/planering',
    'planning_email_rules',
    'P1',
    'P4',
  );

  // Fyren widget + tyst inspelning (design lock)
  mustInclude(
    'docs/design/WIDGET-BAR-SPEC.md',
    'FyrenWidgetBar',
    'Tyst inspelning',
    'reality_vault',
    'W1',
  );

  // Barnporten (design lock)
  mustInclude(
    'docs/design/BARNPORTEN-SPEC.md',
    'Barnporten',
    'barnportenAgents',
    'promoteChildLogToVault',
    'children_logs',
    'BARNPORTEN_AGENTS',
  );
  mustInclude(
    'src/modules/barnporten/constants/barnportenAgents.ts',
    'Trygg-Kompisen',
    'agent_trygg_kompisen',
  );
  mustInclude(
    '.context/locked-ux-features.md',
    'Barnporten',
    'Planeringssidan',
    'Fyren Edge',
  );

  const mockDir = resolve(root, 'docs/design/barnporten/mockups');
  assert(existsSync(mockDir), 'saknar mapp: docs/design/barnporten/mockups');

  console.log(
    '[smoke:locked-ux] PASS — Middagsfrågan, Valv Mönster/Orkester, Planering, Widget, Barnporten.',
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:locked-ux] FAIL —', err.message || err);
  process.exit(1);
}
