/**
 * Drive automation — Firebase-sida + verifiering + Apps Script copy-paste.
 * Usage: npm run drive:wireup
 *
 * Engångs manuellt (Google): kopiera .drive-setup.json.example → .drive-setup.json,
 * fyll folder IDs, kör detta script, klistra Script Properties i Apps Script, kör createTrigger().
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { loadFunctionsEnv, root, PROJECT_ID } from './lib/loadFunctionsEnv.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SETUP_PATH = resolve(root, '.drive-setup.json');
const APPS_SCRIPT_SA = `${PROJECT_ID}@appspot.gserviceaccount.com`;

function loadDriveSetup() {
  if (!existsSync(SETUP_PATH)) {
    return null;
  }
  return JSON.parse(readFileSync(SETUP_PATH, 'utf8'));
}

function getWebhookSecret() {
  return execSync(
    'firebase functions:secrets:access NOTIFY_WEBHOOK_SECRET --project gen-lang-client-0481875058',
    { encoding: 'utf8', cwd: root }
  ).trim();
}

function writeScriptPropertiesFile(setup, ownerUid, webhookSecret) {
  if (!setup?.inboxFolderId || !setup?.vaultFolderId) return;
  const outPath = resolve(root, 'scripts/google-apps-script/.script-properties.local.txt');
  const uid = setup.firebaseOwnerUid ?? ownerUid;
  const content = [
    '# Klistra varje rad som nyckel=värde i Apps Script → Project Settings → Script Properties',
    '# Filen är gitignored — radera efter klistring om du vill',
    '',
    `INBOX_FOLDER_ID=${setup.inboxFolderId}`,
    `VAULT_FOLDER_ID=${setup.vaultFolderId}`,
    `WEBHOOK_SECRET=${webhookSecret}`,
    `FIREBASE_OWNER_UID=${uid}`,
    `CLOUD_FUNCTION_URL=https://europe-west1-${PROJECT_ID}.cloudfunctions.net/notifyNewFile`,
    '',
  ].join('\n');
  writeFileSync(outPath, content, 'utf8');
  console.log('[drive:wireup] Skrev', outPath, '(öppna och klistra i Apps Script)');
}

function printAppsScriptBlock(setup, ownerUid, webhookSecret) {
  console.log('\n--- Apps Script → Project Settings → Script Properties ---\n');
  const lines = [
    ['INBOX_FOLDER_ID', setup?.inboxFolderId ?? '(sätt i .drive-setup.json)'],
    ['VAULT_FOLDER_ID', setup?.vaultFolderId ?? '(sätt i .drive-setup.json)'],
    ['WEBHOOK_SECRET', setup?.inboxFolderId ? '(se .script-properties.local.txt)' : '(samma som Firebase NOTIFY_WEBHOOK_SECRET)'],
    ['FIREBASE_OWNER_UID', setup?.firebaseOwnerUid ?? ownerUid],
    [
      'CLOUD_FUNCTION_URL',
      `https://europe-west1-${PROJECT_ID}.cloudfunctions.net/notifyNewFile`,
    ],
  ];
  for (const [key, value] of lines) {
    console.log(`${key}=${value}`);
  }
  console.log('\n--- Drive (engång) ---');
  console.log(`Dela Vault-mappen med: ${APPS_SCRIPT_SA} (minst Viewer)`);
  console.log('Apps Script: klistra scripts/google-apps-script/sorter.gs → Spara → kör createTrigger() en gång');
  console.log('Test: lägg PDF i Inbox → kör autonomousSorter() manuellt eller vänta 1h\n');
}

async function main() {
  const fnEnv = loadFunctionsEnv();
  const ownerUid = fnEnv.DRIVE_INGEST_OWNER_UID?.trim();
  if (!ownerUid) {
    throw new Error(
      'Saknar DRIVE_INGEST_OWNER_UID i functions/.env.gen-lang-client-0481875058'
    );
  }

  console.log('[drive:wireup] Firebase owner uid:', ownerUid.slice(0, 8) + '…');

  const setup = loadDriveSetup();
  if (setup?.firebaseOwnerUid && setup.firebaseOwnerUid !== ownerUid) {
    console.warn(
      '[drive:wireup] VARNING: .drive-setup.json firebaseOwnerUid skiljer sig från DRIVE_INGEST_OWNER_UID'
    );
  }

  console.log('[drive:wireup] Bygg functions…');
  execSync('npm run build', { cwd: resolve(root, 'functions'), stdio: 'inherit' });

  console.log('[drive:wireup] Deploy notifyNewFile…');
  execSync('firebase deploy --only functions:notifyNewFile', {
    cwd: root,
    stdio: 'inherit',
  });

  console.log('[drive:wireup] Smoke webhook…');
  execSync('npm run smoke:drive', { cwd: root, stdio: 'inherit' });

  const webhookSecret = getWebhookSecret();
  writeScriptPropertiesFile(setup, ownerUid, webhookSecret);
  printAppsScriptBlock(setup, ownerUid, webhookSecret);

  const statusPath = resolve(root, 'docs', 'DRIVE_SETUP_STATUS.md');
  const stamp = new Date().toISOString();
  const body = `# Drive setup status (auto)

**Senast:** ${stamp}

| Kontroll | Status |
|----------|--------|
| DRIVE_INGEST_OWNER_UID i functions env | **OK** |
| notifyNewFile deploy | **OK** (via drive:wireup) |
| Webhook secret smoke | **OK** (smoke:drive) |
| Apps Script Script Properties | ${setup?.inboxFolderId && setup?.vaultFolderId ? '**redo att klistra**' : '**väntar** — skapa .drive-setup.json'} |
| Vault delad med SA | **manuell** — ${APPS_SCRIPT_SA} |

Kör igen: \`npm run drive:wireup\`
`;
  writeFileSync(statusPath, body);
  console.log('[drive:wireup] Skrev', statusPath);
  console.log('[drive:wireup] KLAR — Firebase-sida låst. Slutför Apps Script-blocket ovan om Drive ska köra automatiskt.');
}

main().catch((err) => {
  console.error('[drive:wireup] FAIL —', err.message);
  process.exit(1);
});
