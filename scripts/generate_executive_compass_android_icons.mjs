#!/usr/bin/env node
/**
 * Executive compass app icon — crop, 3D polish, squircle mask, Android mipmaps.
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
const SIZE = 1024;
/** ~iOS/Motorola squircle corner radius */
const RX = Math.round(SIZE * 0.217);

const SRC = resolve(process.argv[2] ?? DEFAULT_SRC);
if (!SRC.startsWith(REPO)) {
  console.error('Källfil måste ligga i repo.');
  process.exit(1);
}

function squircleMaskSvg(size, rx, fill = 'white') {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${fill}"/>
    </svg>`,
  );
}

function rimHighlightSvg(size, rx) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffdf5" stop-opacity="0.95"/>
          <stop offset="22%" stop-color="#f0d080" stop-opacity="0.55"/>
          <stop offset="55%" stop-color="#000000" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
        </linearGradient>
        <linearGradient id="rimInner" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="${size - 3}" height="${size - 3}" rx="${rx - 1}" ry="${rx - 1}"
        fill="none" stroke="url(#rim)" stroke-width="9"/>
      <rect x="10" y="10" width="${size - 20}" height="${size - 20}" rx="${rx - 8}" ry="${rx - 8}"
        fill="none" stroke="url(#rimInner)" stroke-width="4"/>
    </svg>`,
  );
}

function innerDepthSvg(size, rx) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="depth" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
        </linearGradient>
        <linearGradient id="depthSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
          <stop offset="35%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.38"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="url(#depth)"/>
      <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="url(#depthSide)"/>
    </svg>`,
  );
}

function specularSvg(size, rx) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spec" cx="28%" cy="14%" r="52%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
          <stop offset="40%" stop-color="#fff8e0" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="spec2" cx="78%" cy="82%" r="38%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="url(#spec)"/>
      <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="url(#spec2)"/>
    </svg>`,
  );
}

async function extractSquare(srcPath) {
  const meta = await sharp(srcPath).metadata();
  const side = Math.min(meta.width ?? 0, meta.height ?? 0);
  const left = Math.floor(((meta.width ?? 0) - side) / 2);
  const top = Math.floor(((meta.height ?? 0) - side) / 2);
  /** Zoom ~5% — tightare runt squircle, mindre död kant */
  const inset = Math.round(side * 0.05);
  return sharp(srcPath)
    .extract({ left: left + inset, top: top + inset, width: side - inset * 2, height: side - inset * 2 })
    .resize(SIZE, SIZE, { fit: 'fill' })
    .png()
    .toBuffer();
}

async function buildEnhancedIcon(rawSquare) {
  const mask = await sharp(squircleMaskSvg(SIZE, RX)).png().toBuffer();

  const enhanced = await sharp(rawSquare)
    .modulate({ saturation: 1.18, brightness: 1.06 })
    .linear(1.14, -(128 * 0.14))
    .sharpen({ sigma: 1.45, m1: 0.85, m2: 3.0, x1: 2, y2: 16, y3: 42 })
    .png()
    .toBuffer();

  const clipped = await sharp(enhanced)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const shadowDeep = await sharp(squircleMaskSvg(SIZE, RX, '#000000'))
    .blur(48)
    .png()
    .toBuffer();

  const shadowTight = await sharp(squircleMaskSvg(SIZE, RX, '#000000'))
    .blur(18)
    .ensureAlpha()
    .linear(1, 0, { alpha: 0.55 })
    .png()
    .toBuffer();

  const goldGlow = await sharp(squircleMaskSvg(SIZE, RX, '#e8b84a'))
    .blur(28)
    .ensureAlpha()
    .linear(1, 0, { alpha: 0.32 })
    .png()
    .toBuffer();

  const emboss = await sharp(clipped)
    .modulate({ brightness: 0.35 })
    .blur(3)
    .png()
    .toBuffer();

  const rim = await sharp(rimHighlightSvg(SIZE, RX)).png().toBuffer();
  const depth = await sharp(innerDepthSvg(SIZE, RX)).png().toBuffer();
  const spec = await sharp(specularSvg(SIZE, RX)).png().toBuffer();

  const LIFT = -6;
  const SHADOW_Y = 44;

  const canvas = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: BG,
    },
  })
    .composite([
      { input: goldGlow, top: LIFT, left: 0, blend: 'screen' },
      { input: shadowDeep, top: SHADOW_Y, left: 0, blend: 'multiply' },
      { input: shadowTight, top: SHADOW_Y - 8, left: 2, blend: 'multiply' },
      { input: emboss, top: SHADOW_Y - 10, left: 6, blend: 'multiply' },
      { input: clipped, top: LIFT, left: 0 },
      { input: depth, top: LIFT, left: 0, blend: 'multiply' },
      { input: rim, top: LIFT, left: 0, blend: 'screen' },
      { input: spec, top: LIFT, left: 0, blend: 'screen' },
    ])
    .png()
    .toBuffer();

  const fgAlpha = await sharp(clipped)
    .composite([
      { input: depth, blend: 'multiply' },
      { input: rim, blend: 'screen' },
      { input: spec, blend: 'screen' },
    ])
    .png()
    .toBuffer();

  return { canvas, fgAlpha };
}

const rawSquare = await extractSquare(SRC);
const { canvas, fgAlpha } = await buildEnhancedIcon(rawSquare);

await sharp(canvas).toFile(CANON);

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
  await sharp(canvas).resize(size, size).png().toFile(resolve(dir, 'ic_launcher.png'));
  await sharp(canvas).resize(size, size).png().toFile(resolve(dir, 'ic_launcher_round.png'));
  await sharp(fgAlpha).resize(fg, fg).png().toFile(resolve(dir, 'ic_launcher_foreground.png'));
  console.log(`  OK mipmap-${density}`);
}

writeFileSync(
  resolve(RES, 'values/ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <!-- Executive compass app icon — matches squircle edge / Obsidian Calm -->\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`,
);

await sharp(canvas).resize(512, 512).png().toFile(resolve(REPO, 'public/icons/app-icon-512.png'));
await sharp(canvas).resize(192, 192).png().toFile(resolve(REPO, 'public/icons/app-icon-192.png'));

console.log('Klart:', CANON);
console.log('Bakgrund:', BG, '| squircle rx:', RX);
