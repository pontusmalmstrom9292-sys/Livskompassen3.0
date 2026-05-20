#!/usr/bin/env node
/**
 * Debug session a8f356 — verifierar bugfixar + debug-loggning.
 * Kör: node scripts/debug-verify.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOG_PATH = join(ROOT, '.cursor/debug-a8f356.log');
const INGEST = 'http://127.0.0.1:7298/ingest/69592c13-fd46-4235-84e5-06ce6caf51b5';
const SESSION = 'a8f356';

function log(hypothesisId, message, data) {
  const entry = {
    sessionId: SESSION,
    runId: 'verify-1',
    hypothesisId,
    location: 'scripts/debug-verify.mjs',
    message,
    data,
    timestamp: Date.now(),
  };
  return fetch(INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': SESSION },
    body: JSON.stringify(entry),
  }).catch(() => null);
}

const rules = readFileSync(join(ROOT, 'firestore.rules'), 'utf8');
const hasOrLogic =
  /userId == request\.auth\.uid\s*\|\|\s*.*ownerId == request\.auth\.uid/.test(rules) ||
  /ownerId == request\.auth\.uid\s*\|\|\s*.*userId == request\.auth\.uid/.test(rules);
const hasOwnerIdRead = /resource\.data\.ownerId == request\.auth\.uid/.test(rules);
const hasLegacyUserIdGuard =
  /\(!\('userId' in resource\.data\) \|\| resource\.data\.userId == request\.auth\.uid\)/.test(rules);
const hasIdentityEquality =
  /request\.resource\.data\.userId == request\.resource\.data\.ownerId/.test(rules);
const appCssExists = existsSync(join(ROOT, 'src/App.css'));

const results = {
  bug1_orLogicPresent: hasOrLogic,
  bug1_ownerIdRead: hasOwnerIdRead,
  bug1_legacyUserIdGuard: hasLegacyUserIdGuard,
  bug1_identityEquality: hasIdentityEquality,
  bug1_fixed: !hasOrLogic && hasOwnerIdRead && hasLegacyUserIdGuard && hasIdentityEquality,
  bug2_appCssExists: appCssExists,
  bug2_fixed: !appCssExists,
};

console.log('=== Livskompassen Debug Verify (session a8f356) ===');
console.log(JSON.stringify(results, null, 2));

await log('H1', 'Firestore OR-logic check', {
  hasOrLogic,
  hasOwnerIdRead,
  hasLegacyUserIdGuard,
  hasIdentityEquality,
  fixed: results.bug1_fixed,
});
await log('H2', 'App.css dead file check', { appCssExists, fixed: results.bug2_fixed });
await log('H3', 'Debug ingest ping', { ok: true, logPath: LOG_PATH });

console.log('\nLogg skickad till:', INGEST);
console.log('Loggfil:', LOG_PATH);
