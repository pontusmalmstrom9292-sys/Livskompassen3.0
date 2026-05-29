/**
 * P6 / P7 / P8 phone icons — squircle mask, optional alpha background removal.
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const themes = join(root, 'docs/design/themes');
const outDir = join(themes, 'phone-icon-variants');
const publicIcons = join(root, 'public/icons');

mkdirSync(outDir, { recursive: true });
mkdirSync(publicIcons, { recursive: true });

const SIZE = 1024;
const RX = Math.round(SIZE * 0.22);

function squircleMask() {
  const r = RX;
  const s = SIZE;
  return Buffer.from(
    `<svg width="${s}" height="${s}"><rect width="${s}" height="${s}" rx="${r}" ry="${r}" fill="white"/></svg>`,
  );
}

async function exportIcon({ src, destFull, destAlpha, darkenBg = true }) {
  if (!existsSync(src)) {
    console.warn('Missing', src);
    return;
  }
  const mask = await sharp(squircleMask()).png().toBuffer();
  const base = await sharp(src)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .toBuffer();

  await sharp(base)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(destFull);
  console.log('  full', destFull);

  if (destAlpha) {
    const { data, info } = await sharp(base).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = Buffer.from(data);
    if (darkenBg && ch >= 4) {
      for (let i = 0; i < px.length; i += ch) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const isDarkBg = lum < 72 && maxC - minC < 45;
        const isTealBg = lum < 100 && g > r + 8 && b > r + 5;
        if (isDarkBg || isTealBg) {
          px[i + 3] = 0;
        } else if (lum < 115 && maxC < 150) {
          px[i + 3] = Math.min(px[i + 3], Math.max(0, Math.round(((lum - 50) / 65) * 255)));
        }
      }
    }
    await sharp(px, { raw: { width: info.width, height: info.height, channels: ch } })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toFile(destAlpha);
    console.log('  alpha', destAlpha);
  }
}

async function main() {
  await exportIcon({
    src: join(themes, 'brand-gold-stack-2026-05-source.png'),
    destFull: join(outDir, 'P6-gold-emboss-full-1024.png'),
    destAlpha: null,
    darkenBg: false,
  });
  await sharp(join(outDir, 'P6-gold-emboss-full-1024.png'))
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .flatten({ background: { r: 2, g: 6, b: 23 } })
    .composite([{ input: await sharp(squircleMask()).png().toBuffer(), blend: 'dest-in' }])
    .png()
    .toFile(join(outDir, 'P6-gold-emboss-1024.png'));
  console.log('  P6-gold-emboss-1024.png');

  await exportIcon({
    src: join(themes, 'vault-sacred-3d-2026-05-source.png'),
    destFull: join(outDir, 'P7-vault-sacred-full-1024.png'),
    destAlpha: join(outDir, 'P7-vault-sacred-alpha-1024.png'),
    darkenBg: true,
  });

  await exportIcon({
    src: join(themes, 'hero-orbit-hub-2026-05-source.png'),
    destFull: join(outDir, 'P8-orbit-hub-full-1024.png'),
    destAlpha: join(outDir, 'P8-orbit-hub-alpha-1024.png'),
    darkenBg: true,
  });

  const p6 = join(outDir, 'P6-gold-emboss-1024.png');
  for (const [size, name] of [
    [512, 'app-icon-512.png'],
    [192, 'app-icon-192.png'],
    [180, 'apple-touch-icon.png'],
  ]) {
    await sharp(p6).resize(size, size).png().toFile(join(publicIcons, name));
    console.log('  public/icons/', name);
  }

  console.log('[export_phone_icon_variants] done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
