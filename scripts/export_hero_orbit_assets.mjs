/**
 * H1 hero-orbit derivatives from source PNG.
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'docs/design/themes/hero-orbit-hub-2026-05-source.png');
const out = join(root, 'docs/design/hero-orbit');
const icons = join(out, 'icons');

mkdirSync(icons, { recursive: true });

async function removeDarkBg(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = new Uint8Array(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 55) px[i + 3] = 0;
    else if (lum < 100) px[i + 3] = Math.round(((lum - 55) / 45) * px[i + 3]);
  }
  return sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function main() {
  if (!existsSync(src)) {
    console.warn('Missing hero source — run copy_gold_brand_assets first');
    process.exit(1);
  }

  const meta = await sharp(src).metadata();
  const w = meta.width || 1024;
  const h = meta.height || 1024;

  await sharp(src).resize(1920, 1080, { fit: 'inside' }).png().toFile(join(out, 'h1-orbit-hub-full-1920.png'));
  console.log('h1-orbit-hub-full-1920.png');

  const alphaBuf = await removeDarkBg(src);
  await alphaBuf.resize(1920, 1080, { fit: 'inside' }).png().toFile(join(out, 'h1-orbit-hub-alpha-1920.png'));
  console.log('h1-orbit-hub-alpha-1920.png');

  const cx = Math.round(w * 0.5);
  const cy = Math.round(h * 0.48);
  const half = Math.round(Math.min(w, h) * 0.22);
  await sharp(src)
    .extract({
      left: Math.max(0, cx - half),
      top: Math.max(0, cy - half),
      width: Math.min(half * 2, w),
      height: Math.min(half * 2, h),
    })
    .resize(512, 512)
    .png()
    .toFile(join(out, 'h1-compass-center-512.png'));
  console.log('h1-compass-center-512.png');

  await sharp(src)
    .resize(512, 512, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.35, saturation: 0.2 })
    .blur(2)
    .webp({ quality: 82 })
    .toFile(join(out, 'h1-obsidian-radial.webp'));
  console.log('h1-obsidian-radial.webp');

  await sharp(src)
    .resize(512, 512, { fit: 'cover', position: 'centre' })
    .greyscale()
    .modulate({ brightness: 0.4 })
    .png()
    .toFile(join(out, 'h1-celestial-web-tile-512.png'));
  console.log('h1-celestial-web-tile-512.png');

  const crops = [
    ['rutiner', 0.5, 0.12],
    ['kunskap', 0.78, 0.22],
    ['mabra', 0.88, 0.5],
    ['ekonomi', 0.5, 0.88],
    ['valv', 0.5, 0.5],
  ];
  for (const [name, nx, ny] of crops) {
    const size = Math.round(Math.min(w, h) * 0.14);
    const left = Math.max(0, Math.round(w * nx - size / 2));
    const top = Math.max(0, Math.round(h * ny - size / 2));
    await sharp(src)
      .extract({
        left,
        top,
        width: Math.min(size, w - left),
        height: Math.min(size, h - top),
      })
      .resize(128, 128)
      .png()
      .toFile(join(icons, `h1-${name}.png`));
    console.log('icons/h1-' + name + '.png');
  }

  console.log('[export_hero_orbit_assets] done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
