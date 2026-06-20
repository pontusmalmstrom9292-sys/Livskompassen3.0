#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const STALE_HOURS = Number(process.env.INTEGRATION_STALE_HOURS ?? 24);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stampPath = join(root, 'docs/external-ai/bifoga/05-research-handoff/SYNC-STAMP.txt');
if (!existsSync(stampPath)) { console.log('[integration:stale] SYNC-STAMP saknas'); process.exit(1); }
const age = (Date.now() - statSync(stampPath).mtimeMs) / 3600000;
const content = readFileSync(stampPath, 'utf8').trim();
if (age > STALE_HOURS) { console.log(`[integration:stale] STALE (${age.toFixed(1)}h): ${content}`); process.exit(1); }
console.log(`[integration:stale] OK (${age.toFixed(1)}h): ${content}`);
process.exit(0);
