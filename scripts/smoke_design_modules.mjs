/**
 * Static smoke: P1 design modules wired (D3, D12–D14, D16–D20, D22–D23, D29).
 * Usage: npm run smoke:design-modules
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, rel, message) {
  if (!condition) throw new Error(`${rel}: ${message}`);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), relPath, 'saknar fil');
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), relPath, `saknar: ${needle}`);
  }
}

function main() {
  mustInclude('src/modules/core/home/HomeActionHub.tsx', 'KompassradPanel');
  mustInclude('src/modules/safe_harbor/components/SafeHarborPage.tsx', 'BiffTriagePanel', 'Kör BIFF Triage');
  mustInclude(
    'src/modules/barnens_livsloggar/components/familjen/FamiljenReflektionTab.tsx',
    'ChildProfileCards',
    'PositivaMinnesankare',
    'ParentReminderFooter',
  );
  mustInclude('src/modules/barnens_livsloggar/components/BarnensPage.tsx', 'ChildProfileCards', 'ParentReminderFooter');
  mustInclude('src/modules/verklighetsvalvet/components/VaultPage.tsx', "label: 'Arkiv'", "label: 'Triage'", 'PansaretHeader');
  mustInclude('src/modules/verklighetsvalvet/components/VaultOrkesterPanel.tsx', 'OrkesterAgentTrio', 'Registrerade dokument');
  mustInclude('src/modules/verklighetsvalvet/components/VaultLogList.tsx', 'SERVER-TIDSSTÄMPEL', 'scanTechniquesForLog');
  mustInclude('src/modules/mabra/components/VitHubPreview.tsx', 'KbtTransformatorPanel');
  mustInclude('functions/src/index.ts', "mode === 'transformator'");
  mustInclude('functions/src/sharedRules.ts', 'KBT_TRANSFORMATOR_SYSTEM_PROMPT');
  mustInclude('.context/design-modules-mockup.md', 'D29', 'D3');

  console.log('smoke:design-modules PASS');
}

main();
