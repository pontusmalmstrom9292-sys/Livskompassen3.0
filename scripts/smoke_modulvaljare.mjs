#!/usr/bin/env node
/**
 * Statiska guards — modulväljare-rollout (ExamplePreviewCard + 6 zoner).
 * Usage: npm run smoke:modulvaljare
 */
import { existsSync, readFileSync } from 'fs';
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
  console.log('[smoke:modulvaljare] Statiska guards...');

  mustInclude('src/modules/shared/ui/ExamplePreviewCard.tsx', 'planering-tool-card', 'ExamplePreviewCard');
  mustInclude(
    'src/modules/features/admin/planning/components/GoraModulValjare.tsx',
    'ExamplePreviewCard',
    'markGoraModulValjareSeen',
  );

  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EkonomiModulValjare.tsx',
    "'impuls'",
    "'logg'",
    'LoggPreviewMini',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EkonomiModulValjare',
    'hasSeenEkonomiModulValjare',
  );

  mustInclude('src/modules/shell/LivLauncherGrid.tsx', 'LIV_LAUNCHER_PREVIEWS');
  mustInclude('src/modules/shell/livLauncherPreviews.tsx', 'LIV_LAUNCHER_PREVIEWS', 'liv-launcher-card__preview');

  mustInclude(
    'src/modules/capture/components/HemCaptureModulValjare.tsx',
    'ExamplePreviewCard',
    'markHemCaptureModulValjareSeen',
  );
  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    'HemCaptureModulValjare',
    'hasSeenHemCaptureModulValjare',
    "variant === 'hem-capture'",
    'Byt ingång',
  );

  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/lib/mabra30Pillars.ts',
    'MABRA_30_PILLARS',
    'explore_weekly',
    'recovery',
    'disabled: true',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/MabraModulValjare.tsx',
    'ExamplePreviewCard',
    'MABRA_30_PILLARS',
    'markMabraModulValjareSeen',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/views/MabraHubView.tsx',
    'MabraModulValjare',
    'handleModulChoice',
    'showHubPicker',
  );

  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/ValvZoneModulValjare.tsx',
    'ExamplePreviewCard',
    'markValvZoneModulValjareSeen',
    'ValvZoneModulValjare',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvAnalyseraZone.tsx',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
  );

  mustInclude(
    'src/modules/features/admin/projects/components/ProjektTomStatePanel.tsx',
    'ExamplePreviewCard',
    'ProjektPickerSheet',
  );
  mustInclude(
    'src/modules/features/admin/projects/components/ProjektHubPage.tsx',
    'ProjektTomStatePanel',
    'GoraHubTabBar',
  );

  console.log('[smoke:modulvaljare] PASS');
}

main();
