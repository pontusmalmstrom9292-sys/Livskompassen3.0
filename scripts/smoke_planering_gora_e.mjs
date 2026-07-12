/**
 * Static smoke: §E Göra — Handling kanban + Fokus/Framsteg/Regler utan dubbel TabBar.
 * Usage: npm run smoke:planering-gora-e
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

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

function main() {
  console.log('[smoke:planering-gora-e] §E Göra — Handling + Fokus/Framsteg/Regler…');

  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'path="/planering"',
    'PlaneringPage',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringPage.tsx',
    'GoraHubTabBar',
    'PlaneringMoreTabsBar',
    'GoraSuperModule',
    'PlanningKanbanBoard',
    'VerktygDrawer',
    'PlaneringNextStepSelect',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringMoreTabsBar.tsx',
    'PLANERING_MORE_TABS',
    'Fokus',
    'Framsteg',
    'Regler',
    '/planering?tab=',
  );

  mustInclude(
    'src/modules/features/admin/planning/constants.ts',
    'PLANERING_MORE_TABS',
    "id: 'fokus'",
    "id: 'framsteg'",
    "id: 'regler'",
    'Handling/Inkorg styrs av GoraHubTabBar',
  );

  const goraTabBar = read('src/modules/core/navigation/GoraHubTabBar.tsx');
  assert(goraTabBar.includes("'handling'"), 'GoraHubTabBar saknar handling');
  assert(goraTabBar.includes("'inkorg'"), 'GoraHubTabBar saknar inkorg');
  assert(goraTabBar.includes("'projekt'"), 'GoraHubTabBar saknar projekt');
  assert(
    goraTabBar.includes("params.set('tab', id === 'inkorg' ? 'inkorg' : 'handling')"),
    'GoraHubTabBar måste rensa query vid flikbyte (Android Inkorg)',
  );
  assert(
    goraTabBar.includes('/planering?tab=inkorg'),
    'GoraHubTabBar måste navigera till /planering?tab=inkorg',
  );
  assert(!goraTabBar.includes("'fokus'"), 'GoraHubTabBar får inte ha fokus-flik (dubbel nav)');

  mustInclude(
    'src/modules/features/admin/planning/planeringHubConfig.ts',
    "return 'handling'",
    'fokus',
    'framsteg',
    'regler',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/GoraSuperModule.tsx',
    'PlanningKanbanBoard',
    'PlaneringFokusPanel',
    'PlaneringFramstegPanel',
  );

  console.log('[smoke:planering-gora-e] Fas 23D Paralys-Brytaren…');
  mustInclude(
    'src/modules/features/admin/planning/components/PlanningKanbanBoard.tsx',
    'PlaneringParalysEntry',
    'setMicroStep',
  );
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringParalysEntry.tsx',
    'fetchMicroSteps',
    'PLANERING_PARALYS_ONE_STEP',
    'Lägg i Att göra',
  );
  mustInclude(
    'src/modules/features/admin/planning/components/ParalysBreakerWidget.tsx',
    'fetchMicroSteps',
    'PLANERING_PARALYS_ONE_STEP',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/api/compassService.ts',
    'breakDownResponse',
  );
  mustInclude('functions/src/callables/agents.ts', "trigger: 'user_overwhelm'");

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringFokusPanel.tsx',
    'ParalysPanel',
    'Redigera i Handling',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringFramstegPanel.tsx',
    'countPlanningStats',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringEmailRulesPanel.tsx',
    'planning_email_rules',
    'to="/projekt/regler"',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringNextStepSelect.tsx',
    '/planering?tab=fokus',
    '/planering?tab=framsteg',
    '/planering?tab=regler',
  );

  mustNotInclude(
    'src/modules/features/admin/planning/components/VerktygDrawer.tsx',
    'PLANERING_MORE_TABS',
  );

  mustInclude('scripts/smoke_locked_ux.mjs', 'PLANERING_MORE_TABS', 'GoraHubTabBar');

  mustInclude(
    'src/modules/features/admin/planning/utils/exportPlaneringIcs.ts',
    'buildPlaneringIcs',
    'downloadPlaneringIcs',
    'BEGIN:VCALENDAR',
  );
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringWeekCalendar.tsx',
    'downloadPlaneringIcs',
    'Exportera ICS',
  );

  console.log('[smoke:planering-gora-e] PASS — kanban P3 + Fokus/Framsteg/Regler + ICS export, en TabBar.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:planering-gora-e] FAIL:', err.message);
  process.exit(1);
}
