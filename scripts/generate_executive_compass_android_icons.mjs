#!/usr/bin/env node
/**
 * Crop uploaded executive compass artwork → square 1024 PNG + Android mipmaps.
 * Usage: node scripts/generate_executive_compass_android_icons.mjs [source.png]
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const DEFAULT_SRC = resolve(REPO, 'docs/design/themes/app-icon-executive-compass-source.png');
const CANON = resolve(REPO, 'docs/design/themes/app-icon-executive-compass-1024.png');
const RES = resolve(REPO, 'android/app/src/main/res');
const BG = '#0D0B09';

const SRC = resolve(process.argv[2] ?? DEFAULT_SRC);
if (!SRC.startsWith(REPO)) {
  console.error('Källfil måste ligga i repo.');
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
const side = Math.min(meta.width ?? 0, meta.height ?? 0);
const left = Math.floor(((meta.width ?? 0) - side) / 2);
const top = Math.floor(((meta.height ?? 0) - side) / 2);

const square1024 = await sharp(SRC)
  .extract({ left, top, width: side, height: side })
  .resize(1024, 1024, { fit: 'fill' })
  .png()
  .toBuffer();

await sharp(square1024).toFile(CANON);

const densities = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

for (const [density, size, fg] of densities) {
  const dir = resolve(RES, `mipmap-${density}`);
  mkdirSync(dir, { recursive: true });
  await sharp(square1024).resize(size, size).png().toFile(resolve(dir, 'ic_launcher.png'));
  await sharp(square1024).resize(size, size).png().toFile(resolve(dir, 'ic_launcher_round.png'));
  await sharp(square1024).resize(fg, fg).png().toFile(resolve(dir, 'ic_launcher_foreground.png'));
  console.log(`  OK mipmap-${density}`);
}

writeFileSync(
  resolve(RES, 'values/ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <!-- Executive compass app icon — matches squircle edge / Obsidian Calm -->\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`,
);

await sharp(square1024).resize(512, 512).png().toFile(resolve(REPO, 'public/icons/app-icon-512.png'));
await sharp(square1024).resize(192, 192).png().toFile(resolve(REPO, 'public/icons/app-icon-192.png'));

console.log('Klart:', CANON);
console.log('Bakgrund:', BG);
