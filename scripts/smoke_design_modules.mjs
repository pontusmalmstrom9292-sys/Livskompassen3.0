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
  mustInclude('src/modules/safe_harbor/components/SafeHarborPage.tsx', 'TryggHamnHub');
  mustInclude('src/modules/safe_harbor/components/BiffPublicPanel.tsx', 'BiffTriagePanel');
  mustInclude('src/modules/safe_harbor/components/TryggHamnHub.tsx', 'BiffPublicPanel');
  mustInclude('src/modules/core/home/HomeHeroCompass.tsx', 'HomeHeroKanon');
  mustInclude('src/modules/diary/mirror/components/SpeglingsSystem.tsx', 'VivirQuickEntry', 'SvartPaVittForm');
  mustInclude(
    'src/modules/family/children/components/familjen/FamiljenReflektionTab.tsx',
    'ChildProfileCards',
    'PositivaMinnesankare',
    'BarnfokusFraganPanel',
  );
  mustInclude('src/modules/family/children/components/FamiljenPage.tsx', 'ParentReminderFooter');
  mustInclude('src/modules/family/children/components/BarnensPage.tsx', 'ChildProfileCards', 'ParentReminderFooter');
  mustInclude('src/modules/evidence/vault/components/VaultPage.tsx', "label: 'Arkiv'", "label: 'Triage'", 'PansaretHeader');
  mustInclude('src/modules/evidence/vault/components/VaultOrkesterPanel.tsx', 'OrkesterAgentTrio', 'Registrerade dokument');
  mustInclude('src/modules/evidence/vault/components/VaultLogList.tsx', 'SERVER-TIDSSTÄMPEL', 'scanTechniquesForLog');
  mustInclude('src/modules/wellbeing/mabra/components/VitHubPreview.tsx', 'KbtTransformatorPanel');
  mustInclude('functions/src/index.ts', "mode === 'transformator'");
  mustInclude('functions/src/sharedRules.ts', 'KBT_TRANSFORMATOR_SYSTEM_PROMPT');
  mustInclude('.context/design-modules-mockup.md', 'D29', 'D3');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'path="/planering"', 'PlaneringPage');
  mustInclude('src/modules/admin/planning/components/PlaneringPage.tsx', 'PlanningKanbanBoard', 'PLANERING_TAGLINE');
  mustInclude('firestore.rules', 'planning_tasks');

  console.log('smoke:design-modules PASS');
}

main();
