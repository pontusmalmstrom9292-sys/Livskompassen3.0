#!/usr/bin/env node
/**
 * Sätter Android App Check debug-token på ansluten enhet (samma som i .env).
 * Krävs för debug-APK från Android Studio — Play Integrity fungerar inte där.
 *
 * Usage: npm run android:appcheck-adb
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILES = ['.env.local', '.env'];

function readEnvValue(key) {
  if (process.env[key]?.trim()) return process.env[key].trim();
  for (const rel of ENV_FILES) {
    const path = join(root, rel);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const name = trimmed.slice(0, eq).trim();
      if (name !== key) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return value.trim();
    }
  }
  return '';
}

function hasAdbDevice() {
  try {
    const out = execSync('adb devices', { encoding: 'utf8' });
    return out.split('\n').some((line) => /\tdevice$/.test(line));
  } catch {
    return false;
  }
}

const token = readEnvValue('VITE_APP_CHECK_DEBUG_TOKEN');

if (!token) {
  console.error('\n❌ VITE_APP_CHECK_DEBUG_TOKEN saknas i .env');
  console.error('   1. Firebase Console → App Check → Android-appen → Manage debug tokens → Generate');
  console.error('   2. Lägg token i .env: VITE_APP_CHECK_DEBUG_TOKEN=din-token');
  console.error('   3. Kör npm run cap:sync och försök igen.\n');
  process.exit(1);
}

if (!hasAdbDevice()) {
  console.warn('\n⚠️  Ingen Android-enhet via USB (adb).');
  console.warn('   Koppla telefonen, aktivera USB-felsökning, kör sedan:');
  console.warn('   npm run android:appcheck-adb\n');
  console.warn('   Appen använder BuildConfig-token vid ombyggnad — bygg om i Android Studio om Valvet fortfarande nekas.\n');
  process.exit(0);
}

try {
  execSync(`adb shell setprop debug.firebase.appcheck.debug_token "${token}"`, { stdio: 'inherit' });
  console.log('\n✅ App Check debug-token satt på enheten.');
  console.log('   Starta om appen (Force stop → Run i Android Studio).\n');
  console.log('   Token måste vara registrerad i Firebase Console → App Check → com.livskompassen.app → Manage debug tokens.\n');
} catch (err) {
  console.error('\n❌ adb setprop misslyckades:', err.message ?? err);
  process.exit(1);
}
