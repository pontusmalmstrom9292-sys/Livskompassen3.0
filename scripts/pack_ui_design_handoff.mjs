#!/usr/bin/env node
/**
 * Repomix för UI/Design-agent — navigation, design-specs, koordinering.
 * Kör: npm run chatbot:pack:ui-design
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/chatbot-handoff');
const output = join(outDir, 'ui-design-pack.md');

const include = [
  // Koordinering + plan
  'docs/external-ai/UI-DESIGN-HANDOFF.md',
  'docs/external-ai/LIFE-OS-BUILD-STATE.md',
  'docs/external-ai/CHATBOX-LATHUND.md',
  'docs/external-ai/DESIGN-KEEP-REGISTER.md',
  'docs/evaluations/2026-06-15-arkitektur-nav-analys.md',
  'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
  // Låsta gränser
  '.context/locked-ux-features.md',
  '.context/design-language.md',
  '.context/locked-icons.md',
  // Design-specs (KEEP)
  'docs/design/COLOR-POLICY.md',
  'docs/design/ICON-STYLE-GUIDE.md',
  'docs/design/PLANERING-PROJEKT-HYBRID.md',
  'docs/design/PLANERINGSSIDA-SPEC.md',
  'docs/design/WIDGET-BAR-SPEC.md',
  'docs/design/BARNPORTEN-SPEC.md',
  'docs/design/VALV-HUBB-SPEC.md',
  'docs/design/FAMILJEN-HUB-SPEC.md',
  'docs/design/references/MENU-DRAWER-KANON.md',
  'docs/design/references/DOCK-KANON.md',
  'docs/design/references/KOMPASS-TRE-TIDPUNKTER.md',
  'docs/gpt-handoff/README.md',
  // Nav-sanning (kod)
  'src/modules/core/navigation/navTruth.ts',
  'src/modules/core/layout/FloatingDock.tsx',
  'src/modules/core/components/FyrenWidgetBar.tsx',
  'src/modules/shell/LivLauncherGrid.tsx',
  'src/modules/shell/livLauncherPreviews.tsx',
  'src/modules/core/routing/AppRoutes.tsx',
  'src/modules/features/admin/planning/components/PlaneringPage.tsx',
].join(',');

mkdirSync(outDir, { recursive: true });

console.log('=== ui-design-pack ===');
const result = spawnSync(
  'npx',
  [
    'repomix',
    '--style',
    'markdown',
    '--compress',
    '--remove-comments',
    '--remove-empty-lines',
    '--no-directory-structure',
    '--include',
    include,
    '--output',
    output,
  ],
  { cwd: root, stdio: 'inherit', shell: true },
);

if (result.status !== 0) {
  console.error('[fail] ui-design-pack');
  process.exit(result.status ?? 1);
}

console.log(`\nKlart: ${output}`);
