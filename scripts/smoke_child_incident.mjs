/**
 * Smoke: Barnhub Fas A — child incident heuristik (offline).
 * Usage: node scripts/smoke_child_incident.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function mustExist(rel) {
  const p = join(ROOT, rel);
  assert.ok(existsSync(p), `saknar ${rel}`);
  return p;
}

function mustInclude(rel, ...needles) {
  const text = readFileSync(mustExist(rel), 'utf8');
  for (const n of needles) {
    assert.ok(text.includes(n), `${rel} saknar «${n}»`);
  }
}

console.log('[smoke:child-incident] filer…');
mustExist('shared/patterns/barnIncidentPatternLibrary.ts');
mustExist('src/modules/features/family/children/supermodule/delegates/FamiljenIncidentDelegate.tsx');
mustExist('src/modules/features/family/children/lib/analyzeChildIncidentLocal.ts');
mustExist('functions/src/callables/analyzeChildIncident.ts');
mustInclude('functions/src/index.ts', 'analyzeChildIncident');
mustInclude(
  'src/modules/features/family/children/supermodule/familjenInputModes.ts',
  "id: 'incident'",
  'Vad hände',
);
mustInclude(
  'src/modules/features/family/children/supermodule/FamiljenInputSuperModule.tsx',
  'FamiljenIncidentDelegate',
);
mustInclude(
  'shared/patterns/barnIncidentPatternLibrary.ts',
  'bh-tri-001',
  'parental_alienation_pattern',
  'Observerat kommunikationsmönster',
);
mustInclude(
  'src/modules/features/family/children/hooks/useFamiljenShell.ts',
  'handleSaveIncident',
  "category: 'incident'",
);
mustExist('src/modules/features/family/children/lib/incidentCardRotation.ts');
mustExist('src/modules/features/family/children/lib/incidentThemeFromLogs.ts');
mustExist('src/modules/features/family/children/components/ChildIncidentPulse.tsx');
mustInclude(
  'src/modules/features/family/children/content/incidentSupportBank.ts',
  'pickIncidentCard',
  'bh-r4-sig-04',
  'bh-r4-hopp-01',
);
mustInclude(
  'src/modules/features/family/children/components/familjen/FamiljenReflektionTab.tsx',
  'ChildIncidentPulse',
);
mustInclude(
  'src/modules/features/family/children/supermodule/delegates/FamiljenIncidentDelegate.tsx',
  'markCardOpened',
  'markCardSkipped',
  'themePatternIds',
);
mustExist('src/modules/features/family/children/lib/parentMilestones.ts');
mustExist('src/modules/features/family/children/utils/exportCuratorChildReport.ts');
mustExist('src/modules/features/family/children/components/ParentMerPanel.tsx');
mustInclude(
  'src/modules/features/family/children/components/familjen/FamiljenReflektionTab.tsx',
  'ParentMerPanel',
);
mustInclude(
  'src/modules/features/family/children/utils/exportCuratorChildReport.ts',
  'livskompassen_curator_child_report_v1',
  'Barn 1',
  'anonymizeAliases',
);
mustInclude(
  'src/modules/core/routing/AppRoutes.tsx',
  'path="/barnhub"',
  'path="/barnhubben"',
);

console.log('[smoke:child-incident] Kasper-exempel (inline heuristik)…');
const sample = 'Kasper sa att mamma sagt att pappa inte vill träffa honom.';
const tri = /(mamma|pappa|henne|honom).{0,40}(sa|sagt|säger|berättat).{0,40}(att|om)/i;
const tri2 = /sa att (mamma|pappa).{0,30}(sagt|sa)/i;
const gate = /(inte vill träffa|vill inte träffa|du bryr dig inte|vill inte komma)/i;
assert.ok(tri.test(sample) || tri2.test(sample), 'triangulering-regex missar Kasper-exempel');
assert.ok(gate.test(sample), 'contact_fear_relay-regex missar Kasper-exempel');
const lib = readFileSync(join(ROOT, 'shared/patterns/barnIncidentPatternLibrary.ts'), 'utf8');
assert.ok(lib.includes("Observerat kommunikationsmönster (beteende)"));
assert.ok(!/diagnosetikett/.test(lib.split('BARN_INCIDENT_TAG_LABELS')[1]?.slice(0, 800) || ''));

console.log('\n[smoke:child-incident] PASS');
