/**
 * Statisk smoke — Android/Capacitor platform wiring (zon 7).
 * Usage: npm run smoke:android-platform
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function read(rel) {
  const p = resolve(root, rel);
  if (!existsSync(p)) throw new Error(`Missing: ${rel}`);
  return readFileSync(p, 'utf8');
}

let fail = 0;

function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
    fail += 1;
  } else {
    console.log(`PASS ${name}`);
  }
}

const nativeAuth = read('src/modules/core/auth/nativeGoogleAuth.ts');
assert('nativeGoogleAuth exists', nativeAuth.includes('FirebaseAuthentication'));
assert('authService native branch', read('src/modules/core/auth/authService.ts').includes('capacitorGoogleSignIn'));

const appCheck = read('src/modules/core/firebase/appCheck.ts');
assert('appCheck native CustomProvider', appCheck.includes('Capacitor.isNativePlatform'));

const offline = read('src/modules/core/firebase/offlineWritePolicy.ts');
assert('offline blocks reality_vault', offline.includes('reality_vault'));
assert('offline blocks children_logs', offline.includes('children_logs'));

const gs = read('android/app/google-services.json');
assert('google-services client_type 1', /"client_type"\s*:\s*1/.test(gs));

const cap = read('capacitor.config.ts');
assert('capacitor app id', cap.includes('com.livskompassen.app'));

const main = read('src/main.tsx');
assert('appCheck init before React', main.includes('initAppCheck'));
assert('capacitor shell chrome init', main.includes('initCapacitorShellChrome'));

const buildGradle = read('android/app/build.gradle');
assert('android appcheck token from .env', buildGradle.includes('FIREBASE_APP_CHECK_DEBUG_TOKEN'));
assert('AppCheckDebugBootstrap', read('android/app/src/main/java/com/livskompassen/app/util/AppCheckDebugBootstrap.java').includes('debug-secret'));
assert('MainActivity appcheck bootstrap', read('android/app/src/main/java/com/livskompassen/app/MainActivity.java').includes('AppCheckDebugBootstrap'));

const dockCss = read('src/styles/dock-kanon-match.css');
assert('android dock safe-area override', dockCss.includes('platform-capacitor-android'));

const dockFix = read('src/modules/core/platform/androidDockInsetFix.ts');
assert('android dock inset trim', dockFix.includes('trimAndroidBastaDockInsets'));

if (fail > 0) {
  console.error(`\n[smoke:android-platform] ${fail} failure(s)`);
  process.exit(1);
}
console.log('\n[smoke:android-platform] PASS');
