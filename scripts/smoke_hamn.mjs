#!/usr/bin/env node
/**
 * Statiska guards — Trygg Hamn / Familjehubben BIFF (Grey Rock, brusfilter, embedded).
 * Usage: npm run smoke:hamn
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
  console.log('[smoke:hamn] Statiska guards...');

  mustInclude('src/modules/features/family/safeHarbor/hamnCopy.ts', 'HAMN_GREY_ROCK_LEAD', 'Zero Footprint');
  mustInclude(
    'src/modules/features/family/safeHarbor/components/BiffPublicPanel.tsx',
    'BiffTriagePanel',
    'gransAnalysis',
    'handleKlar',
    'sourceModule: \'hamn_biff\'',
  );
  mustInclude(
    'src/modules/features/family/safeHarbor/components/TryggHamnHub.tsx',
    'HamnModuleStack',
    'embedded',
    'HAMN_BRUSFILTER_LEAD',
  );
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    "activeTab === 'hamn'",
    'SafeHarborPage embedded',
  );
  mustInclude(
    'src/modules/features/family/safeHarbor/components/HamnModuleStack.tsx',
    'BIFF · Grey Rock',
    'biffPanel',
  );
  mustInclude('functions/src/lib/inboxClassifier.ts', 'hamn_biff', 'reality_vault');

  const speglar = read('src/modules/features/lifeJournal/diary/mirror/components/SpeglingsSystem.tsx');
  assert(
    speglar.includes('/familjen?tab=hamn') && speglar.includes('prefilledMessage'),
    'Speglar-bro till Familjen hamn saknas',
  );

  console.log('[smoke:hamn] PASS — Trygg Hamn Familjehubben.');
}

main();
