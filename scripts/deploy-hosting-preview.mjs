#!/usr/bin/env node
/**
 * Firebase Hosting preview channel — safe phone/dev URL without overwriting prod.
 */
import { spawnSync } from 'node:child_process';

const channel =
  process.env.HOSTING_PREVIEW_CHANNEL?.trim() ||
  `preview-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

console.log(`▶ Hosting preview channel: ${channel}`);
console.log('  (sätt HOSTING_PREVIEW_CHANNEL för eget namn)\n');

const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
if (build.status !== 0) process.exit(build.status ?? 1);

const deploy = spawnSync(
  'firebase',
  ['hosting:channel:deploy', channel, '--expires', '7d'],
  { stdio: 'inherit', shell: true },
);
process.exit(deploy.status ?? 1);
