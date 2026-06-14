#!/usr/bin/env node
/**
 * Statiska guards — Ekonomi hub (impuls, tid, modulväljare).
 * Usage: npm run smoke:ekonomi
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
  console.log('[smoke:ekonomi] Hub + impuls + tid…');

  mustInclude('src/modules/features/dailyLife/wellbeing/economy/ekonomiCopy.ts', 'EKONOMI_IMPULS_LEAD', 'EKONOMI_TID_LEAD');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EkonomiModulValjare.tsx',
    "'impuls'",
    "'spar'",
    "'tid'",
    'TidPreviewMini',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyTidPanel',
    'EconomyImpulsePanel',
    'activeTab === \'tid\'',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/TimeAndPayPanel.tsx',
    'useStampClock',
    'StampClockControls',
    'Snabb stämpel',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyImpulsePanel.tsx',
    'parkEconomyImpulse',
    '24h',
  );
  mustInclude('src/modules/core/firebase/economyFirestore.ts', 'parkEconomyImpulse');
  mustInclude('src/modules/core/firebase/arbetslivFirestore.ts', 'recordTimeIn');

  console.log('[smoke:ekonomi] PASS — Ekonomi tid + impulsparkering.');
}

main();
