/**
 * Locked product icons D1 / M2 / WH1 / WH2 must remain in source. B1 app icon is unlocked.
 * Usage: npm run smoke:locked-icons
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
  assert(existsSync(resolve(root, '.context/locked-icons.md')), 'saknar .context/locked-icons.md');
  assert(existsSync(resolve(root, 'docs/design/ICON-STYLE-GUIDE.md')), 'saknar ICON-STYLE-GUIDE.md');

  mustInclude('src/modules/core/ui/LivskompassMark.tsx', '@locked ICON-D1', 'Gold stack', 'lk-gold-stack-');
  mustInclude('src/modules/features/lifeJournal/evidence/kompis/components/KompisMark.tsx', '@locked ICON-M2', 'Orakelöga', 'km2g-');
  mustInclude('src/modules/features/lifeJournal/evidence/kompis/components/KompisAvatar.tsx', 'KompisMark');
  mustNotInclude('src/modules/features/lifeJournal/evidence/kompis/components/KompisAvatar.tsx', 'LivskompassMark');

  mustNotInclude('public/favicon.svg', '#863bff', '7e14ff');

  // WH1 / WH2 — Fyren inspelning + anteckning (glyph-lås 2026-06-14)
  mustInclude(
    'src/modules/core/ui/widget-icons/FyrenShortcutMicIcon.tsx',
    '@locked ICON-WH1',
    'grad-fyren-mic-',
    'M7 12.5a5 5 0 0 0 10 0',
  );
  mustInclude(
    'src/modules/core/ui/widget-icons/FyrenShortcutNoteIcon.tsx',
    '@locked ICON-WH2',
    'grad-fyren-note-',
    'M16 13.5l-3.5 3.5',
  );
  mustInclude(
    'src/modules/core/components/FyrenWidgetBar.tsx',
    'FyrenShortcutMicIcon',
    'FyrenShortcutNoteIcon',
    "widgetIcon: 'mic'",
    "widgetIcon: 'note'",
  );
  mustNotInclude('src/modules/core/components/FyrenWidgetBar.tsx', 'shortcutSrc', 'wh-inspelning.svg');
  mustInclude('public/icons/drawer-l2/drawer-inspelning.svg', 'rx="2.75"', 'M7 12.5a5 5 0 0 0 10 0');
  mustInclude('public/icons/drawer-l2/drawer-anteckning.svg', 'M16 13.5l-3.5 3.5', 'M7.5 5.5h6.5');
  mustInclude('public/icons/shortcuts/wh-inspelning.svg', 'WH1 — inspelning', 'rx="5.5"');
  mustInclude('public/icons/shortcuts/wh-anteckning.svg', 'WH2 — anteckning', 'M32 27l-7 7');
  mustNotInclude('public/icons/shortcuts/wh-inspelning.svg', 'J1 — D1 skiva + dagbok');
  mustNotInclude('public/icons/shortcuts/wh-anteckning.svg', 'J1 — D1 skiva + dagbok');

  assert(
    existsSync(resolve(root, 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')),
    'saknar mipmap launcher',
  );

  console.log(
    '[smoke:locked-icons] PASS — D1 LivskompassMark, M2 KompisMark, WH1/WH2 Fyren (B1 app icon unlocked).',
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:locked-icons] FAIL —', err.message || err);
  process.exit(1);
}
