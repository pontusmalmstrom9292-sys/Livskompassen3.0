#!/usr/bin/env node
/**
 * Sätter Android App Check debug-token på ansluten enhet (samma som i .env).
 * Krävs för debug-APK från Android Studio — Play Integrity fungerar inte där.
 *
 * Usage: npm run android:appcheck-adb
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
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

/** Hittar adb även när Android SDK inte ligger i PATH (vanligt i Cursor-terminal). */
function resolveAdbPath() {
  const fromPath = process.env.ADB_PATH?.trim();
  if (fromPath && existsSync(fromPath)) return fromPath;

  const sdkRoots = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    join(homedir(), 'Library/Android/sdk'),
  ].filter(Boolean);

  for (const sdk of sdkRoots) {
    const candidate = join(sdk, 'platform-tools/adb');
    if (existsSync(candidate)) return candidate;
  }

  try {
    const which = execSync('command -v adb', { encoding: 'utf8' }).trim();
    if (which && existsSync(which)) return which;
  } catch {
    // ignore
  }

  return null;
}

function runAdb(adbPath, args) {
  return execSync(`"${adbPath}" ${args}`, { encoding: 'utf8' });
}

function hasAdbDevice(adbPath) {
  try {
    const out = runAdb(adbPath, 'devices');
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

const adbPath = resolveAdbPath();
if (!adbPath) {
  console.error('\n❌ adb hittades inte.');
  console.error('   Installera Android Studio SDK eller lägg till i PATH:');
  console.error('   export PATH="$HOME/Library/Android/sdk/platform-tools:$PATH"\n');
  console.error('   Alternativ: bygg om appen i Android Studio (Run) — token injiceras via BuildConfig.\n');
  process.exit(1);
}

if (!hasAdbDevice(adbPath)) {
  console.warn('\n⚠️  adb hittad men ingen telefon ansluten via USB.');
  console.warn(`   adb: ${adbPath}`);
  console.warn('   Koppla telefonen, aktivera USB-felsökning, kör sedan:');
  console.warn('   npm run android:appcheck-adb\n');
  console.warn('   Alternativ: bygg om i Android Studio (Run) — token från .env bakas in automatiskt.\n');
  process.exit(0);
}

try {
  execSync(`"${adbPath}" shell setprop debug.firebase.appcheck.debug_token "${token}"`, { stdio: 'inherit' });
  console.log('\n✅ App Check debug-token satt på enheten.');
  console.log('   Starta om appen (Force stop → Run i Android Studio).\n');
  console.log('   Token måste vara registrerad i Firebase Console → App Check → com.livskompassen.app → Manage debug tokens.\n');
} catch (err) {
  console.error('\n❌ adb setprop misslyckades:', err.message ?? err);
  process.exit(1);
}
