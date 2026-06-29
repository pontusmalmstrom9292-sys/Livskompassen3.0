/**
 * Verifierar att cap:sync:prod skrev live Hosting-URL till Android assets.
 * Usage: npm run smoke:android-prod-sync
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PROD_URL = 'https://gen-lang-client-0481875058.web.app';
const syncedPath = resolve(root, 'android/app/src/main/assets/capacitor.config.json');

if (!existsSync(syncedPath)) {
  console.error('[smoke:android-prod-sync] FAIL — saknar android/app/src/main/assets/capacitor.config.json (kör npm run cap:sync:prod)');
  process.exit(1);
}

const json = JSON.parse(readFileSync(syncedPath, 'utf8'));
const url = json?.server?.url;

if (url !== PROD_URL) {
  console.error(`[smoke:android-prod-sync] FAIL — server.url="${url ?? '(saknas)'}" förväntat ${PROD_URL}`);
  console.error('Kör: npm run cap:sync:prod');
  process.exit(1);
}

console.log('[smoke:android-prod-sync] PASS — Android WebView pekar på live Hosting.');
