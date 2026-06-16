#!/usr/bin/env node
/**
 * @deprecated Använd npm run notebooklm:sync eller notebooklm:pack:all.
 * Behålls för bakåtkompatibilitet — delegerar till sync_notebooklm.mjs.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts/sync_notebooklm.mjs');

console.warn('[pack_google_ai_pro_sources] Deprecated — kör notebooklm:pack:all framöver.');

const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
process.exit(result.status ?? 1);
