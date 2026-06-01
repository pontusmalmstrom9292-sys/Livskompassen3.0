/**
 * Static smoke: Arbetsliv hub locked wiring.
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

function main() {
  mustInclude('.context/locked-ux-features.md', 'Arbetsliv', '/arbetsliv', 'arbetsliv_forensic');
  mustInclude('docs/evaluations/2026-05-25-arbetsliv-hub.md', '/arbetsliv', 'arbetsliv_forensic');
  mustInclude(
    'src/modules/features/dailyLife/arbetsliv/components/ArbetslivHubPage.tsx',
    'ArbetslivHubPage',
    'legacyTabRedirects',
    'arbetsliv_franvaro',
    'arbetsliv_lon',
    'StampClockPage',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultForensicPanel.tsx',
    'VaultEconomyPanel',
    'arbetsliv_franvaro',
    'arbetsliv_lon',
  );
  mustInclude('src/modules/shell/LivShellPage.tsx', 'ArbetslivHubPage', "activeTab === 'arbetsliv'");
  mustInclude('src/modules/core/navigation/navTruth.ts', "path: '/liv?tab=arbetsliv'", 'liv_arbetsliv');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', '/liv/arbetsliv');
  mustInclude('src/modules/core/navigation/navTruth.ts', "path: '/arbetsliv'", 'liv_arbetsliv');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', '/liv', 'LivShellPage');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'ArbetslivHubPage');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', '/stampla', '/arbetsliv?tab=stampla');
  mustInclude(
    'src/modules/arbetsliv/components/ArbetslivHubPage.tsx',
    "paramKey: embeddedInLiv ? 'workTab' : 'tab'",
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', "id: 'arbetsliv'", "path: '/arbetsliv'", 'Arbetsliv');
  mustInclude('src/modules/core/navigation/drawerNav.ts', 'arbetsliv:', 'arbetsliv_stampla');
  mustInclude('src/modules/core/security/vaultZones.ts', 'arbetsliv_forensic');
  mustInclude('src/modules/core/navigation/headerPageLabel.ts', '/arbetsliv', 'Arbetsliv');

  console.log('[smoke:arbetsliv] PASS — hub, route, drawer, zon, locked register.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:arbetsliv] FAIL —', err.message || err);
  process.exit(1);
}
