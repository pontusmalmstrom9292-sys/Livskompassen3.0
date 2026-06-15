#!/usr/bin/env node
/**
 * Statiska guards — Valv-session lifecycle (Fyren, server token, Zero Footprint).
 * Usage: npm run smoke:valv-security
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
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

function assertVaultZoneGateUnmounted() {
  const srcRoot = resolve(root, 'src');
  const gatePath = resolve(root, 'src/modules/core/security/VaultZoneGate.tsx');
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = resolve(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if ((name.endsWith('.ts') || name.endsWith('.tsx')) && p !== gatePath) {
        const text = readFileSync(p, 'utf8');
        assert(!/VaultZoneGate/.test(text) || !/from\s+['"].*VaultZoneGate/.test(text),
          `${p.replace(root + '/', '')} importerar VaultZoneGate — ska vara avmonterad (Fyren)`);
      }
    }
  };
  walk(srcRoot);
}

function main() {
  console.log('[smoke:valv-security] Session lifecycle…');
  assertVaultZoneGateUnmounted();

  mustInclude(
    'src/modules/core/security/vaultSessionLifecycle.ts',
    'endVaultSession',
    'ensureVaultSessionReady',
    'clearAllVaultZones',
  );
  mustInclude(
    'src/modules/core/auth/vaultServerSession.ts',
    'ensureVaultServerSession',
    'issueVaultSession',
    'getVaultSessionToken',
  );
  mustInclude(
    'src/modules/core/auth/valvFyrenGate.ts',
    'issueVaultServerSession',
    'performVaultWebAuthnForSession',
    'clearVaultGate',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx',
    'ensureVaultSessionReady',
    'endVaultSession',
  );
  mustInclude(
    'src/modules/core/auth/useZeroFootprint.ts',
    'endVaultSession',
    'VAULT_SESSION_IDLE_MS',
  );
  mustInclude(
    'src/modules/core/components/VaultLockedGate.tsx',
    'openValvViaFyren',
    'biometri',
  );
  mustInclude('functions/src/lib/vaultSessionGate.ts', 'assertVaultSession', 'revokeVaultSession', 'vaultSessionGrantsVaultRead');
  mustInclude('functions/src/callables/weeklySummary.ts', 'vaultSessionGrantsVaultRead', 'reality_vault');
  mustInclude('functions/src/callables/compass.ts', 'vaultSessionGrantsVaultRead', 'reality_vault');
  mustInclude('functions/src/lib/vaultWebAuthn.ts', 'loadStoredCredentials', 'forceRegistration', 'credentials');
  mustInclude('src/modules/core/components/SystemErrorBanner.tsx', 'system.error', 'role="alert"');
  mustInclude('functions/src/lib/callableGuards.ts', 'guardSensitiveCallableV2', 'isAppCheckEnforcementEnabled');
  mustInclude(
    'src/modules/core/firebase/appCheck.ts',
    'FirebaseAppCheck',
    'CustomProvider',
    'Capacitor.isNativePlatform',
  );
  mustInclude('src/modules/core/auth/callableErrorMessage.ts', 'formatCallableError', 'App Check');
  mustInclude('src/modules/core/hooks/useLongPress.ts', 'onTouchCancel');
  mustInclude('src/modules/core/auth/valvFyrenGate.ts', 'isAuthenticated', 'isEmailAuthRequired');
  mustInclude('functions/src/lib/rateLimit.ts', 'assertRateLimit', '_rate_limits');
  mustInclude('firestore.rules', 'isVerifiedUser', 'isValidRealityVaultCreate');
  mustInclude('functions/src/index.ts', 'issueVaultSession', 'beginVaultWebAuthnChallenge', 'invalidateSession');
  const authSvc = read('src/modules/core/auth/authService.ts');
  assert(authSvc.includes('export async function signOutUser'), 'authService.ts saknar signOutUser');
  const signOutBody = authSvc.match(/export async function signOutUser\(\)[^{]*\{([\s\S]*?)^\}/m);
  assert(signOutBody?.[1]?.includes('await endVaultSession()'), 'signOutUser måste anropa endVaultSession');
  mustInclude('src/modules/core/auth/authService.ts', 'clearSpeglarSession');

  console.log('[smoke:valv-security] PASS — Valv WORM-session hardening.');
}

main();
