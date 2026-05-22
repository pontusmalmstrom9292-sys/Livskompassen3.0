/**
 * Smoke: notifyNewFile webhook (prod). Verifies secret + deployed function.
 * Usage: npm run smoke:drive
 * Secret: firebase functions:secrets:access NOTIFY_WEBHOOK_SECRET (not in git).
 */
import { execSync } from 'child_process';
import { loadFunctionsEnv, root } from './lib/loadFunctionsEnv.mjs';

const NOTIFY_URL =
  'https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function getWebhookSecret() {
  try {
    const out = execSync(
      'firebase functions:secrets:access NOTIFY_WEBHOOK_SECRET --project gen-lang-client-0481875058',
      { encoding: 'utf8', cwd: root }
    );
    return out.trim();
  } catch {
    throw new Error(
      'Kunde inte läsa NOTIFY_WEBHOOK_SECRET — kör: firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET'
    );
  }
}

async function post(body, secret) {
  const headers = { 'Content-Type': 'application/json' };
  if (secret) headers['X-Livskompassen-Webhook-Secret'] = secret;
  const res = await fetch(NOTIFY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  const fnEnv = loadFunctionsEnv();
  const ownerUid = fnEnv.DRIVE_INGEST_OWNER_UID?.trim();
  assert(ownerUid, 'DRIVE_INGEST_OWNER_UID saknas i functions/.env.gen-lang-client-0481875058');

  console.log('[smoke:drive] owner uid configured:', ownerUid.slice(0, 8) + '…');

  const secret = getWebhookSecret();

  const unauth = await post(
    { fileId: 'smoke-no-auth', fileName: 'smoke.pdf', mimeType: 'application/pdf' },
    null
  );
  assert(unauth.status === 401, `Förväntat 401 utan secret, fick ${unauth.status}`);
  console.log('[smoke:drive] PASS — 401 utan webhook-secret (fail-closed)');

  const auth = await post(
    {
      fileId: 'smoke-invalid-file-id',
      fileName: 'smoke-drive-webhook.pdf',
      mimeType: 'application/pdf',
      ownerId: 'spoof-should-be-ignored',
    },
    secret
  );
  assert(
    auth.status !== 401 && auth.status !== 503,
    `Webhook avvisad: ${auth.status} ${auth.text}`
  );
  console.log('[smoke:drive] webhook auth OK — status', auth.status, auth.text.slice(0, 120));

  if (auth.status === 200) {
    console.log('[smoke:drive] PASS — full pipeline (sällsynt med fake fileId)');
  } else {
    console.log(
      '[smoke:drive] PASS — auth/deploy OK (pipeline kan faila på fake Drive fileId; normalt)'
    );
  }
}

main().catch((err) => {
  console.error('[smoke:drive] FAIL —', err.message);
  process.exit(1);
});
