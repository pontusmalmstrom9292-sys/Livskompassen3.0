#!/usr/bin/env node
/**
 * Evigt Minne — GCS Archive dry-run (ingen live export).
 * Usage:
 *   node scripts/minne_gcs_archive_dryrun.mjs
 *   node scripts/minne_gcs_archive_dryrun.mjs --apply   # PMIR — kräver OK minne apply
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');

const COLLECTIONS = ['kampspar', 'kb_docs'];
const DEFAULT_BUCKET = 'livskompassen-minne-archive'; // design name — create on apply

function loadProjectId() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || null;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^VITE_FIREBASE_PROJECT_ID=(.+)$/);
    if (m) return m[1].trim();
  }
  return process.env.GCLOUD_PROJECT || null;
}

console.log('[minne-archive] Evigt Minne GCS Archive — DRY RUN');
console.log(`[minne-archive] collections: ${COLLECTIONS.join(', ')}`);
console.log(`[minne-archive] target bucket (design): gs://${DEFAULT_BUCKET}/worm/{uid}/{collection}/{yyyy}/{docId}.json`);
console.log('[minne-archive] retention: long-term (Archive class) — not 30-day Backup');
console.log('[minne-archive] scope: WORM text+metadata only; embeddings optional sidecar');
console.log(`[minne-archive] project: ${loadProjectId() ?? '(okänt)'}`);

if (apply) {
  console.error('[minne-archive] FAIL — --apply blockerat. Skriv "OK minne apply" + kör separat efter kostnadsräkning.');
  console.error('[minne-archive] Live export är inte del av npm run minne:yolo:build.');
  process.exit(4);
}

console.log('[minne-archive] PASS — dry-run only (ingen GCS-skrivning).');
console.log('[minne-archive] Chunking: långa kb_docs → parent WORM + child chunks (design i runbook).');
process.exit(0);
