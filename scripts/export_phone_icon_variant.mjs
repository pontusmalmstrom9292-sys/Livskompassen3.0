#!/usr/bin/env node
/**
 * Export phone icon SVG → 1024 PNG (macOS qlmanage or sips via rsvg — fallback copy note).
 * Usage: node scripts/export_phone_icon_variant.mjs P3-aurora-rim
 */
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const id = process.argv[2];

if (!id) {
  console.error('Ange variant, t.ex. P3-aurora-rim');
  process.exit(1);
}

const svg = resolve(root, `docs/design/themes/phone-icon-variants/${id}.svg`);
const outDir = resolve(root, 'docs/design/themes');
const outPng = resolve(outDir, `app-icon-phone-${id}-1024.png`);

if (!existsSync(svg)) {
  console.error('Saknar:', svg);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

try {
  const thumb = join(outDir, `${id}.svg.png`);
  execSync(`qlmanage -t -s 1024 -o "${outDir}" "${svg}"`, { stdio: 'ignore' });
  execSync(`mv "${thumb}" "${outPng}"`, { stdio: 'ignore' });
  console.log('Skapade:', outPng);
  console.log('Kör: npm run android:icons:phone --', outPng);
} catch {
  console.error('qlmanage misslyckades. Öppna preview.html och exportera manuellt, eller installera librsvg.');
  copyFileSync(svg, resolve(outDir, `${id}.svg`));
  console.log('Kopierade SVG till docs/design/themes/ för manuell export.');
}
