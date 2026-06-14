/**
 * Static smoke: Arbetsliv Input Superhub (Fas 10A→10C — W2).
 * Usage: node scripts/smoke_arbetsliv_superhub.mjs
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

const W2_FILES = [
  'docs/evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md',
  'docs/specs/Arbetsliv-INPUT-SUPERHUB-SPEC.md',
  'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts',
  'src/modules/features/dailyLife/arbetsliv/supermodule/index.ts',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivStamplaDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivTidDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivLoggDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/routing/ArbetslivInputRoutes.tsx',
];

function main() {
  console.log('[smoke:arbetsliv-superhub] W2 filstruktur…');
  for (const rel of W2_FILES) {
    read(rel);
  }

  console.log('[smoke:arbetsliv-superhub] Modes (stampla, tid, logg)…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts',
    "'stampla'",
    "'tid'",
    "'logg'",
    'DEFAULT_ARBETSLIV_INPUT_MODE',
    'parseArbetslivInputMode',
    'arbetslivTabToInputMode',
  );

  console.log('[smoke:arbetsliv-superhub] Supermodule — guld glow + tunn router…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
    'calm-card glow-bottom-gold',
    'ArbetslivInputModeDelegate',
    'parseArbetslivInputMode',
    'vaultDrawerPath',
    "vaultDrawerPath('arbetsliv_franvaro')",
    "vaultDrawerPath('arbetsliv_lon')",
    'calm-scroll-island',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
    'addDoc',
    'updateDoc',
    'deleteDoc',
    'glow-bottom-blue',
    'glow-bottom-green',
  );

  console.log('[smoke:arbetsliv-superhub] Delegates → skrivskyddade paneler…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivStamplaDelegate.tsx',
    'StampClockPage',
    'time_entries',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivTidDelegate.tsx',
    'EconomyTidPanel',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivLoggDelegate.tsx',
    'EconomyLogPanel',
    'economy_ledger',
  );

  console.log('[smoke:arbetsliv-superhub] Shadow route /arbetsliv/input…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/routing/ArbetslivInputRoutes.tsx',
    'ArbetslivInputRoutes',
    'path="input"',
    'ArbetslivInputSuperModule',
  );

  console.log('[smoke:arbetsliv-superhub] Index exports…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/index.ts',
    'ArbetslivInputSuperModule',
    'parseArbetslivInputMode',
    'ArbetslivStamplaDelegate',
    'ArbetslivTidDelegate',
    'ArbetslivLoggDelegate',
  );

  console.log('[smoke:arbetsliv-superhub] Dokumentation…');
  mustInclude(
    'docs/specs/Arbetsliv-INPUT-SUPERHUB-SPEC.md',
    'glow-bottom-gold',
    '/arbetsliv/input',
    'vaultDrawerPath',
  );
  mustInclude(
    'docs/evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md',
    'W2',
    'W3',
    'EkonomiArbetslivBroDelegate',
  );

  console.log('[smoke:arbetsliv-superhub] Skrivskydd — protected filer oförändrade (import-only)…');
  mustInclude(
    'src/modules/features/admin/stampla/components/StampClockPage.tsx',
    'export function StampClockPage',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyTidPanel.tsx',
    'export function EconomyTidPanel',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyLogPanel.tsx',
    'export function EconomyLogPanel',
  );

  console.log('[smoke:arbetsliv-superhub] PASS — struktur, modes, glow, delegates, shadow route.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:arbetsliv-superhub] FAIL:', err.message ?? err);
  process.exit(1);
}
