#!/usr/bin/env node
/**
 * Sätter App Check Console-enforcement till UNENFORCED för Firestore (+ Storage/Auth).
 * Använd endast med Pontus OK. Default: dry-run.
 *
 * Usage:
 *   npm run gcp:app-check:unenforced -- --dry-run
 *   npm run gcp:app-check:unenforced -- --apply
 */
import { execSync } from 'child_process';

const PROJECT = 'gen-lang-client-0481875058';
const SERVICES = [
  'firestore.googleapis.com',
  'firebasestorage.googleapis.com',
  'identitytoolkit.googleapis.com',
];

function accessToken() {
  return execSync('gcloud auth print-access-token', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

async function getService(token, service) {
  const res = await fetch(
    `https://firebaseappcheck.googleapis.com/v1beta/projects/${PROJECT}/services/${service}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': PROJECT,
      },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${service} GET ${res.status}: ${await res.text()}`);
  return res.json();
}

async function setUnenforced(token, service, etag) {
  const res = await fetch(
    `https://firebaseappcheck.googleapis.com/v1beta/projects/${PROJECT}/services/${service}?updateMask=enforcementMode`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': PROJECT,
        'Content-Type': 'application/json',
        ...(etag ? { 'If-Match': etag } : {}),
      },
      body: JSON.stringify({ enforcementMode: 'UNENFORCED' }),
    },
  );
  if (!res.ok) throw new Error(`${service} PATCH ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`[gcp:app-check:unenforced] ${apply ? 'APPLY' : 'DRY-RUN'} — project ${PROJECT}`);

  const token = accessToken();
  for (const service of SERVICES) {
    const cur = await getService(token, service);
    if (!cur) {
      console.log(`  ${service}: (saknas — skip)`);
      continue;
    }
    const mode = cur.enforcementMode;
    console.log(`  ${service}: ${mode}`);
    if (mode === 'UNENFORCED') continue;
    if (!apply) {
      console.log(`    → skulle sätta UNENFORCED (kör med --apply)`);
      continue;
    }
    const updated = await setUnenforced(token, service, cur.etag);
    console.log(`    → ${updated.enforcementMode}`);
  }

  console.log(
    apply
      ? '[gcp:app-check:unenforced] Klart. Verifiera: npm run smoke:app-check-policy'
      : '[gcp:app-check:unenforced] Dry-run klar. Inget ändrat.',
  );
}

main().catch((err) => {
  console.error('[gcp:app-check:unenforced] FAIL —', err.message || err);
  process.exit(1);
});
