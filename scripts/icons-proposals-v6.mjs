/**
 * Chrome icon proposals v6 — Style A/B/C stroke variants.
 * Usage: npm run icons:proposals-v6 -- --style=nordic
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const styleArg = process.argv.find((a) => a.startsWith('--style='));
const style = styleArg?.split('=')[1] ?? 'nordic';

const STYLES = {
  nordic: {
    label: 'Nordic Precision',
    stroke: '#94a3b8',
    accent: '#38bdf8',
    note: 'Silver 1.5px line — D1/M2 locked until .context/locked-icons.md',
  },
  ember: {
    label: 'Ember Sanctuary',
    stroke: '#d4af37',
    accent: '#f59e0b',
    note: 'Warm copper fill — preview only',
  },
  aurora: {
    label: 'Aurora Prism',
    stroke: '#818cf8',
    accent: '#2dd4bf',
    note: 'Glass gradient stroke — preview only',
  },
};

const meta = STYLES[style];
if (!meta) {
  console.error(`Unknown style: ${style}. Use nordic | ember | aurora`);
  process.exit(1);
}

const outDir = resolve(root, 'docs/design/icons/v6-proposals', style);
mkdirSync(outDir, { recursive: true });

const manifest = {
  style,
  label: meta.label,
  stroke: meta.stroke,
  accent: meta.accent,
  note: meta.note,
  generatedAt: new Date().toISOString(),
  icons: ['drawer-l2', 'dock', 'widget', 'header'],
};

writeFileSync(resolve(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`[icons:proposals-v6] Style ${style} manifest → ${outDir}/manifest.json`);
console.log(`Note: ${meta.note}`);
