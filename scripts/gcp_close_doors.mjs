#!/usr/bin/env node
/**
 * Stäng av oanvända dyra GCP-API:er (read manifest safeToDisable).
 * Usage:
 *   npm run gcp:close-doors          # kör
 *   npm run gcp:close-doors -- --dry-run
 *
 * Stänger INTE cloudscheduler (appens schemalagda jobb) eller compute (Firebase).
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MANIFEST = join(ROOT, 'infra/gcp/cost-guard/manifest.json');

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const project = manifest.projectId;

  /** Dörrar vi medvetet LÄMNAR öppna — appen behöver dem. */
  const protectedApis = new Set([
    'cloudscheduler.googleapis.com', // onSchedule i functions
    'compute.googleapis.com', // Firebase / Cloud Run under huven
  ]);

  const toDisable = (manifest.safeToDisableApis ?? []).filter((api) => !protectedApis.has(api));

  console.log(`[gcp:close-doors] Projekt: ${project}`);
  console.log(`[gcp:close-doors] Dörrar att stänga: ${toDisable.length}`);
  if (dryRun) console.log('[gcp:close-doors] DRY-RUN — inget ändras\n');

  const results = { disabled: [], skipped: [], failed: [] };

  for (const api of toDisable) {
    if (dryRun) {
      console.log(`  would disable: ${api}`);
      results.skipped.push(api);
      continue;
    }
    try {
      sh(`gcloud services disable ${api} --project=${project} --force --quiet`);
      console.log(`  ✓ stängd: ${api}`);
      results.disabled.push(api);
    } catch (err) {
      const msg = String(err.stderr || err.message || err);
      console.warn(`  ✗ kunde inte stänga ${api}: ${msg.split('\n')[0]}`);
      results.failed.push({ api, error: msg.slice(0, 200) });
    }
  }

  const report = {
    project,
    at: new Date().toISOString(),
    dryRun,
    protectedApis: [...protectedApis],
    ...results,
  };
  const out = join(ROOT, 'docs/evaluations/gcp-close-doors.latest.json');
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`\n[gcp:close-doors] Rapport: ${out}`);

  if (!dryRun && results.disabled.length > 0) {
    console.log('\n[gcp:close-doors] Kör npm run gcp:audit-apis för att verifiera.');
  }
}

main();
