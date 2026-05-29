#!/usr/bin/env node
/**
 * Export K01–K10 SVG → preview PNG (390w).
 * Usage: node scripts/export_kognitiv_skold_previews.mjs [K01-sjo-solnedgang]
 */
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgDir = resolve(root, 'docs/design/themes/kognitiv-skold-variants/svg');
const outDir = resolve(root, 'docs/design/themes/kognitiv-skold-variants/preview');

const only = process.argv[2];
const files = only
  ? [`${only}.svg`]
  : readdirSync(svgDir).filter((f) => f.endsWith('.svg')).sort();

for (const file of files) {
  const id = file.replace(/\.svg$/, '');
  const svg = join(svgDir, file);
  const outPng = join(outDir, `${id}-preview.png`);
  const thumb = join(outDir, `${file}.png`);
  if (!existsSync(svg)) {
    console.error('Saknar:', svg);
    process.exit(1);
  }
  execSync(`qlmanage -t -s 390 -o "${outDir}" "${svg}"`, { stdio: 'ignore' });
  execSync(`mv "${thumb}" "${outPng}"`, { stdio: 'ignore' });
  console.log('Preview:', outPng);
}
