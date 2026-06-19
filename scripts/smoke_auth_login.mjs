/**
 * Static smoke: Locked Google web login (AUTH-G1).
 * Usage: npm run smoke:auth-login
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

function main() {
  assert(existsSync(resolve(root, '.context/locked-auth-google.md')), 'saknar .context/locked-auth-google.md');

  // G1 + initializeAuth
  mustInclude(
    'src/modules/core/firebase/init.ts',
    '@locked AUTH-G1',
    'gen-lang-client-0481875058.firebaseapp.com',
    'initializeAuth',
    'browserPopupRedirectResolver',
    'browserLocalPersistence',
  );
  mustNotInclude(
    'src/modules/core/firebase/init.ts',
    "authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0481875058.web.app'",
    'hostingAuthDomain',
  );

  // G5 boot
  mustInclude(
    'src/modules/core/firebase/authRedirectBoot.ts',
    'getRedirectResult',
    'googleRedirectBoot',
  );
  mustInclude('src/main.tsx', 'googleRedirectBoot', 'registerSW({ immediate: true })');
  mustNotInclude(
    'src/main.tsx',
    'registerSW({ immediate: true });\n\napplyDefaultTheme',
  );

  // G2–G4 popup/redirect policy
  mustInclude(
    'src/modules/core/auth/googleAuthProvider.ts',
    '@locked AUTH-G1',
    'isStandalonePwa',
    'import.meta.env.DEV',
    'VITE_GOOGLE_SIGNIN_REDIRECT',
  );
  mustNotInclude(
    'src/modules/core/auth/googleAuthProvider.ts',
    "import.meta.env.VITE_GOOGLE_SIGNIN_REDIRECT === 'true') return true;",
    'pointer: coarse',
    'mobileUa',
  );

  // G2 + G6 authService
  mustInclude(
    'src/modules/core/auth/authService.ts',
    '@locked AUTH-G1',
    'signInWithPopup',
    'signInWithRedirect',
    'shouldUseGoogleRedirect',
    'prepareGoogleSignIn',
    'await signOut(auth)',
  );
  mustNotInclude(
    'src/modules/core/auth/authService.ts',
    'await signInWithRedirect(auth, provider);\n    return null;\n  } catch',
  );

  // AuthProvider + AuthGate
  mustInclude(
    'src/modules/core/auth/AuthProvider.tsx',
    'googleRedirectBoot',
    'auth.authStateReady',
  );
  mustInclude(
    'src/modules/core/auth/AuthGate.tsx',
    'isVerifiedEmailUser',
    'EmailAuthPanel',
  );

  // PWA workbox — auth handler
  mustInclude('vite.config.ts', 'navigateFallbackDenylist', '/__\\/auth\\//');

  // Prod env example must not enable redirect by default
  mustNotInclude('.env.example', 'VITE_GOOGLE_SIGNIN_REDIRECT=true');

  // Capacitor/Android — native Google, not web redirect (minimal; full wiring: smoke:android-platform)
  mustInclude(
    'src/modules/core/auth/googleAuthProvider.ts',
    'isCapacitorNative()',
    'if (isCapacitorNative()) return false',
  );
  mustInclude(
    'src/modules/core/auth/authService.ts',
    'capacitorGoogleSignIn',
    'if (isCapacitorNative())',
  );
  mustInclude(
    'src/modules/core/auth/nativeGoogleAuth.ts',
    'FirebaseAuthentication',
    'skipNativeAuth: true',
  );

  console.log('[smoke:auth-login] PASS — AUTH-G1 Google web login låst (popup, firebaseapp.com, boot redirect).');
}

try {
  main();
} catch (err) {
  console.error('[smoke:auth-login] FAIL —', err.message || err);
  process.exit(1);
}
