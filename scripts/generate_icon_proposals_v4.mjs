/**
 * v4 — 10 varianter × (3 kärn-ikoner + 10 chrome-kategorier).
 * Slot 1 (ankare): v2-premium B1 Kanon ros · D1 Helros · M2 Orakelöga (lästa SVG:er, unika id:n).
 * Slot 2–10: variationer (samma familj som tidigare eldnål/aurora/stjärn m.m.).
 * Output: docs/design/icons-proposals/2026-05-26-v4-round2-dna/
 */
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs/design/icons-proposals/2026-05-26-v4-round2-dna');
const v2Premium = join(root, 'docs/design/icons-proposals/2026-05-26-v2-premium');

const PATH_B1 = join(v2Premium, 'app/B1-kanon-ros.svg');
const PATH_D1 = join(v2Premium, 'kompass/D1-helros.svg');
const PATH_M2 = join(v2Premium, 'kompis/M2-orakeloga.svg');

/** Varianter 2–10 (slot 1 = separata ankare ovan) */
const VARIANT_STYLES = [
  { id: 'helros-3d', name: 'Helros 3D', mode: '3d', family: 'helros' },
  { id: 'eldnal-flat', name: 'Eldnål flat', mode: 'flat', family: 'eldnal' },
  { id: 'eldnal-3d', name: 'Eldnål 3D', mode: '3d', family: 'eldnal' },
  { id: 'aurora-flat', name: 'Aurora flat', mode: 'flat', family: 'aurora' },
  { id: 'aurora-3d', name: 'Aurora 3D', mode: '3d', family: 'aurora' },
  { id: 'stjarn-flat', name: 'Stjärn flat', mode: 'flat', family: 'stjarn' },
  { id: 'stjarn-3d', name: 'Stjärn 3D', mode: '3d', family: 'stjarn' },
  { id: 'sacred-flat', name: 'Sacred oktagon', mode: 'flat', family: 'sacred' },
  { id: 'obsidian-3d', name: 'Obsidian djup', mode: '3d', family: 'obsidian' },
];

const ALL_STYLES = [
  { id: 'b1-kanon-ros-v2', name: 'B1 Kanon ros (v2-premium)', mode: 'flat', family: 'anchor', anchor: 'app' },
  ...VARIANT_STYLES,
];

function slugCore(channel, index) {
  if (index === 0) {
    if (channel === 'app') return 'b1-kanon-ros-v2';
    if (channel === 'kompass') return 'd1-helros-v2';
    return 'm2-orakel-v2';
  }
  return VARIANT_STYLES[index - 1].id;
}

function slugChrome(index) {
  if (index === 0) return 'd1-helros-chrome';
  return VARIANT_STYLES[index - 1].id;
}

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

/** Kategori-glyfer (L2) — samma D1-skiva, unika symboler (ej kompass-ros). */
const GLYPHS = {
  familjen: (g, f, gl) => `
  <path d="M7 27 Q24 20 41 27" stroke="url(#${g})" stroke-width="0.8" fill="url(#${g})" fill-opacity="0.1"/>
  <circle cx="11" cy="15" r="3" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.25"/>
  <circle cx="24" cy="11.5" r="3.4" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.35"/>
  <circle cx="37" cy="15" r="3" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.25"/>
  <path d="M11 18 L24 14 L37 18" stroke="url(#${g})" stroke-width="0.45" stroke-opacity="0.5"/>
  <path d="M24 20 Q24 17 24 14" stroke="url(#${f})" stroke-width="0.5" opacity="0.6"/>
  <circle cx="24" cy="23" r="1.4" fill="url(#${f})" filter="url(#${gl})"/>`,
  hamn: (g, f, gl) => `
  <path d="M11 34 H37" stroke="url(#${g})" stroke-width="0.95" stroke-linecap="round"/>
  <path d="M14 34 Q24 28 34 34" stroke="url(#${g})" stroke-width="0.55" fill="none" opacity="0.45"/>
  <path d="M18 22 V34 M30 22 V34" stroke="url(#${g})" stroke-width="0.85" stroke-linecap="round"/>
  <path d="M16 22 H32 V24 H16 Z" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M24 9 L29 19 L24 17 L19 19 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <circle cx="24" cy="9" r="1.2" fill="#fff8e0" filter="url(#${gl})"/>`,
  valv: (g, f, gl) => `
  <path d="M9 22 V35 H39 V22" stroke="url(#${g})" stroke-width="0.9" stroke-linejoin="round" fill="none"/>
  <path d="M9 22 Q24 7 39 22" stroke="url(#${g})" stroke-width="0.9" fill="none"/>
  <path d="M16 35 V27 H32 V35" stroke="url(#${g})" stroke-width="0.7"/>
  <circle cx="24" cy="19" r="3.2" stroke="url(#${g})" stroke-width="0.5" fill="#0a0a0a"/>
  <circle cx="24" cy="19" r="1.1" fill="url(#${f})" filter="url(#${gl})"/>
  <path d="M12 14 L16 18 M32 14 L28 18" stroke="url(#${g})" stroke-width="0.45" stroke-opacity="0.4"/>`,
  dagbok: (g, f, gl) => `
  <path d="M11 11 H19 V33 H11 Q9 22 11 11 Z" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.16"/>
  <path d="M37 11 H29 V33 H37 Q39 22 37 11 Z" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.24"/>
  <path d="M19 11 V33" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.5"/>
  <path d="M29 14 Q33 18 29 22 Q25 18 29 14" stroke="url(#${g})" stroke-width="0.45" fill="none" opacity="0.5"/>
  <path d="M31 16 L32.2 19.5 L31 21 L29.8 19.5 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <path d="M14 26 H18 M14 29 H17" stroke="url(#${g})" stroke-width="0.4" stroke-opacity="0.35" stroke-linecap="round"/>`,
  planering: (g, f, gl) => `
  <rect x="8.5" y="15" width="5.5" height="13" rx="0.7" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.14"/>
  <rect x="16" y="11" width="5.5" height="17" rx="0.7" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.26"/>
  <rect x="23.5" y="17" width="5.5" height="11" rx="0.7" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.12"/>
  <circle cx="31" cy="12" r="5" stroke="url(#${g})" stroke-width="0.5" fill="none" opacity="0.45"/>
  <path d="M31 9 V15 M28 12 H34" stroke="url(#${g})" stroke-width="0.45" stroke-linecap="round"/>
  <circle cx="31" cy="12" r="1.2" fill="url(#${f})" filter="url(#${gl})"/>`,
  mabra: (g, f, gl) => `
  <path d="M24 31 Q17 22 19.5 15 Q22 10 24 12.5 Q26 10 28.5 15 Q31 22 24 31" stroke="url(#${g})" stroke-width="0.85" fill="url(#${g})" fill-opacity="0.18"/>
  <path d="M24 12.5 L24 8 M19.5 15 L16 13 M28.5 15 L32 13" stroke="url(#${g})" stroke-width="0.45" stroke-linecap="round"/>
  <path d="M20 24 Q24 20 28 24" stroke="url(#${f})" stroke-width="0.55" fill="none" opacity="0.7"/>
  <circle cx="24" cy="27" r="2" fill="url(#${f})" filter="url(#${gl})"/>
  <circle cx="18" cy="20" r="0.9" fill="url(#${f})" opacity="0.5"/>
  <circle cx="30" cy="20" r="0.9" fill="url(#${f})" opacity="0.5"/>`,
  rutiner: (g, f, gl) => `
  <circle cx="24" cy="21" r="9.5" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.08"/>
  <path d="M17.5 21 L20.5 24.5 L30.5 15.5" stroke="url(#${g})" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M14 11 H34" stroke="url(#${g})" stroke-width="0.5" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M18 11 L20 8 H28 L30 11" stroke="url(#${g})" stroke-width="0.45" fill="none" opacity="0.4"/>
  <circle cx="24" cy="9.5" r="1.5" fill="url(#${f})" filter="url(#${gl})"/>`,
  ekonomi: (g, f, gl) => `
  <ellipse cx="15" cy="20" rx="5" ry="2.6" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.14"/>
  <ellipse cx="33" cy="24" rx="5" ry="2.6" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.22"/>
  <circle cx="33" cy="18" r="2.5" fill="url(#${f})" filter="url(#${gl})"/>
  <circle cx="15" cy="25" r="2.5" fill="url(#${g})" fill-opacity="0.5"/>
  <path d="M11 30 H37" stroke="url(#${g})" stroke-width="0.55" stroke-opacity="0.3"/>
  <path d="M24 12 L24 16" stroke="url(#${g})" stroke-width="0.5" stroke-opacity="0.4"/>`,
  utveckling: (g, f, gl) => `
  <path d="M24 30 Q20 21 22.5 14.5 Q24 10 25.5 14.5 Q28 21 24 30" stroke="url(#${g})" stroke-width="0.8" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M24 30 Q29 21 31 16 Q32.5 13.5 30.5 17 Q28 21 24 30" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.14"/>
  <path d="M24 30 Q19 21 17 16 Q15.5 13.5 17.5 17 Q19 21 24 30" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.14"/>
  <circle cx="24" cy="11.5" r="1.8" fill="url(#${f})" filter="url(#${gl})"/>
  <path d="M24 11.5 L24 8" stroke="url(#${f})" stroke-width="0.4" opacity="0.6"/>`,
  kunskap: (g, f, gl) => `
  <path d="M10 12 H18 V32 H10 Q8 22 10 12 Z" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.12"/>
  <path d="M38 12 H30 V32 H38 Q40 22 38 12 Z" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M18 12 V32" stroke="url(#${g})" stroke-opacity="0.32" stroke-width="0.45"/>
  <circle cx="29" cy="21" r="5.5" stroke="url(#${g})" stroke-width="0.5" fill="none" opacity="0.4"/>
  <path d="M29 16.5 L30 21 L29 23.5 L28 21 Z" fill="url(#${f})" opacity="0.85"/>
  <path d="M22 18 H26 M22 21 H25" stroke="url(#${g})" stroke-width="0.35" stroke-opacity="0.35" stroke-linecap="round"/>`,
};

/** D1-skiva för chrome — ringar + ticks, ingen 8-spets ros (den är bara D1-kompass). */
function d1ChromePlate(ids) {
  const { d, g } = ids;
  return `
  <circle cx="24" cy="24" r="22" fill="url(#${d})" stroke="url(#${g})" stroke-width="1.2" stroke-opacity="0.72"/>
  <circle cx="24" cy="24" r="18" stroke="url(#${g})" stroke-opacity="0.26" stroke-width="0.6" stroke-dasharray="2 3" fill="none"/>
  <circle cx="24" cy="24" r="14" stroke="url(#${g})" stroke-opacity="0.14" stroke-width="0.45" fill="none"/>
  <g stroke="url(#${g})" stroke-opacity="0.1" stroke-width="0.35">
    <line x1="24" y1="8" x2="24" y2="40"/><line x1="8" y1="24" x2="40" y2="24"/>
    <line x1="12.7" y1="12.7" x2="35.3" y2="35.3"/><line x1="35.3" y1="12.7" x2="12.7" y2="35.3"/>
  </g>
  ${tickRing(g)}`;
}

function uid(parts) {
  return parts.join('').replace(/[^a-zA-Z0-9]/g, '');
}

/** Prefix all id="x" / url(#x) in an SVG fragment */
function scopeSvgIds(svgText, prefix) {
  const seen = new Set();
  const idRe = /\bid="([^"]+)"/g;
  let m;
  while ((m = idRe.exec(svgText)) !== null) seen.add(m[1]);
  const ids = [...seen].sort((a, b) => b.length - a.length);
  let out = svgText;
  for (const id of ids) {
    const nid = `${prefix}${id}`;
    out = out.split(`url(#${id})`).join(`url(#${nid})`);
    out = out.split(`id="${id}"`).join(`id="${nid}"`);
    out = out.split(`href="#${id}"`).join(`href="#${nid}"`);
  }
  return out;
}

function insertAfterOpenSvg(svgText, insert) {
  const idx = svgText.indexOf('>');
  if (idx === -1) return svgText;
  return `${svgText.slice(0, idx + 1)}\n  ${insert}\n${svgText.slice(idx + 1)}`;
}

function loadAnchoredSvg(filePath, scopePrefix, title) {
  let raw = readFileSync(filePath, 'utf8').trim();
  raw = raw.replace(/<\?xml[^?]*\?>\s*/i, '');
  const scoped = scopeSvgIds(raw, scopePrefix);
  return insertAfterOpenSvg(scoped, `<title>${title}</title>`);
}

function defsBlock(id, mode) {
  const d = `d${id}`;
  const g = `g${id}`;
  const f = `f${id}`;
  const gl = `gl${id}`;
  const rim = `rim${id}`;
  const bevel = `bv${id}`;

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
    <filter id="${gl}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  const aurora = `
    <linearGradient id="${rim}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5eead4"/>
      <stop offset="40%" stop-color="#818cf8"/>
      <stop offset="75%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#2dd4bf"/>
    </linearGradient>`;
  const bevelF =
    mode === '3d'
      ? `
    <filter id="${bevel}" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" flood-color="#000" flood-opacity="0.55"/>
      <feDropShadow dx="0" dy="-0.6" stdDeviation="0.4" flood-color="#fff8e0" flood-opacity="0.12"/>
    </filter>`
      : '';

  return { d, g, f, gl, rim, bevel, defs: `${disk}${gold}${fire}${glow}${aurora}${bevelF}` };
}

function tickRing(g) {
  return `
  <g stroke="url(#${g})" stroke-opacity="0.1" stroke-width="0.32">
    ${[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5]
      .map((deg) => `<line x1="24" y1="6.5" x2="24" y2="9.2" transform="rotate(${deg} 24 24)"/>`)
      .join('')}
  </g>`;
}

function styleLayer(style, ids) {
  const { g, f, gl, rim, bevel } = ids;
  const filter3d = style.mode === '3d' ? ` filter="url(#${bevel})"` : '';
  const fam = style.family;

  if (fam === 'helros') {
    return `
  <circle cx="24" cy="24" r="18" stroke="url(#${g})" stroke-opacity="0.3" stroke-width="0.55" stroke-dasharray="2 3" fill="none"/>
  <circle cx="24" cy="24" r="14" stroke="url(#${g})" stroke-opacity="0.16" stroke-width="0.45" fill="none"/>
  <g stroke="url(#${g})" stroke-opacity="0.12" stroke-width="0.35">
    <line x1="24" y1="8" x2="24" y2="40"/><line x1="8" y1="24" x2="40" y2="24"/>
    <line x1="12.7" y1="12.7" x2="35.3" y2="35.3"/><line x1="35.3" y1="12.7" x2="12.7" y2="35.3"/>
  </g>
  <circle cx="32" cy="14" r="1.6" fill="#fff8e0" opacity="0.85" filter="url(#${gl})"/>
  <path d="M32 14 L30.6 15.4 L32 16.8 L33.4 15.4 Z" fill="url(#${f})" opacity="0.85"${filter3d}/>`;
  }
  if (fam === 'eldnal') {
    return `
  <circle cx="24" cy="24" r="19" stroke="url(#${g})" stroke-opacity="0.2" stroke-width="0.45" stroke-dasharray="1.5 4" fill="none"/>
  <circle cx="24" cy="24" r="12" stroke="url(#${g})" stroke-opacity="0.12" stroke-width="0.35" fill="none"/>
  <circle cx="24" cy="24" r="8" stroke="url(#${g})" stroke-opacity="0.1" stroke-width="0.3" fill="none"/>
  <path d="M24 5 L27 19 L24 23 L21 19 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <circle cx="31" cy="13" r="2.2" fill="#fff8dc" filter="url(#${gl})"/>
  <path d="M31 13 L29 15.5 L31 17.5 L33 15.5 Z" fill="url(#${f})" opacity="0.9"${filter3d}/>`;
  }
  if (fam === 'aurora') {
    return `
  <circle cx="24" cy="24" r="20.5" stroke="url(#${rim})" stroke-opacity="0.55" stroke-width="0.85" fill="none"/>
  <circle cx="24" cy="24" r="17" stroke="url(#${g})" stroke-opacity="0.22" stroke-width="0.5" fill="none"/>
  <polygon points="24,9 26,17 34,17 27.5,21.5 29.5,29 24,25 18.5,29 20.5,21.5 14,17 22,17" fill="none" stroke="url(#${g})" stroke-width="0.45" opacity="0.4"/>
  <path d="M24 8 L25.5 17 L24 21 L22.5 17 Z" fill="url(#${f})" opacity="0.7"${filter3d}/>`;
  }
  if (fam === 'stjarn') {
    return `
  <circle cx="24" cy="24" r="22" fill="url(#${g})" fill-opacity="0.06"/>
  <polygon points="24,7 26.5,17 37,17 28.5,23 31.5,33 24,27 16.5,33 19.5,23 11,17 21.5,17" fill="url(#${g})" fill-opacity="0.28" stroke="url(#${g})" stroke-width="0.55"/>
  <polygon points="24,11 25.5,17 31,17 27,20 28.5,26 24,23 19.5,26 21,20 17,17 22.5,17" fill="url(#${f})" fill-opacity="0.88"${filter3d}/>`;
  }
  if (fam === 'sacred') {
    return `
  <polygon points="24,6 28.5,14 37.5,14 30.5,20 33,29 24,24 15,29 17.5,20 10.5,14 19.5,14" fill="none" stroke="url(#${g})" stroke-width="0.55" opacity="0.45"/>
  <g stroke="url(#${g})" stroke-opacity="0.18" stroke-width="0.28">
    ${[0, 30, 60, 90, 120, 150].map((d) => `<line x1="24" y1="24" x2="24" y2="7" transform="rotate(${d} 24 24)"/>`).join('')}
  </g>
  <circle cx="33" cy="13" r="1.4" fill="#fff8e0" filter="url(#${gl})"/>`;
  }
  return `
  <circle cx="24" cy="24" r="19" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.5" fill="none"/>
  <circle cx="24" cy="24" r="15.5" stroke="url(#${g})" stroke-opacity="0.22" stroke-width="0.4" stroke-dasharray="3 5" fill="none"/>
  <circle cx="24" cy="24" r="11.5" stroke="url(#${g})" stroke-opacity="0.14" stroke-width="0.35" fill="none"/>
  <path d="M24 6 L27.5 20 L24 24 L20.5 20 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <ellipse cx="24" cy="26" rx="8" ry="3" fill="#000" opacity="0.35"${filter3d}/>`;
}

/** Chrome/meny/hero — D1-platta + unik kategori-symbol + valfri stil-overlay. */
function buildChromeIcon(catKey, style, styleIndex, catPrefix) {
  const id = uid(['ch', catKey, style.id, String(styleIndex)]);
  const ids = defsBlock(id, style.mode);
  const glyph = GLYPHS[catKey](ids.g, ids.f, ids.gl);
  const overlay = styleIndex === 0 ? '' : styleLayer(style, ids);
  const plate = d1ChromePlate(ids);
  const hub = `<circle cx="24" cy="24" r="2.5" fill="url(#${ids.g})" stroke="#0a0a0a" stroke-width="0.5"/>`;
  const label =
    styleIndex === 0
      ? `${catPrefix}1 — D1 skiva + ${catKey}`
      : `${catPrefix}${styleIndex + 1} — ${style.name}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>${label}</title>
  <defs>${ids.defs}</defs>
  ${plate}
  ${overlay}
  <g opacity="0.93">${glyph}</g>
  ${hub}
</svg>
`;
}

function buildRoundIcon(catKey, style, styleIndex, catPrefix) {
  return buildChromeIcon(catKey, style, styleIndex, catPrefix);
}

function buildCompassMark(style, idx) {
  if (idx === 0) {
    const p = uid(['v4d1', String(idx), 'x']);
    return loadAnchoredSvg(PATH_D1, p, `D1 — D1 Helros (v2-premium)`);
  }
  const id = uid(['cmp', style.id]);
  const ids = defsBlock(id, style.mode);
  const rose = `
  <path fill="url(#${ids.g})" fill-opacity="0.22" d="M24 10 L26 19 L24 24 L22 19 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.18" d="M24 38 L22 29 L24 24 L26 29 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.16" d="M10 24 L19 22 L24 24 L19 26 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.16" d="M38 24 L29 26 L24 24 L29 22 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.14" d="M13 13 L18 18 L24 24 L18 18 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.14" d="M35 13 L30 18 L24 24 L30 18 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.12" d="M35 35 L30 30 L24 24 L30 30 Z"/>
  <path fill="url(#${ids.g})" fill-opacity="0.12" d="M13 35 L18 30 L24 24 L18 30 Z"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>D${idx + 1} — ${style.name}</title>
  <defs>${ids.defs}</defs>
  <circle cx="24" cy="24" r="22" fill="url(#${ids.d})" stroke="url(#${ids.g})" stroke-width="1.15" stroke-opacity="0.75"/>
  ${tickRing(ids.g)}
  ${styleLayer(style, ids)}
  ${rose}
  <circle cx="24" cy="24" r="2.8" fill="#0a0a0a" stroke="url(#${ids.g})" stroke-width="0.8"/>
  <circle cx="24" cy="24" r="1.2" fill="url(#${ids.f})"/>
</svg>
`;
}

function buildKompisMark(style, idx) {
  if (idx === 0) {
    const p = uid(['v4m2', String(idx), 'x']);
    return loadAnchoredSvg(PATH_M2, p, `M2 — M2 Orakelöga (v2-premium)`);
  }
  const id = uid(['kmp', style.id]);
  const ids = defsBlock(id, style.mode);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>M${idx + 1} — ${style.name}</title>
  <defs>${ids.defs}</defs>
  <circle cx="24" cy="24" r="22" fill="url(#${ids.d})" stroke="url(#${ids.g})" stroke-width="0.95" stroke-opacity="0.55"/>
  ${styleLayer(style, ids)}
  <polygon points="24,10 26,18 34,18 28,22.5 30,30 24,26 18,30 20,22.5 14,18 22,18" fill="url(#${ids.f})" fill-opacity="0.55" stroke="url(#${ids.g})" stroke-width="0.45"/>
  <circle cx="24" cy="22" r="2" fill="#fff8e0"/>
</svg>
`;
}

function buildAppIcon(style, idx) {
  if (idx === 0) {
    const p = uid(['v4b1', String(idx), 'x']);
    return loadAnchoredSvg(PATH_B1, p, `B1 — B1 Kanon ros (v2-premium)`);
  }
  const id = uid(['app', style.id]);
  const cx = 256;
  const cy = 256;
  const ids = defsBlock(id, style.mode);
  const rimStroke = style.family === 'aurora' ? `url(#${ids.rim})` : `url(#${ids.g})`;
  const bevelF =
    style.mode === '3d'
      ? `<filter id="${ids.bevel}"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/><feDropShadow dx="0" dy="-2" stdDeviation="2" flood-color="#fff8e0" flood-opacity="0.15"/></filter>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" aria-hidden="true">
  <title>B${idx + 1} — ${style.name}</title>
  <defs>
    <radialGradient id="${ids.d}" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#1e3a35"/>
      <stop offset="55%" stop-color="#0c1816"/>
      <stop offset="100%" stop-color="#030606"/>
    </radialGradient>
    <linearGradient id="${ids.g}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f2e4b8"/><stop offset="50%" stop-color="#d4af37"/><stop offset="100%" stop-color="#7a5f15"/>
    </linearGradient>
    <linearGradient id="${ids.f}" x1="256" y1="80" x2="256" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fff9e6"/><stop offset="40%" stop-color="#ffb74d"/><stop offset="100%" stop-color="#c9a227"/>
    </linearGradient>
    <filter id="${ids.gl}"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="${ids.rim}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5eead4"/><stop offset="35%" stop-color="#818cf8"/><stop offset="70%" stop-color="#d4af37"/><stop offset="100%" stop-color="#2dd4bf"/>
    </linearGradient>
    ${bevelF}
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#${ids.d})"/>
  <rect x="20" y="20" width="472" height="472" rx="100" stroke="${rimStroke}" stroke-opacity="0.45" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="188" stroke="url(#${ids.g})" stroke-opacity="0.35" stroke-width="3" fill="none"/>
  <circle cx="${cx}" cy="${cy}" r="156" stroke="url(#${ids.g})" stroke-opacity="0.18" stroke-width="1.5" stroke-dasharray="8 10" fill="none"/>
  <g stroke="url(#${ids.g})" stroke-opacity="0.12" stroke-width="1.5">
    <line x1="256" y1="68" x2="256" y2="444"/><line x1="68" y1="256" x2="444" y2="256"/>
    <line x1="123" y1="123" x2="389" y2="389"/><line x1="389" y1="123" x2="123" y2="389"/>
  </g>
  <g transform="translate(256 256)">
    <path d="M0-148 L18-20 L0 8 L-18-20 Z" fill="url(#${ids.f})" filter="url(#${ids.gl})"/>
    <path d="M0 148 L-18 20 L0 -8 L18 20 Z" fill="url(#${ids.g})" fill-opacity="0.35"/>
    <path d="M-148 0 L-20 18 L8 0 L-20-18 Z" fill="url(#${ids.g})" fill-opacity="0.28"/>
    <path d="M148 0 L20-18 L-8 0 L20 18 Z" fill="url(#${ids.g})" fill-opacity="0.28"/>
    <polygon points="0,-120 28,-28 120,-28 44,8 72,100 0,60 -72,100 -44,8 -120,-28 -28,-28" fill="none" stroke="url(#${ids.g})" stroke-width="2" opacity="0.4"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="28" fill="#0a0a0a" stroke="url(#${ids.g})" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="12" fill="url(#${ids.f})" filter="url(#${ids.gl})"/>
</svg>
`;
}

function copyReferencePngs() {
  const refDir = join(outDir, 'reference');
  mkdirSync(refDir, { recursive: true });
  const assets =
    '/Users/Livskompassen/.cursor/projects/Users-Livskompassen-StudioProjects-Livskompassen3-0/assets';
  const map = [
    ['icons-proposals-app-row.png', 'reference-app-b1-b2-b3.png'],
    ['icons-proposals-kompass-row.png', 'reference-kompass-d1-d2-d3.png'],
    ['icons-proposals-kompis-row.png', 'reference-kompis-m1-m2-m3.png'],
    ['premium-app-row-d5c20533-9698-4b2e-bc39-4ef02b1319b5.png', 'reference-premium-app-row.png'],
    ['premium-kompass-row-9bf2aceb-e3b9-4090-bbca-323ca8be583c.png', 'reference-premium-kompass-row.png'],
    ['premium-kompis-row-a6957f3c-6120-46cd-b2f0-65f495399e35.png', 'reference-premium-kompis-row.png'],
    [
      'Ska_rmavbild_2026-05-26_kl._22.59.57-d670b554-3ae6-4c0b-8dca-ae54c2e5af61.png',
      'reference-premium-b1-single.png',
    ],
  ];
  for (const [srcName, destName] of map) {
    const src = join(assets, srcName);
    const dest = join(refDir, destName);
    if (existsSync(src)) copyFileSync(src, dest);
  }
}

function main() {
  for (const p of [PATH_B1, PATH_D1, PATH_M2]) {
    if (!existsSync(p)) throw new Error(`Saknar ankare: ${p}`);
  }

  let count = 0;
  const coreApp = join(outDir, 'core/app');
  const coreKompass = join(outDir, 'core/kompass');
  const coreKompis = join(outDir, 'core/kompis');
  mkdirSync(coreApp, { recursive: true });
  mkdirSync(coreKompass, { recursive: true });
  mkdirSync(coreKompis, { recursive: true });

  ALL_STYLES.forEach((rowStyle, i) => {
    const variantStyle = i === 0 ? rowStyle : VARIANT_STYLES[i - 1];
    writeFileSync(
      join(coreApp, `B${i + 1}-${slugCore('app', i)}.svg`),
      buildAppIcon(variantStyle, i),
      'utf8',
    );
    writeFileSync(
      join(coreKompass, `D${i + 1}-${slugCore('kompass', i)}.svg`),
      buildCompassMark(variantStyle, i),
      'utf8',
    );
    writeFileSync(
      join(coreKompis, `M${i + 1}-${slugCore('kompis', i)}.svg`),
      buildKompisMark(variantStyle, i),
      'utf8',
    );
    count += 3;
  });

  for (const cat of CATEGORIES) {
    const sub = join(outDir, cat.dir);
    mkdirSync(sub, { recursive: true });
    ALL_STYLES.forEach((style, idx) => {
      const fn = `${cat.prefix}${idx + 1}-${slugChrome(idx)}.svg`;
      const variantForBuild = idx === 0 ? style : VARIANT_STYLES[idx - 1];
      writeFileSync(join(sub, fn), buildRoundIcon(cat.key, variantForBuild, idx, cat.prefix), 'utf8');
      count++;
    });
  }

  copyReferencePngs();
  console.log(`[generate_icon_proposals_v4] Wrote ${count} SVGs → ${outDir}`);
}

main();
