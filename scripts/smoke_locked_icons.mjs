/**
 * Locked product icons D1 / M2 must remain in source. B1 app icon is unlocked.
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

  mustInclude('src/modules/core/ui/LivskompassMark.tsx', '@locked ICON-D1', 'Helros', 'lk-disk-');
  mustInclude('src/modules/evidence/kompis/components/KompisMark.tsx', '@locked ICON-M2', 'Orakelöga', 'km2g-');
  mustInclude('src/modules/evidence/kompis/components/KompisAvatar.tsx', 'KompisMark');
  mustNotInclude('src/modules/evidence/kompis/components/KompisAvatar.tsx', 'LivskompassMark');

  mustNotInclude('public/favicon.svg', '#863bff', '7e14ff');

  assert(
    existsSync(resolve(root, 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')),
    'saknar mipmap launcher',
  );

  console.log('[smoke:locked-icons] PASS — D1 LivskompassMark, M2 KompisMark (B1 app icon unlocked).');
}

try {
  main();
} catch (err) {
  console.error('[smoke:locked-icons] FAIL —', err.message || err);
  process.exit(1);
}
