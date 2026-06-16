#!/usr/bin/env node
/** Kör: npm run chatbot:pack:nav-wave3 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/chatbot-handoff/chatbot-pack-nav-wave3.md');

runRepomixPack({
  root,
  output,
  label: 'chatbot-pack-nav-wave3',
  include: [
    'docs/evaluations/2026-06-16-supermodule-ui-masterplan.md',
    'docs/evaluations/2026-06-15-arkitektur-nav-analys.md',
    'docs/design/references/MENU-DRAWER-KANON.md',
    'docs/design/references/DOCK-KANON.md',
    'docs/design/PLANERING-PROJEKT-HYBRID.md',
    'src/modules/core/navigation/navTruth.ts',
    'src/modules/core/navigation/headerPageLabel.ts',
    'src/modules/core/layout/FloatingDock.tsx',
    'src/modules/core/layout/NavigationDrawer.tsx',
    'src/modules/core/components/FyrenWidgetBar.tsx',
    'src/modules/core/routing/AppRoutes.tsx',
    'src/modules/shell/LivLauncherGrid.tsx',
  ],
});
