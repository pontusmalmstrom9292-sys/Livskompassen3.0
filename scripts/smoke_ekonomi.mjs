#!/usr/bin/env node
/**
 * Statiska guards — Ekonomi hub (impuls, logg, modulväljare). Fas 14A: ingen tid i ekonomi.
 * Usage: npm run smoke:ekonomi
 */
import { existsSync, readFileSync } from 'fs';
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

function main() {
  console.log('[smoke:ekonomi] Hub + impuls + logg (Fas 14A)…');

  mustInclude('src/modules/features/dailyLife/wellbeing/economy/ekonomiCopy.ts', 'EKONOMI_IMPULS_LEAD');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EkonomiModulValjare.tsx',
    "'impuls'",
    "'logg'",
    'LoggPreviewMini',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyLogPanel',
    'EconomyImpulsePanel',
    "activeTab === 'logg'",
  );
  mustNotInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyTidPanel',
    "activeTab === 'tid'",
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiLoggDelegate.tsx',
    'EconomyLogPanel',
    'scope="vardag"',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyImpulsePanel.tsx',
    'parkEconomyImpulse',
    '24h',
  );
  mustInclude('src/modules/core/firebase/economyFirestore.ts', 'parkEconomyImpulse');
  mustInclude('src/modules/core/firebase/arbetslivFirestore.ts', 'recordTimeIn');

  console.log('[smoke:ekonomi] PASS — Ekonomi logg + impulsparkering (ingen tid-flik).');
}

main();
