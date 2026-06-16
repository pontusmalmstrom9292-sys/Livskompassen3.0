#!/usr/bin/env node
/** Kör: npm run chatbot:pack:life-os-vision */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/chatbot-handoff/chatbot-pack-life-os-vision.md');

runRepomixPack({
  root,
  output,
  label: 'chatbot-pack-life-os-vision',
  include: [
    'docs/DOC-INDEX.md',
    'docs/evaluations/2026-06-16-supermodule-ui-masterplan.md',
    'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
    'docs/evaluations/SENASTE-SAMMANFATTNING.md',
    'docs/evaluations/SESSION-INDEX.md',
    'docs/external-ai/UI-WAVE-ROADMAP.md',
    'docs/external-ai/LIFE-OS-BUILD-STATE.md',
    'docs/MODUL-FUNKTIONS-REGISTER.md',
    '.context/system-plan.md',
    'docs/external-ai/imports/gap-matrix-2026-06-16.md',
    'docs/external-ai/imports/deep-research-ide.md',
    'docs/external-ai/leveranser/ui-design/**',
  ],
});
