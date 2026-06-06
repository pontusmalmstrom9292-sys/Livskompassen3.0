/**
 * Static smoke: Smart Inkast vardagsbro — Hem → capture → granskningskö.
 * Usage: npm run smoke:inkast-vardag
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
  console.log('[smoke:inkast-vardag] Hem-kompass + inkast…');

  mustInclude(
    'src/modules/core/home/HomeAdaptiveCompass.tsx',
    "materialEnabled(preset, 'home_inkast')",
    'CaptureSuperModule',
    "variant=\"kompass\"",
    'id="inkast-lite"',
    'inkastSectionRef',
  );

  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    'ReviewQueuePipelinePanel',
    "variant === 'kompass'",
    'refreshToken={queueRefresh}',
    'handleCaptureSaved',
    'CapturePanel',
  );

  mustInclude(
    'src/modules/capture/ReviewQueuePipelinePanel.tsx',
    'refreshToken',
    'VALV_SAMLA_GRANSKA_LINK',
    'listDraftsByStatus',
  );

  mustInclude(
    'src/modules/capture/CapturePanel.tsx',
    'InkastConfirmPanel',
    'previewInboxClassification',
    'submitInkastLite',
    'inkastDestinationLink',
    'VALV_SAMLA_GRANSKA_LINK',
  );

  mustInclude(
    'src/modules/core/components/FyrenWidgetBar.tsx',
    '/#inkast-lite',
  );

  mustInclude(
    'src/modules/core/layout/drawerFromNavTruth.ts',
    '/#inkast-lite',
  );

  mustInclude('src/modules/core/lifeOs/lifeHubPresets.ts', 'home_inkast: true', 'home_hero_checkin: true');

  console.log('[smoke:inkast-vardag] PASS — Hem Smart Inkast + kö + deep links.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:inkast-vardag] FAIL:', err.message ?? err);
  process.exit(1);
}
