/**
 * Smoke: Kompass utvecklings-deck — katalog, rotation, bankId parity.
 * Usage: npm run smoke:discovery-deck
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
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

function extractBankIdsFromCatalog(text) {
  const ids = new Set();
  const re = /bankIds:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    for (const id of match[1].match(/'[^']+'/g) ?? []) {
      ids.add(id.replace(/'/g, ''));
    }
  }
  return [...ids];
}

function main() {
  const catalogPath =
    'src/modules/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog.ts';
  const catalog = read(catalogPath);

  mustInclude(catalogPath, 'DISCOVERY_BENTO_CATALOG', 'ha_kul', 'min_uppgift');
  assert(
    (catalog.match(/id: '/g) ?? []).length === 12,
    'discoveryBentoCatalog måste ha 12 kategorier',
  );

  const bankIds = extractBankIdsFromCatalog(catalog);
  assert(bankIds.length >= 36, `för få bankIds i katalog (${bankIds.length})`);

  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/lib/pickDiscoveryCard.ts',
    'pickDiscoveryCard',
    'fnv1a',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/lib/discoveryBankResolver.ts',
    'resolveDiscoveryBankCard',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryDeck.tsx',
    'KompassDiscoveryDeck',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryCardFlow.tsx',
    'saveVitEntry',
    'kompass_discovery',
    'MabraVitEvidencePrompt',
  );
  mustInclude(
    'src/modules/core/ui/forge/OdForgeKompassSuperHub.tsx',
    'Utforska',
    'od-forge__superhub-widget-rail',
  );
  mustInclude(
    'src/modules/core/home/HomeAdaptiveCompass.tsx',
    'HomeKompassDiscoverySection',
    'isOdForgeBridgeActive',
    'CompassQuickWidgetRail',
  );
  mustInclude(
    'src/modules/core/home/HomeKompassDiscoverySection.tsx',
    'KompassDiscoveryDeck',
    'KompassDiscoveryCardFlow',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/config/compassWidgetCatalog.ts',
    'Stäng dagen',
    'Nästa steg',
    'Ett litet steg',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryDeck.tsx',
    'streak',
    'XP',
  );

  mustInclude(
    'src/modules/core/home/HomeForgeKompassBridge.tsx',
    'navigate(w.href)',
  );

  const reflectionCards = read(
    'src/modules/features/dailyLife/wellbeing/mabra/content/mabraReflectionCards.ts',
  );
  const dagligMix = read(
    'src/modules/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog.ts',
  );
  const coachBank = read(
    'src/modules/features/dailyLife/wellbeing/compasses/content/discoveryCoachBank.ts',
  );
  const extendedPlays = read(
    'src/modules/features/dailyLife/wellbeing/mabra/content/mabraExtendedPlays.ts',
  );
  const pool = `${reflectionCards}\n${dagligMix}\n${coachBank}\n${extendedPlays}`;

  for (const bankId of bankIds) {
    assert(pool.includes(bankId), `bankId ${bankId} saknas i KEEP-pool`);
  }

  console.log(
    `[smoke:discovery-deck] PASS — 12 kategorier, ${bankIds.length} bankIds, rotation + Vit-spar.`,
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:discovery-deck] FAIL —', err.message || err);
  process.exit(1);
}
