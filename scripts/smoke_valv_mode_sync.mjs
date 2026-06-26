/**
 * Valv Fas 1A — valvMode ↔ vaultTab URL-synk (statisk smoke).
 * Usage: npm run smoke:valv-mode
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
    assert(text.includes(needle), `${relPath}: saknar ${needle}`);
  }
}

function main() {
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/supermodule/valvInputModes.ts',
    'canonicalValvRoute',
    'buildValvSearchParams',
    'parseValvInputModeFromSearch',
    "if (mode === 'granska') return 'logga'",
    'LEGACY_INBOX_VAULT_TAB',
  );
  mustInclude(
    'src/modules/core/pages/ValvetRoutePage.tsx',
    'canonicalValvRoute',
    'resolveValvInputModeFromVaultTab',
    'vaultTabForValvInputMode',
    "params.set('valvMode'",
    "params.delete('samlaView')",
    'LEGACY_INBOX_VAULT_TAB',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx',
    'canonicalValvRoute',
    'ValvInputSuperModule',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/supermodule/ValvInputSuperModule.tsx',
    'ValvInputModePicker',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/supermodule/valvInputModes.ts',
    'VALV_INPUT_MODES_MORE',
    "label: 'Inkast'",
  );
  mustInclude(
    'src/modules/core/navigation/navTruth.ts',
    'valv_granska',
    'valvMode=granska',
    'vaultTabForValvInputMode',
    'resolveValvInputModeFromVaultTab',
  );
  mustInclude('src/modules/core/copy/valvNavCopy.ts', "sok: 'Sök i arkiv'");

  const zones = read('src/modules/features/lifeJournal/evidence/vault/utils/vaultTabs.ts');
  assert(
    !zones.includes("'inbox',") && !zones.includes("'inbox' ]"),
    'vaultTabs.ts: inbox ska inte finnas i VALV_ZONE_VISIBLE_IDS',
  );

  const drawer = read('src/modules/core/navigation/navTruth.ts');
  assert(
    drawer.includes('valvMode=analysera') || drawer.includes('valvMode='),
    'navTruth.ts: vaultDrawerPath ska inkludera valvMode',
  );

  console.log('[smoke:valv-mode] PASS — Valv Fas 1A–1B (URL-synk + tier-växlare).');
}

main();
