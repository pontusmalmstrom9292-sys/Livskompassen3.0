#!/usr/bin/env node
/** npm run pipeline:worktree -- <toolId> */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadFtd, root } from './lib/ftdLoader.mjs';

const toolId = process.argv[2];
if (!toolId) {
  console.error('Usage: npm run pipeline:worktree -- <toolId>');
  process.exit(1);
}

loadFtd(toolId);

const branch = `feat/pipeline-${toolId}`;
const worktreePath = join(root, 'worktrees', toolId);
const runsDir = join(root, '.orkester/pipeline-runs');
mkdirSync(runsDir, { recursive: true });

if (existsSync(worktreePath)) {
  console.log(`Worktree exists: ${worktreePath}`);
} else {
  mkdirSync(join(root, 'worktrees'), { recursive: true });
  const create = spawnSync(
    'git',
    ['worktree', 'add', '-B', branch, worktreePath],
    { cwd: root, stdio: 'inherit' },
  );
  if (create.status !== 0) {
    console.error('[fail] git worktree add');
    process.exit(create.status ?? 1);
  }
  console.log(`Created worktree: ${worktreePath} (${branch})`);
}

const state = {
  toolId,
  branch,
  worktreePath,
  agents: [
    'livskompassen-master-architect',
    'specialist-adk-weaver',
    'specialist-ux-guardian',
    'specialist-security-auditor',
    'specialist-verifier',
  ],
  status: 'spawned',
  updatedAt: new Date().toISOString(),
};

writeFileSync(join(runsDir, `${toolId}.json`), JSON.stringify(state, null, 2));
console.log(`State: .orkester/pipeline-runs/${toolId}.json`);
console.log(`Guide: docs/pipeline-studio/AGENT-WORKTREE-GUIDE.md`);
