#!/usr/bin/env node
/** npm run pipeline:run-smoke -- <toolId> */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadFtd, root } from './lib/ftdLoader.mjs';

const toolId = process.argv[2];
if (!toolId) {
  console.error('Usage: npm run pipeline:run-smoke -- <toolId>');
  process.exit(1);
}

const ftd = loadFtd(toolId);
const commands = [
  'cd functions && npm run build',
  'npm run pipeline:validate -- ' + toolId,
  ...(ftd.smoke ?? ['npm run smoke:orkester']),
];

let failed = 0;
for (const cmd of commands) {
  console.log(`\n=== ${cmd} ===`);
  const r = spawnSync(cmd, { cwd: root, shell: true, stdio: 'inherit' });
  if (r.status !== 0) failed += 1;
}

const runsDir = join(root, '.orkester/pipeline-runs');
mkdirSync(runsDir, { recursive: true });
writeFileSync(
  join(runsDir, `${toolId}-smoke.json`),
  JSON.stringify(
    {
      toolId,
      status: failed === 0 ? 'PASS' : 'FAIL',
      commands,
      at: new Date().toISOString(),
    },
    null,
    2,
  ),
);

process.exit(failed > 0 ? 1 : 0);
