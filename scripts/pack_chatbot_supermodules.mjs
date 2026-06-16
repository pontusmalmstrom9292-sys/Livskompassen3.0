#!/usr/bin/env node
/** Kör: npm run chatbot:pack:supermodules */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/chatbot-handoff/chatbot-pack-supermodules.md');

runRepomixPack({
  root,
  output,
  label: 'chatbot-pack-supermodules',
  include: [
    'docs/evaluations/2026-06-16-supermodule-ui-masterplan.md',
    'docs/evaluations/2026-06-15-valv-supermodule-spec.md',
    'docs/specs/modules/VALVET_SUPERMODULE_PLAN.md',
    'src/modules/core/ui/SupermoduleModeSelect.tsx',
    'src/modules/**/*InputSuperModule*.tsx',
    'src/modules/**/*SuperModule*.tsx',
    'src/modules/**/supermodule/**',
    'src/modules/**/inputModes.ts',
    'src/modules/**/*InputModes.ts',
  ],
});
