#!/usr/bin/env node
/** Kör: npm run chatbot:pack:design-tokens */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/chatbot-handoff/chatbot-pack-design-tokens.md');

runRepomixPack({
  root,
  output,
  label: 'chatbot-pack-design-tokens',
  include: [
    'docs/design/COLOR-POLICY.md',
    'docs/design/TYPE-SCALE.md',
    'docs/design/CHROME-POLICY.md',
    'docs/design/CHROME-EMBER-KANON.md',
    'docs/design/theme-lab/VARIANTS.md',
    'docs/external-ai/DESIGN-KEEP-REGISTER.md',
    'src/index.css',
    'tailwind.config.js',
    'src/modules/core/theme/themeRegistry.ts',
    'src/modules/core/theme/typeScale.ts',
    'src/styles/obsidian-calm-2.css',
  ],
});
