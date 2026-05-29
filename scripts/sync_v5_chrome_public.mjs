/**
 * Copy all v5 hub SVG styles to public/icons/chrome/v5-{g*}-{category}.svg
 */
import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const proposals = join(root, 'docs/design/icons-proposals/2026-05-29-gold-hub-v5');
const destDir = join(root, 'public/icons/chrome');
const STYLE_IDS = ['g1-wire', 'g2-emboss-3d', 'g3-aurora', 'g4-ember', 'g5-obsidian'];
const STYLE_SHORT = ['g1', 'g2', 'g3', 'g4', 'g5'];

mkdirSync(destDir, { recursive: true });

for (let i = 0; i < STYLE_IDS.length; i++) {
  const srcDir = join(proposals, STYLE_IDS[i]);
  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith('.svg')) continue;
    const cat = file.replace('.svg', '');
    const dest = join(destDir, `v5-${STYLE_SHORT[i]}-${cat}.svg`);
    copyFileSync(join(srcDir, file), dest);
  }
}
console.log('[sync_v5_chrome_public] copied 5×14 icons');
