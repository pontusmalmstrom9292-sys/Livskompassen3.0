/**
 * Static smoke: Arbetsliv Input Superhub (Fas 10 / 14A).
 * Usage: node scripts/smoke_arbetsliv_superhub.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(c, m) {
  if (!c) throw new Error(m);
}
function read(p) {
  const f = resolve(root, p);
  assert(existsSync(f), `saknar fil: ${p}`);
  return readFileSync(f, 'utf8');
}
function mustInclude(p, ...n) {
  const t = read(p);
  for (const x of n) assert(t.includes(x), `${p} saknar: ${x}`);
}
function mustNotInclude(p, ...n) {
  const t = read(p);
  for (const x of n) assert(!t.includes(x), `${p} får inte innehålla: ${x}`);
}

const W2_FILES = [
  'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts',
  'src/modules/features/dailyLife/arbetsliv/supermodule/index.ts',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivStamplaDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivFlexDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivInkomstDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivProfilDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivValvBroDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/routing/ArbetslivInputRoutes.tsx',
];

function main() {
  console.log('[smoke:arbetsliv-superhub] W2 filstruktur (Fas 14A)…');
  for (const rel of W2_FILES) {
    read(rel);
  }

  console.log('[smoke:arbetsliv-superhub] Modes (stampla, inkomster, tid, lonest)…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts',
    "'stampla'",
    "'inkomster'",
    "'tid'",
    "'lonest'",
    'DEFAULT_ARBETSLIV_INPUT_MODE',
    'parseArbetslivInputMode',
    'arbetslivTabToInputMode',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts',
    "id: 'logg'",
  );

  console.log('[smoke:arbetsliv-superhub] Supermodule — indigo glow + tunn router…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
    'calm-card glow-bottom-blue',
    'ArbetslivInputModeDelegate',
    'parseArbetslivInputMode',
    'ArbetslivValvBroDelegate',
    'text-accent-secondary',
    'calm-scroll-island',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
    'addDoc',
    'updateDoc',
    'deleteDoc',
    'ArbetslivLoggDelegate',
    'EconomyTidPanel',
  );

  console.log('[smoke:arbetsliv-superhub] Delegates…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivStamplaDelegate.tsx',
    'StampClockPage',
    'time_entries',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivFlexDelegate.tsx',
    'useWorkStats',
    'WorkWeekSummary',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivFlexDelegate.tsx',
    'EconomyTidPanel',
    'StampClockControls',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivInkomstDelegate.tsx',
    'addEconomyLedgerEntry',
    'economy_ledger',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivProfilDelegate.tsx',
    'Lönekontor',
    'usePayProfileSettings',
    'totalToBankSek',
    'Uppdatera kollektivavtal',
    'Uppdatera skattetabell',
  );
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivValvBroDelegate.tsx',
    "vaultDrawerPath('arbetsliv_lon')",
    "vaultDrawerPath('arbetsliv_franvaro')",
  );

  console.log('[smoke:arbetsliv-superhub] Legacy logg → ekonomi redirect…');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/components/ArbetslivHubPage.tsx',
    "legacyTab === 'logg'",
    'inputMode=logg',
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
    'ArbetslivFlexDelegate',
    'ArbetslivInkomstDelegate',
    'ArbetslivValvBroDelegate',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/arbetsliv/supermodule/index.ts',
    'ArbetslivLoggDelegate',
    'ArbetslivTidDelegate',
  );

  console.log('[smoke:arbetsliv-superhub] Protected paneler oförändrade…');
  mustInclude(
    'src/modules/features/admin/stampla/components/StampClockPage.tsx',
    'export function StampClockPage',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyLogPanel.tsx',
    'export function EconomyLogPanel',
  );

  console.log('[smoke:arbetsliv-superhub] PASS — Fas 14A split struktur.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:arbetsliv-superhub] FAIL:', err.message ?? err);
  process.exit(1);
}
