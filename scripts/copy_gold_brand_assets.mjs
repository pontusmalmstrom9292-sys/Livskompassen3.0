/**
 * Copy Cursor asset PNGs into docs/design/themes kanon paths.
 */
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const assetsDir =
  process.env.LK_ASSETS_DIR ||
  join(process.env.HOME || '', '.cursor/projects/Users-Livskompassen-StudioProjects-Livskompassen3-0/assets');

const MAP = [
  ['image-e26792da-303f-475d-b344-6aa75b9c1213.png', 'docs/design/themes/brand-gold-stack-2026-05-source.png'],
  ['image-ce88e789-39a9-4afc-b698-fe581320f325.png', 'docs/design/themes/hub-gold-row-2026-05-source.png'],
  ['image-f0e48155-00f5-4971-9819-b150b0a090e9.png', 'docs/design/themes/vault-sacred-3d-2026-05-source.png'],
  ['image-8cb71fed-9a23-4d2c-a792-dc3f4834425b.png', 'docs/design/themes/hero-orbit-hub-2026-05-source.png'],
];

const archiveD1 = join(root, 'docs/design/themes/locked-premium-b1-d1-m2/d1-helros-2026-05-26-archive.tsx');
const d1Src = join(root, 'src/modules/core/ui/LivskompassMark.tsx');

mkdirSync(join(root, 'docs/design/themes/locked-premium-b1-d1-m2'), { recursive: true });

if (!existsSync(archiveD1)) {
  writeFileSync(archiveD1, readFileSync(d1Src, 'utf8'));
  console.log('Archived D1 →', archiveD1);
}

for (const [srcName, destRel] of MAP) {
  const src = join(assetsDir, srcName);
  const dest = join(root, destRel);
  mkdirSync(dirname(dest), { recursive: true });
  if (!existsSync(src)) {
    console.warn('SKIP missing:', src);
    continue;
  }
  copyFileSync(src, dest);
  console.log('OK', destRel);
}

console.log('[copy_gold_brand_assets] done');
