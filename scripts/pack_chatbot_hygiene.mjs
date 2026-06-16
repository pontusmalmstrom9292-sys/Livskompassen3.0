#!/usr/bin/env node
/** Kör: npm run chatbot:pack:hygiene */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/chatbot-handoff/chatbot-pack-hygiene.md');

runRepomixPack({
  root,
  output,
  label: 'chatbot-pack-hygiene',
  include: [
    'docs/DOC-INDEX.md',
    'docs/external-ai/DESIGN-KEEP-REGISTER.md',
    'docs/external-ai/HYGIENE-LOG.md',
    'docs/external-ai/REPO-HYGIENE.md',
    'docs/evaluations/SESSION-INDEX.md',
    'docs/archive/README.md',
    'docs/archive/design-2026-06/README.md',
    'docs/evaluations/2026-06-15-fas19-archive-pmir.md',
  ],
});
