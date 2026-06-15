/**
 * Static smoke: Arbetsliv hub locked wiring (Fas 14A).
 * Usage: npm run smoke:arbetsliv
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
  mustInclude('.context/locked-ux-features.md', 'Arbetsliv', '/arbetsliv', 'arbetsliv_forensic');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/components/ArbetslivHubPage.tsx',
    'ArbetslivHubPage',
    'arbetsliv_franvaro',
    'arbetsliv_lon',
    "legacyTab === 'logg'",
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultForensicPanel.tsx',
    'EconomyPayslipCard',
    'arbetsliv_franvaro',
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', "path: '/arbetsliv/input'", 'vardagen_arbetsliv');
  mustInclude('src/modules/core/navigation/navTruth.ts', 'arbetsliv_inkomster');
  mustNotInclude('src/modules/core/navigation/navTruth.ts', 'arbetsliv_logg');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyPage.tsx',
    'inputMode=logg',
    'EconomySavingsPanel',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyTidPanel',
  );

  console.log('[smoke:arbetsliv] PASS — hub, route, drawer, zon, Fas 14A split.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:arbetsliv] FAIL —', err.message || err);
  process.exit(1);
}
