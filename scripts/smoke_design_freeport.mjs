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
    'executive-premium',
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
    'FreeportFptiRefLab',
    'FreeportPremiumScreensLab',
    'FreeportSuperhubPlayground',
    'FreeportPlaneringHub',
    'FreeportHjartatHub',
    'FreeportMabraHub',
    'FreeportFamiljenHub',
    'FreeportChromeShell',
    'loadFreeportTheme',
    'Hem (Modell A)',
    'Executive Premium',
    'fpti-ref',
    'premium',
  );
  mustInclude('src/modules/sandbox/freeportThemes.ts', 'tactile-slate', 'tactile-obsidian', 'executive-premium', 'Executive Premium');
  mustInclude(
    'src/modules/sandbox/components/FreeportPremiumScreensLab.tsx',
    'FreeportPremiumScreensLab',
    'PREMIUM_SCREENS',
    'FreeportValvetLab',
    'FreeportBarnfokusLab',
    'FreeportKanbanLab',
    'FreeportInkorgLab',
    'FreeportCheckinLab',
    'FreeportMonsterLab',
    'design-freeport__premium-gallery',
  );
  mustInclude(
    'src/modules/sandbox/components/premium/CalmCard.tsx',
    'design-freeport__premium-calm-card',
  );
  mustInclude(
    'src/modules/sandbox/components/premium/PremiumCard.tsx',
    'design-freeport__premium-card',
  );
  mustInclude('e2e/freeport-premium-gallery.spec.ts', 'executive-premium', 'freeport-premium');
  mustInclude('scripts/capture_freeport_premium_gallery.mjs', 'capture:freeport-premium');
  mustInclude(
    'src/modules/sandbox/components/FreeportHemV3Lab.tsx',
    'FreeportModellAPhoneShell',
    'executiveSkin',
    'compassLinked',
    'Hem Modell A',
    'exec-compass-module',
    'FreeportHybridDock',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportModellADock.tsx',
    'FreeportModellADock',
    'LivskompassMark',
    'modell-a-dock',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportSnabbstartPanel.tsx',
    'FreeportSnabbstartPanel',
    'snabb-grid',
  );
  mustInclude(
    'src/modules/sandbox/freeportSnabbstartConfig.ts',
    'SNABBSTART_CATALOG',
    'lk:freeport:snabbstart:v1',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportFptiRefLab.tsx',
    'FreeportFptiRefLab',
    'FreeportEkonomiLab',
    'FreeportDagbokLab',
    'FP-TI-referenser',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportChameleonLive.tsx',
    'DagbokReflektionDelegate',
    'PlaneringTaskQuickDelegate',
    'FamiljenBarnfokusDelegate',
    'design-freeport__delegate-viewport',
    'executiveSkin',
    'design-freeport__delegate-viewport--exec',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportEkonomiLab.tsx',
    'FreeportEkonomiLab',
    'Översikt',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportResurserLab.tsx',
    'FreeportResurserLab',
    'Resurser',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportHybridDock.tsx',
    'FreeportHybridDock',
    'hybrid-dock',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportResurserOverlay.tsx',
    'FreeportResurserOverlay',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportHemLab.tsx',
    'FreeportHemLab',
    'Dagens ankare',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportDagbokLab.tsx',
    'FreeportDagbokLab',
    'Daglig reflektion',
  );
  mustInclude(
    'src/modules/sandbox/components/FreeportInstallningarLab.tsx',
    'FreeportInstallningarLab',
    'Logga ut',
  );
  mustInclude(
    'src/modules/sandbox/components/exec/ExecutiveExactBottomNav.tsx',
    'LivskompassMark',
    'ExecutiveExactBottomNav',
  );
  mustInclude(
    'src/modules/sandbox/components/exec/ExecutiveMediaFrame.tsx',
    'ExecutiveMediaFrame',
    'Lägg till bild',
  );
  mustInclude(
    'src/styles/design-freeport.css',
    'phone--chrome-v3',
    'exec-menu-pill',
    'exec-media-frame',
    'delegate-viewport--exec',
    'exec-chameleon-shell',
    'exec-kompass-explore',
    'fpti-ref',
    'snabb-panel',
    'modell-a-dock',
    'hybrid-dock',
    'resurser-overlay',
    'exec-honeycomb',
    'design-freeport__premium-gallery',
    'executive-premium',
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
  const indexCss = read('src/index.css');
  const freeportPageCss = read('src/modules/sandbox/DesignFreeportPage.tsx');
  assert(
    indexCss.includes('design-freeport.css') || freeportPageCss.includes('design-freeport.css'),
    'design-freeport.css ska importeras (index.css eller DesignFreeportPage)',
  );
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
  mustInclude('docs/evaluations/2026-06-18-fp-ti-exact-match-spec.md', 'HEM', 'EKONOMI');
  mustInclude('docs/evaluations/2026-06-18-fp-ti-exact-match-research.md', 'Exact Match');
  mustInclude('docs/evaluations/FP-TI-EXACT-MATCH-BACKLOG.md', 'GAP-HEM');
  mustInclude('docs/design/EXEC-TACTILE-DESIGN-SYSTEM.md', 'exec-card');
  mustInclude('docs/evaluations/2026-06-18-fp-ti-pmir-underlag.md', 'PMIR');
  mustInclude(
    'docs/evaluations/research-raw/tactile-inspiration/S11-pixel-forensics.md',
    'FP-TI-S11',
  );

  const page = read('src/modules/sandbox/DesignFreeportPage.tsx');
  for (const tab of ['hem', 'hjartat', 'mabra', 'familjen', 'planering', 'live', 'fpti-ref', 'premium']) {
    assert(page.includes(tab), `DesignFreeportPage saknar flik: ${tab}`);
  }

  const fptiRef = read('src/modules/sandbox/components/FreeportFptiRefLab.tsx');
  for (const screen of ['hem', 'ekonomi', 'resurser', 'dagbok', 'installningar']) {
    assert(fptiRef.includes(screen), `FreeportFptiRefLab saknar mock-skärm: ${screen}`);
  }

  const routes = read('src/modules/core/routing/AppRoutes.tsx');
  const mainLayoutBlock = routes.split('<MainLayout>')[1] ?? '';
  assert(
    !mainLayoutBlock.includes('path="/dev/design-freeport"'),
    'design-freeport ska ligga utanför MainLayout',
  );

  console.log('[smoke:design-freeport] PASS — Modell A kanon + Executive Premium gallery + hubs + chameleon.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:design-freeport] FAIL —', err.message || err);
  process.exit(1);
}
