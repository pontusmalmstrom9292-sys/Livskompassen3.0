#!/usr/bin/env node
/**
 * App Check-policy — single-user Livskompassen.
 *
 * Kanon (2026-07-21 Pontus OK):
 * - Firestore Console enforcement = UNENFORCED (måste förbli av)
 * - Functions APP_CHECK_ENFORCE = false / unset (inte true i prod utan PMIR)
 * - VALV_REQUIRES_APP_CHECK = false i klientkod
 *
 * Usage:
 *   npm run smoke:app-check-policy          # static + live (om gcloud ADC)
 *   npm run smoke:app-check-policy -- --static-only
 *   npm run smoke:app-check-policy -- --live-only
 */
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROJECT = 'gen-lang-client-0481875058';

/** Services that MUST stay UNENFORCED until explicit Pontus PMIR OK. */
const MUST_BE_UNENFORCED = [
  'firestore.googleapis.com',
  'firebasestorage.googleapis.com',
  'identitytoolkit.googleapis.com',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(rel) {
  const p = resolve(ROOT, rel);
  assert(existsSync(p), `saknar fil: ${rel}`);
  return readFileSync(p, 'utf8');
}

function runStatic() {
  console.log('[smoke:app-check-policy] Statisk kod-policy…');

  const appCheck = read('src/modules/core/firebase/appCheck.ts');
  assert(
    /export const VALV_REQUIRES_APP_CHECK\s*=\s*false/.test(appCheck),
    'VALV_REQUIRES_APP_CHECK måste vara false (single-user) — PMIR krävs för true',
  );
  assert(
    appCheck.includes('APP_CHECK_ENFORCE') && appCheck.includes('håll false'),
    'appCheck.ts ska dokumentera att APP_CHECK_ENFORCE hålls false',
  );

  const guards = read('functions/src/lib/callableGuards.ts');
  assert(
    guards.includes("process.env.APP_CHECK_ENFORCE === 'true'"),
    'callableGuards måste kräva explicit APP_CHECK_ENFORCE=true (opt-in)',
  );
  assert(
    guards.includes("process.env.APP_CHECK_ENFORCE === 'false'"),
    'callableGuards måste kunna stängas av med APP_CHECK_ENFORCE=false',
  );

  const kanon = read('.cursor/rules/grunder-kanon.mdc');
  assert(
    kanon.includes('Firestore App Check') || kanon.includes('APP_CHECK'),
    'grunder-kanon måste nämna App Check PMIR-stopp',
  );

  console.log('[smoke:app-check-policy] Static: OK');
}

function accessToken() {
  try {
    return execSync('gcloud auth print-access-token', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

async function fetchServices(token) {
  const res = await fetch(
    `https://firebaseappcheck.googleapis.com/v1beta/projects/${PROJECT}/services`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': PROJECT,
      },
    },
  );
  if (!res.ok) {
    throw new Error(`App Check services API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.services ?? [];
}

async function runLive() {
  console.log('[smoke:app-check-policy] Live Console-enforcement…');
  const token = accessToken();
  if (!token) {
    console.warn(
      '[smoke:app-check-policy] SKIP live — gcloud ADC saknas. Kör: gcloud auth application-default login',
    );
    return 'skip';
  }

  const services = await fetchServices(token);
  const byName = new Map(
    services.map((s) => [String(s.name).split('/').pop(), s.enforcementMode]),
  );

  const failures = [];
  for (const svc of MUST_BE_UNENFORCED) {
    const mode = byName.get(svc);
    if (mode == null) {
      console.log(`[smoke:app-check-policy] ${svc}: (ej listad — behandlas som ok)`);
      continue;
    }
    console.log(`[smoke:app-check-policy] ${svc}: ${mode}`);
    if (mode !== 'UNENFORCED') {
      failures.push(
        `${svc} är ${mode} — måste vara UNENFORCED (Pontus policy 2026-07-21). Stäng i Console → App Check eller: npm run gcp:app-check:unenforced`,
      );
    }
  }

  assert(failures.length === 0, failures.join('\n'));
  console.log('[smoke:app-check-policy] Live: OK — Firestore/Storage/Auth UNENFORCED');
  return 'pass';
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const staticOnly = args.has('--static-only');
  const liveOnly = args.has('--live-only');

  if (!liveOnly) runStatic();
  if (!staticOnly) await runLive();

  console.log('\n[smoke:app-check-policy] PASS — App Check-policy låst (Unenforced).');
}

main().catch((err) => {
  console.error('\n[smoke:app-check-policy] FAIL —', err.message || err);
  process.exit(1);
});
