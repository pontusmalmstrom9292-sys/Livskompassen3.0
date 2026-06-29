#!/usr/bin/env node
/**
 * Live audit: jämför aktiverade GCP-API:er mot cost-guard allowlist.
 * Usage: npm run gcp:audit-apis
 *
 * Kräver: gcloud inloggad med läsrättighet på projektet.
 * Skapar INTE resurser — read-only.
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
  const args = process.argv.slice(2);
  const writeReport = args.includes('--write-report');
  const strict = args.includes('--strict');

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const project = process.env.GCP_PROJECT_ID || manifest.projectId;

  console.log(`[gcp:audit-apis] Projekt: ${project}`);

  let enabled;
  try {
    enabled = sh(`gcloud services list --enabled --project=${project} --format="value(config.name)"`)
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (err) {
    console.error('[gcp:audit-apis] FAIL — gcloud krävs. Kör: gcloud auth login');
    console.error(String(err.stderr || err.message));
    process.exit(2);
  }

  const allowed = new Set(manifest.allowedApis);
  const blocked = new Set(manifest.blockedApis);

  const unexpected = enabled.filter((api) => !allowed.has(api));
  const blockedEnabled = enabled.filter((api) => blocked.has(api));
  const missingAllowed = manifest.allowedApis.filter((api) => !enabled.includes(api));

  const report = {
    project,
    auditedAt: new Date().toISOString(),
    enabledCount: enabled.length,
    blockedEnabled,
    unexpectedEnabled: unexpected.filter((api) => !blocked.has(api)),
    missingCore: missingAllowed.filter((api) =>
      ['firestore.googleapis.com', 'cloudfunctions.googleapis.com', 'firebase.googleapis.com'].includes(api),
    ),
    pass: blockedEnabled.length === 0 && (!strict || unexpected.length === 0),
  };

  console.log(`[gcp:audit-apis] Aktiverade API:er: ${enabled.length}`);

  if (blockedEnabled.length) {
    console.error('[gcp:audit-apis] BLOCKERADE API:er aktiva (PMIR + stäng av):');
    for (const api of blockedEnabled) {
      const note = manifest.blockedApiNotes?.[api] ?? '';
      console.error(`  ✗ ${api}${note ? ` — ${note}` : ''}`);
    }
  }

  if (report.unexpectedEnabled.length) {
    console.warn('[gcp:audit-apis] Oväntade API:er (ej i allowlist — granska):');
    for (const api of report.unexpectedEnabled) console.warn(`  ? ${api}`);
  }

  if (report.missingCore.length) {
    console.warn('[gcp:audit-apis] Saknade kärn-API:er:');
    for (const api of report.missingCore) console.warn(`  ! ${api}`);
  }

  if (writeReport) {
    const out = join(ROOT, 'docs/evaluations/gcp-api-audit.latest.json');
    writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(`[gcp:audit-apis] Rapport: ${out}`);
  }

  if (!report.pass) {
    console.error('[gcp:audit-apis] FAIL — stäng av blockerade API:er i Cloud Console → APIs & Services');
    process.exit(1);
  }

  console.log('[gcp:audit-apis] PASS — inga blockerade API:er aktiva.');
}

main();
