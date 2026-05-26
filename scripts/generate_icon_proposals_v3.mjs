/**
 * Generates 50 premium icon proposal SVGs (5 chassis × 10 categories).
 * Style DNA: LivskompassMark D1 / Kompis M3 / hero disk (teal–obsidian, guld, eld-glöd).
 * Output: docs/design/icons-proposals/2026-05-26-v3-chassis/
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs/design/icons-proposals/2026-05-26-v3-chassis');

const CHASSIS = [
  {
    id: 'helros',
    name: 'Helros',
    extra: (g, f, gl) => `
  <circle cx="24" cy="24" r="18" stroke="url(#${g})" stroke-opacity="0.28" stroke-width="0.55" stroke-dasharray="2 3"/>
  <circle cx="24" cy="24" r="14" stroke="url(#${g})" stroke-opacity="0.14" stroke-width="0.45"/>
  <circle cx="24" cy="24" r="9.5" stroke="url(#${g})" stroke-opacity="0.1" stroke-width="0.35" fill="none"/>
  <g stroke="url(#${g})" stroke-opacity="0.11" stroke-width="0.35">
    <line x1="24" y1="8" x2="24" y2="40"/><line x1="8" y1="24" x2="40" y2="24"/>
    <line x1="12.7" y1="12.7" x2="35.3" y2="35.3"/><line x1="35.3" y1="12.7" x2="12.7" y2="35.3"/>
  </g>
  <circle cx="32" cy="14" r="1.6" fill="#fff8e0" opacity="0.85" filter="url(#${gl})"/>
  <path d="M32 14 L30.6 15.4 L32 16.8 L33.4 15.4 Z" fill="url(#${f})" opacity="0.8"/>`,
  },
  {
    id: 'stjarna',
    name: 'Stjärn-eld',
    extra: (g, f, gl) => `
  <polygon points="24,5 25.8,12 33,12 27.2,16.5 29.5,24 24,19.5 18.5,24 20.8,16.5 15,12 22.2,12" fill="none" stroke="url(#${g})" stroke-width="0.45" stroke-opacity="0.35"/>
  <circle cx="30" cy="11" r="2.2" fill="#fff8e0" filter="url(#${gl})"/>
  <path d="M24 7 L25.5 16 L24 20 L22.5 16 Z" fill="url(#${f})" opacity="0.55" filter="url(#${gl})"/>`,
  },
  {
    id: 'sacred',
    name: 'Sacred grid',
    extra: (g, f, gl) => `
  <g stroke="url(#${g})" stroke-opacity="0.18" stroke-width="0.28">
    ${[0, 30, 60, 90, 120, 150].map((d) => `<line x1="24" y1="24" x2="24" y2="7" transform="rotate(${d} 24 24)"/>`).join('')}
  </g>
  <circle cx="24" cy="24" r="16" stroke="url(#${g})" stroke-opacity="0.2" stroke-width="0.4" stroke-dasharray="1 4" fill="none"/>
  <circle cx="33" cy="13" r="1.4" fill="#fff8e0" filter="url(#${gl})"/>`,
  },
  {
    id: 'pansar',
    name: 'Pansar-ringar',
    extra: (g, f, gl) => `
  <circle cx="24" cy="24" r="19" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.5" fill="none"/>
  <circle cx="24" cy="24" r="15.5" stroke="url(#${g})" stroke-opacity="0.22" stroke-width="0.4" stroke-dasharray="3 5" fill="none"/>
  <circle cx="24" cy="24" r="11.5" stroke="url(#${g})" stroke-opacity="0.14" stroke-width="0.35" fill="none"/>
  <circle cx="31" cy="12" r="1.5" fill="url(#${f})" filter="url(#${gl})"/>`,
  },
  {
    id: 'eldnal',
    name: 'Eldnål',
    extra: (g, f, gl) => `
  <path d="M24 5 L27 20 L24 23 L21 20 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <path d="M24 43 L21 28 L24 25 L27 28 Z" fill="url(#${g})" fill-opacity="0.25"/>
  <circle cx="31" cy="14" r="2" fill="#fff8e0" opacity="0.9" filter="url(#${gl})"/>
  <circle cx="24" cy="24" r="16" stroke="url(#${g})" stroke-opacity="0.12" stroke-width="0.35" fill="none"/>`,
  },
];

/** Center glyphs per category (48 viewBox, center ~24,24) */
const GLYPHS = {
  familjen: (g, f) => `
  <circle cx="11" cy="14" r="2.8" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.2"/>
  <circle cx="24" cy="12" r="3.2" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.28"/>
  <circle cx="37" cy="14" r="2.8" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M8 28 Q24 22 40 28 Q24 34 8 28" stroke="url(#${g})" stroke-width="0.75" fill="url(#${g})" fill-opacity="0.12"/>
  <circle cx="24" cy="22" r="1.2" fill="url(#${f})" opacity="0.9"/>`,
  hamn: (g, f) => `
  <path d="M24 10 L28 18 L24 16 L20 18 Z" fill="url(#${f})" opacity="0.85"/>
  <path d="M16 20 H32 V22 H16 Z" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.15"/>
  <path d="M18 22 V34 M30 22 V34" stroke="url(#${g})" stroke-width="0.85" stroke-linecap="round"/>
  <path d="M14 34 H34" stroke="url(#${g})" stroke-width="0.9" stroke-linecap="round"/>`,
  valv: (g, f) => `
  <path d="M10 22 V34 H38 V22" stroke="url(#${g})" stroke-width="0.85" stroke-linejoin="round" fill="none"/>
  <path d="M10 22 Q24 8 38 22" stroke="url(#${g})" stroke-width="0.85" fill="none"/>
  <path d="M17 34 V26 H31 V34" stroke="url(#${g})" stroke-width="0.65"/>
  <circle cx="24" cy="20" r="1.1" fill="url(#${f})"/>`,
  dagbok: (g, f) => `
  <path d="M12 12 H20 V32 H12 Q10 22 12 12 Z" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.12"/>
  <path d="M36 12 H28 V32 H36 Q38 22 36 12 Z" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M20 12 V32" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.45"/>
  <circle cx="30" cy="20" r="3.5" stroke="url(#${g})" stroke-width="0.4" fill="none" opacity="0.5"/>
  <path d="M30 17.2 L30.6 20 L30 21.5 L29.4 20 Z" fill="url(#${f})"/>`,
  planering: (g, f) => `
  <rect x="9" y="14" width="5" height="14" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.14"/>
  <rect x="16.5" y="11" width="5" height="17" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.22"/>
  <rect x="24" y="16" width="5" height="12" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.1"/>
  <circle cx="31" cy="13" r="1.3" fill="url(#${f})"/>`,
  mabra: (g, f) => `
  <path d="M24 30 Q18 22 20 16 Q22 12 24 14 Q26 12 28 16 Q30 22 24 30" stroke="url(#${g})" stroke-width="0.85" fill="url(#${g})" fill-opacity="0.18"/>
  <path d="M24 14 L24 10 M20 16 L17 14 M28 16 L31 14" stroke="url(#${g})" stroke-width="0.45" stroke-linecap="round"/>
  <circle cx="24" cy="26" r="1.8" fill="url(#${f})" opacity="0.9"/>`,
  rutiner: (g, f) => `
  <circle cx="24" cy="22" r="9" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.08"/>
  <path d="M18 22 L21.5 25.5 L30 17" stroke="url(#${g})" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M15 12 H33 M15 32 H27" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.55" stroke-linecap="round"/>
  <circle cx="24" cy="10" r="1.2" fill="url(#${f})"/>`,
  ekonomi: (g, f) => `
  <ellipse cx="16" cy="19" rx="4.5" ry="2.4" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.12"/>
  <ellipse cx="32" cy="23" rx="4.5" ry="2.4" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.2"/>
  <circle cx="32" cy="18" r="2.2" fill="url(#${f})"/>
  <circle cx="16" cy="24" r="2.2" fill="url(#${g})" fill-opacity="0.45"/>
  <path d="M12 28 H36" stroke="url(#${g})" stroke-opacity="0.25" stroke-width="0.45"/>`,
  utveckling: (g, f) => `
  <path d="M24 28 Q20 20 22 14 Q24 10 26 14 Q28 20 24 28" stroke="url(#${g})" stroke-width="0.75" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M24 28 Q28 20 30 16 Q32 14 30 18 Q28 22 24 28" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.14"/>
  <path d="M24 28 Q16 20 14 16 Q12 14 14 18 Q16 22 24 28" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.14"/>
  <circle cx="24" cy="12" r="1.5" fill="url(#${f})"/>`,
  kunskap: (g, f) => `
  <path d="M11 13 H17 V31 H11 Q9.5 22 11 13 Z" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.1"/>
  <path d="M37 13 H31 V31 H37 Q38.5 22 37 13 Z" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.16"/>
  <path d="M17 13 V31" stroke="url(#${g})" stroke-opacity="0.3" stroke-width="0.4"/>
  <circle cx="28" cy="22" r="5" stroke="url(#${g})" stroke-width="0.45" fill="none" opacity="0.45"/>
  <path d="M28 18.5 L29 22 L28 24.5 L27 22 Z" fill="url(#${f})"/>`,
};

const CATEGORIES = [
  { dir: 'familjen', prefix: 'F', key: 'familjen' },
  { dir: 'hamn', prefix: 'H', key: 'hamn' },
  { dir: 'valv', prefix: 'V', key: 'valv' },
  { dir: 'dagbok', prefix: 'J', key: 'dagbok' },
  { dir: 'planering', prefix: 'P', key: 'planering' },
  { dir: 'mabra', prefix: 'A', key: 'mabra' },
  { dir: 'hero/rutiner', prefix: 'R', key: 'rutiner' },
  { dir: 'hero/ekonomi', prefix: 'E', key: 'ekonomi' },
  { dir: 'hero/utveckling', prefix: 'U', key: 'utveckling' },
  { dir: 'hero/kunskap', prefix: 'Kn', key: 'kunskap' },
];

function uid(cat, chassis, i) {
  return `v3${cat}${chassis}${i}`.replace(/[^a-zA-Z0-9]/g, '');
}

function buildSvg(catKey, chassisDef, chassisIndex, catPrefix, fileIndex) {
  const id = uid(catKey, chassisDef.id, chassisIndex);
  const d = `d${id}`;
  const g = `g${id}`;
  const f = `f${id}`;
  const gl = `gl${id}`;

  const disk = `
    <radialGradient id="${d}" cx="50%" cy="38%" r="68%">
      <stop offset="0%" stop-color="#3d3420"/>
      <stop offset="48%" stop-color="#141210"/>
      <stop offset="100%" stop-color="#080808"/>
    </radialGradient>`;
  const gold = `
    <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f5e6b8"/>
      <stop offset="45%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#6b5212"/>
    </linearGradient>`;
  const fire = `
    <linearGradient id="${f}" x1="24" y1="4" x2="30" y2="20">
      <stop offset="0%" stop-color="#fff8e0"/>
      <stop offset="55%" stop-color="#ffb74d"/>
      <stop offset="100%" stop-color="#c97808"/>
    </linearGradient>`;
  const glow = `
    <filter id="${gl}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="1.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;

  const outerRing = `
  <circle cx="24" cy="24" r="22" fill="url(#${d})" stroke="url(#${g})" stroke-width="1.15" stroke-opacity="0.72"/>
  <circle cx="24" cy="24" r="20.5" stroke="url(#${g})" stroke-opacity="0.08" stroke-width="0.35" fill="none"/>
  <g stroke="url(#${g})" stroke-opacity="0.09" stroke-width="0.32">
    ${[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5]
      .map((deg) => `<line x1="24" y1="6.5" x2="24" y2="8.8" transform="rotate(${deg} 24 24)"/>`)
      .join('')}
  </g>`;

  const glyph = GLYPHS[catKey](g, f);
  const chassisLayer = chassisDef.extra(g, f, gl);

  // Order: outer, chassis-specific (may include mini compass), glyph, hub gem
  const hub = `
  <circle cx="24" cy="24" r="2.8" fill="url(#${g})" stroke="#0a0a0a" stroke-width="0.45"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>${catPrefix} ${chassisIndex + 1} — ${chassisDef.name}</title>
  <defs>${disk}${gold}${fire}${glow}</defs>
  ${outerRing}
  ${chassisLayer}
  ${glyph}
  ${hub}
</svg>
`;
}

function main() {
  let count = 0;
  for (const cat of CATEGORIES) {
    const sub = join(outDir, cat.dir);
    mkdirSync(sub, { recursive: true });
    CHASSIS.forEach((ch, idx) => {
      const fn = `${cat.prefix}${idx + 1}-${chassisFileSlug(ch.id)}.svg`;
      const svg = buildSvg(cat.key, ch, idx, cat.prefix, idx);
      writeFileSync(join(sub, fn), svg, 'utf8');
      count++;
    });
  }
  console.log(`[generate_icon_proposals_v3] Wrote ${count} SVGs → ${outDir}`);
}

function chassisFileSlug(id) {
  const map = { helros: 'helros', stjarna: 'stjarneld', sacred: 'sacred', pansar: 'pansarringar', eldnal: 'eldnal' };
  return map[id] || id;
}

main();
