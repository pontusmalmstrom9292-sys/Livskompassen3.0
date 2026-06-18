#!/usr/bin/env node
/** npm run pipeline:cursor-pack -- <toolId> */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadFtd, root } from './lib/ftdLoader.mjs';

const toolId = process.argv[2];
if (!toolId) {
  console.error('Usage: npm run pipeline:cursor-pack -- <toolId>');
  process.exit(1);
}

const ftd = loadFtd(toolId);
const outDir = join(root, 'exports/pipeline-studio');
mkdirSync(outDir, { recursive: true });

const smokeLines = (ftd.smoke ?? ['npm run smoke:orkester']).map((s) => `  - ${s}`).join('\n');

const prompt = `---
NÄSTA STEG (kopiera till Cursor):

MODEL TIER: HEAVY
SCOPE: backend-only
READ FIRST (mandatory):
  - docs/pipeline-studio/tools/${toolId}.json
  - ${ftd.schemaModule ?? 'functions/src/schemas/index.ts'}
  - functions/src/index.ts
CONTEXT: Pipeline Studio FTD ${toolId}
LOCKED UX: ${(ftd.lockedUx ?? []).join(', ') || 'none'}
TASK: Verify and maintain ${ftd.callable} per FTD ${toolId}. Silo: ${ftd.silo}. No behavior change unless AC requires.
MUST NOT:
  - Genkit V1 migration
  - Cross-RAG between silos
  - LLM WORM writes
  - Remove locked UX flows
VERIFY (run before claiming done):
  - cd functions && npm run build
  - npm run pipeline:validate -- ${toolId}
${smokeLines}
DONE WHEN: pipeline:validate PASS and relevant smoke PASS

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
---
`;

const outFile = join(outDir, `${toolId}-cursor-prompt.md`);
writeFileSync(outFile, prompt, 'utf8');
console.log(`Cursor pack: ${outFile}`);
