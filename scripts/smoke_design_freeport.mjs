/**
 * Static smoke: Design Freeport sandbox must exist.
 * Usage: npm run smoke:design-freeport
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
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
  mustInclude(
    'src/styles/design-freeport.css',
    '.design-freeport',
    'data-fp-theme',
    'tactile-warm',
    'tactile-chrome',
    'tactile-cold',
    'tactile-slate',
    'tactile-obsidian',
    '--fp-accent',
    '--fp-elevation-2',
    '--fp-inset-top',
    '--fp-pad-card',
    '--fp-gap-stack',
    'design-freeport__hub-archetype',
    'design-freeport__ephemeral-ribbon',
    'design-freeport--standalone',
    'design-freeport__delegate-viewport',
    'design-freeport__phone',
  );
  mustInclude(
    'src/modules/sandbox/DesignFreeportPage.tsx',
    'DesignFreeportPage',
    'FreeportHemV3Lab',
    'FreeportChameleonLive',
    'FreeportSuperhubPlayground',
    'FreeportPlaneringHub',
    'FreeportHjartatHub',
    'FreeportMabraHub',
    'FreeportFamiljenHub',
    'FreeportChromeShell',
    'loadFreeportTheme',
  );
  mustInclude('src/modules/sandbox/freeportThemes.ts', 'tactile-slate', 'tactile-obsidian', 'Skiffer sammet');
  mustInclude(
    'src/modules/sandbox/components/FreeportChameleonLive.tsx',
    'DagbokReflektionDelegate',
    'PlaneringTaskQuickDelegate',
    'FamiljenBarnfokusDelegate',
    'design-freeport__delegate-viewport',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportHemV3Lab.tsx',
    'HEM_V3_SUPERMODS',
    'FreeportChameleonLive',
    'Modell A',
  );
  mustInclude(
    'src/modules/sandbox/freeportZones.ts',
    'FREEPORT_ZONES',
    'hjartat',
    'reflektion',
    'barnfokus',
  );
  mustInclude(
    'src/modules/sandbox/freeportChameleonBridge.ts',
    'resolveCardToChameleon',
    'getDefaultTarget',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportSuperhubPlayground.tsx',
    'DagbokInputSuperModule',
    'PlaneringInputSuperModule',
    'MabraInputSuperModule',
    'FamiljenInputSuperModule',
  );
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'path="/dev/design-freeport"',
    'DesignFreeportPage',
    '/dev/obsidian-depth-v2',
    'ObsidianDepthV2LabPage',
  );
  mustInclude('src/index.css', 'design-freeport.css');
  mustInclude(
    'docs/prompts/DESIGN-FREEPORT-RESEARCH-PACK.md',
    'DESIGN FREEPORT',
    'prompt-1-sonnet.md',
  );
  mustInclude('docs/design/CHAMELEON-SUPERMODULE-SPEC.md', 'Chameleon Supermodule');
  mustInclude(
    'docs/evaluations/research-raw/verify-gpt-modes.md',
    'VERIFIED',
    'FP-014',
  );
  mustInclude(
    'docs/evaluations/2026-06-18-flow-verktyg-beslut.md',
    'Bygg inte Google Flow-verktyg i bulk',
    'Design Freeport',
  );
  mustInclude(
    'src/modules/sandbox/hjartatHubLayouts.ts',
    'HJARTAT_HUB_LAYOUTS',
    'lugn-triad',
  );
  mustInclude(
    'src/modules/sandbox/mabraHubLayouts.ts',
    'MABRA_HUB_LAYOUTS',
    'paralys-panel',
  );
  mustInclude(
    'src/modules/sandbox/familjenHubLayouts.ts',
    'FAMILIEN_HUB_LAYOUTS',
    'barnfokus-fokus',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportHjartatHub.tsx',
    'FreeportHjartatHub',
    'hem-inkast',
    'ephemeral-ribbon',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportMabraHub.tsx',
    'FreeportMabraHub',
    'capacityBand',
    'microSteps',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportFamiljenHub.tsx',
    'FreeportFamiljenHub',
    'Fler funktioner',
  );
  mustInclude('docs/evaluations/2026-06-18-freeport-vag-c-gate.md', 'Gate-checklista');
  mustInclude('docs/evaluations/2026-06-18-pmir-b-p4-capacity-coach.md', 'mabraCapacityParafras');

  const page = read('src/modules/sandbox/DesignFreeportPage.tsx');
  for (const tab of ['hjartat', 'mabra', 'familjen']) {
    assert(page.includes(tab), `DesignFreeportPage saknar flik: ${tab}`);
  }

  const routes = read('src/modules/core/routing/AppRoutes.tsx');
  const mainLayoutBlock = routes.split('<MainLayout>')[1] ?? '';
  assert(
    !mainLayoutBlock.includes('path="/dev/design-freeport"'),
    'design-freeport ska ligga utanför MainLayout',
  );

  console.log('[smoke:design-freeport] PASS — Våg C hubs + gate + chameleon.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:design-freeport] FAIL —', err.message || err);
  process.exit(1);
}
