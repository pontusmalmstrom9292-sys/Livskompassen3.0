/**
 * Statisk smoke — Android/Capacitor platform wiring (zon 7).
 * Usage: npm run smoke:android-platform
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
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
assert('appCheck awaitAppCheckReady export', appCheck.includes('export async function awaitAppCheckReady'));
assert('appCheck requireAppCheckReady export', appCheck.includes('export async function requireAppCheckReady'));
assert('appCheck native warm retries', appCheck.includes('warmNativeToken'));
assert(
  'appCheck does not pass VITE env string as native debugToken',
  !appCheck.includes('VITE_APP_CHECK_DEBUG_TOKEN') ||
    /function debugTokenFromEnv[\s\S]*?VITE_APP_CHECK_DEBUG_TOKEN/.test(appCheck),
);
assert(
  'appCheck native debugToken from BuildConfig gate (not Vite prod)',
  appCheck.includes('gate.debugToken') && appCheck.includes('resolveNativeDebugGate'),
);
assert(
  'appCheck BuildConfig-first token path with prefs fallback warn',
  appCheck.includes('BuildConfig debugToken saknas') && appCheck.includes('nativeDebugToken'),
);
assert('appCheck LkNativeBuild gate', appCheck.includes('LkNativeBuild') && appCheck.includes('getAppCheckDebugGate'));
assert('appCheck fail-closed without gate', appCheck.includes('resolveNativeDebugGate'));

const offline = read('src/modules/core/firebase/offlineWritePolicy.ts');
assert('offline blocks reality_vault', offline.includes('reality_vault'));
assert('offline blocks children_logs', offline.includes('children_logs'));

const gs = read('android/app/google-services.json');
assert('google-services client_type 1', /"client_type"\s*:\s*1/.test(gs));
const mobilesdkMatch = gs.match(/"mobilesdk_app_id"\s*:\s*"([^"]+)"/);
assert('google-services mobilesdk_app_id', Boolean(mobilesdkMatch?.[1]));

const cap = read('capacitor.config.ts');
assert('capacitor app id', cap.includes('com.livskompassen.app'));

const main = read('src/main.tsx');
assert('appCheck init before React', main.includes('initAppCheck'));
assert('capacitor shell chrome init', main.includes('initCapacitorShellChrome'));

const buildGradle = read('android/app/build.gradle');
assert('android appcheck token from .env', buildGradle.includes('FIREBASE_APP_CHECK_DEBUG_TOKEN'));
assert(
  'android release clears appcheck debug token',
  /release\s*\{[\s\S]*?FIREBASE_APP_CHECK_DEBUG_TOKEN["']?\s*,\s*['"]""['"]/.test(buildGradle) ||
    buildGradle.includes('buildConfigField "String", "FIREBASE_APP_CHECK_DEBUG_TOKEN", \'""\''),
);

const bootstrap = read('android/app/src/main/java/com/livskompassen/app/util/AppCheckDebugBootstrap.java');
assert('AppCheckDebugBootstrap DEBUG_SECRET key', bootstrap.includes('com.google.firebase.appcheck.debug.DEBUG_SECRET'));
assert('AppCheckDebugBootstrap BuildConfig.DEBUG gate', bootstrap.includes('BuildConfig.DEBUG'));
assert(
  'AppCheckDebugBootstrap app id matches google-services',
  Boolean(mobilesdkMatch?.[1]) && bootstrap.includes(mobilesdkMatch[1]),
);
assert(
  'AppCheckDebugBootstrap persistence key encoding',
  bootstrap.includes('URLEncoder') && bootstrap.includes('persistenceKey'),
);

const mainActivity = read('android/app/src/main/java/com/livskompassen/app/MainActivity.java');
assert('MainActivity appcheck bootstrap', mainActivity.includes('AppCheckDebugBootstrap'));
assert('MainActivity registers LkNativeBuildPlugin', mainActivity.includes('LkNativeBuildPlugin'));
assert(
  'MainActivity bootstrap before super.onCreate',
  /AppCheckDebugBootstrap\.applyIfDebug[\s\S]*?super\.onCreate/.test(mainActivity),
);


const vaultSession = read('src/modules/core/auth/vaultServerSession.ts');
assert('vaultSession withVaultSessionPayloadReady', vaultSession.includes('withVaultSessionPayloadReady'));
assert('vaultSession awaitAppCheckReady before issue', vaultSession.includes('awaitAppCheckReady'));
assert('MainActivity cold-start null guards', mainActivity.includes('widgetNavigator == null'));
assert('MainActivity resume re-handles widget intent', mainActivity.includes('handleIntent(getIntent())'));

const nativePlugin = read('android/app/src/main/java/com/livskompassen/app/LkNativeBuildPlugin.java');
assert('LkNativeBuildPlugin Cap name', nativePlugin.includes('@CapacitorPlugin(name = "LkNativeBuild")'));
assert('LkNativeBuildPlugin BuildConfig.DEBUG gate', nativePlugin.includes('BuildConfig.DEBUG'));
assert('LkNativeBuildPlugin exposes debugToken', nativePlugin.includes('result.put("debugToken"'));

const dockCss = read('src/styles/dock-kanon-match.css');
assert('android dock safe-area override', dockCss.includes('platform-capacitor-android'));

const dockFix = read('src/modules/core/platform/androidDockInsetFix.ts');
assert('android dock inset trim', dockFix.includes('trimAndroidBastaDockInsets'));

assert(
  'appCheck debugTokenFromEnv DEV-guard',
  /function debugTokenFromEnv[\s\S]*?if\s*\(\s*!import\.meta\.env\.DEV\s*\)\s*return\s+undefined/.test(appCheck),
);
assert(
  'AppCheckDebugBootstrap clears stale secret on release',
  bootstrap.includes('clearStaleDebugSecret') && bootstrap.includes('remove(DEBUG_SECRET_KEY)'),
);
assert(
  'vite strips App Check debug token in production',
  read('vite.config.ts').includes('stripAppCheckDebugTokenInProduction'),
);

// Optional: if dist exists, production assets must not embed a non-empty debug token.
const distAssets = resolve(root, 'dist/assets');
if (existsSync(distAssets)) {
  let leaked = false;
  for (const name of readdirSync(distAssets)) {
    if (!name.endsWith('.js')) continue;
    const code = readFileSync(resolve(distAssets, name), 'utf8');
    const m = code.match(/VITE_APP_CHECK_DEBUG_TOKEN\s*:\s*[`'"]([^`'"]+)[`'"]/);
    if (m?.[1]?.trim()) {
      leaked = true;
      console.error(`FAIL prod dist embeds App Check debug token: dist/assets/${name}`);
      fail += 1;
      break;
    }
  }
  if (!leaked) console.log('PASS prod dist has no App Check debug token');
} else {
  console.log('SKIP prod dist App Check token check (no dist/ — run build:web first)');
}

const zeroFootprint = read('src/modules/core/auth/useZeroFootprint.ts');
assert(
  'Zero Footprint native uses appStateChange (no Android visibility kickout)',
  zeroFootprint.includes('isCapacitorNative') && zeroFootprint.includes('appStateChange'),
);
assert(
  'Zero Footprint native sustained-background lock (no brief pause kickout)',
  zeroFootprint.includes('NATIVE_BACKGROUND_LOCK_MS'),
);
assert(
  'MainActivity does not pause WebView JS timers',
  !read('android/app/src/main/java/com/livskompassen/app/MainActivity.java').includes('pauseTimers()'),
);

if (fail > 0) {
  console.error(`\n[smoke:android-platform] ${fail} failure(s)`);
  process.exit(1);
}
console.log('\n[smoke:android-platform] PASS');
