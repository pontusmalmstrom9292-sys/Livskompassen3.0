#!/usr/bin/env node
/** npm run pipeline:validate [-- toolId] */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadAllFtd, loadFtd, listToolIds, root } from './lib/ftdLoader.mjs';

const indexTs = join(root, 'functions/src/index.ts');
const indexSrc = readFileSync(indexTs, 'utf8');

const argTool = process.argv[2];
const tools = argTool ? [loadFtd(argTool)] : loadAllFtd();

let failed = 0;

for (const ftd of tools) {
  const errors = [];

  if (!ftd.toolId || !ftd.callable || !ftd.silo) {
    errors.push('toolId, callable, silo required');
  }

  const jsonPath = join(root, `docs/pipeline-studio/tools/${ftd.toolId}.json`);
  const mdPath = join(root, `docs/pipeline-studio/tools/${ftd.toolId}.md`);
  if (!existsSync(jsonPath)) errors.push(`missing ${jsonPath}`);
  if (!existsSync(mdPath)) errors.push(`missing ${mdPath}`);

  if (ftd.schemaModule) {
    const schemaPath = join(root, ftd.schemaModule);
    if (!existsSync(schemaPath)) errors.push(`missing schema ${schemaPath}`);
  }

  const callablePattern = new RegExp(`\\b${ftd.callable}\\b`);
  if (!callablePattern.test(indexSrc)) {
    errors.push(`callable ${ftd.callable} not found in functions/src/index.ts`);
  }

  if (errors.length) {
    failed += 1;
    console.error(`[FAIL] ${ftd.toolId}`);
    for (const e of errors) console.error(`  - ${e}`);
  } else {
    console.log(`[PASS] ${ftd.toolId} → ${ftd.callable} (${ftd.silo})`);
  }
}

console.log(`\nTools in catalog: ${listToolIds().length}`);
process.exit(failed > 0 ? 1 : 0);
