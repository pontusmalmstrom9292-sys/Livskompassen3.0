/**
 * v4 — 10 stilar (flat + 3D) × (3 kärn-ikoner + 10 chrome-kategorier).
 * Stil-DNA: v2 andra omgången D3 Eldnål · B2 Aurora · M1 Stjärnkompis (ej prod B1/D1/M3).
 * Output: docs/design/icons-proposals/2026-05-26-v4-round2-dna/
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs/design/icons-proposals/2026-05-26-v4-round2-dna');

/** 10 stilar — jämnt flat / 3D-bevel */
const STYLES = [
  { id: 'helros-flat', name: 'Helros flat', mode: 'flat', family: 'helros' },
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

const GLYPHS = {
  familjen: (g, f) => `
  <circle cx="11" cy="14" r="2.8" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.22"/>
  <circle cx="24" cy="12" r="3.2" stroke="url(#${g})" stroke-width="0.6" fill="url(#${g})" fill-opacity="0.32"/>
  <circle cx="37" cy="14" r="2.8" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.22"/>
  <path d="M8 28 Q24 22 40 28 Q24 34 8 28" stroke="url(#${g})" stroke-width="0.75" fill="url(#${g})" fill-opacity="0.14"/>
  <circle cx="24" cy="22" r="1.2" fill="url(#${f})"/>`,
  hamn: (g, f) => `
  <path d="M24 10 L28 18 L24 16 L20 18 Z" fill="url(#${f})" opacity="0.9"/>
  <path d="M16 20 H32 V22 H16 Z" stroke="url(#${g})" stroke-width="0.7" fill="url(#${g})" fill-opacity="0.18"/>
  <path d="M18 22 V34 M30 22 V34" stroke="url(#${g})" stroke-width="0.85" stroke-linecap="round"/>
  <path d="M14 34 H34" stroke="url(#${g})" stroke-width="0.9" stroke-linecap="round"/>`,
  valv: (g, f) => `
  <path d="M10 22 V34 H38 V22" stroke="url(#${g})" stroke-width="0.85" stroke-linejoin="round" fill="none"/>
  <path d="M10 22 Q24 8 38 22" stroke="url(#${g})" stroke-width="0.85" fill="none"/>
  <path d="M17 34 V26 H31 V34" stroke="url(#${g})" stroke-width="0.65"/>
  <circle cx="24" cy="20" r="1.1" fill="url(#${f})"/>`,
  dagbok: (g, f) => `
  <path d="M12 12 H20 V32 H12 Q10 22 12 12 Z" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.14"/>
  <path d="M36 12 H28 V32 H36 Q38 22 36 12 Z" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.22"/>
  <path d="M20 12 V32" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.45"/>
  <circle cx="30" cy="20" r="3.5" stroke="url(#${g})" stroke-width="0.4" fill="none" opacity="0.5"/>
  <path d="M30 17.2 L30.6 20 L30 21.5 L29.4 20 Z" fill="url(#${f})"/>`,
  planering: (g, f) => `
  <rect x="9" y="14" width="5" height="14" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.16"/>
  <rect x="16.5" y="11" width="5" height="17" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.26"/>
  <rect x="24" y="16" width="5" height="12" rx="0.6" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.12"/>
  <circle cx="31" cy="13" r="1.3" fill="url(#${f})"/>`,
  mabra: (g, f) => `
  <path d="M24 30 Q18 22 20 16 Q22 12 24 14 Q26 12 28 16 Q30 22 24 30" stroke="url(#${g})" stroke-width="0.85" fill="url(#${g})" fill-opacity="0.2"/>
  <path d="M24 14 L24 10 M20 16 L17 14 M28 16 L31 14" stroke="url(#${g})" stroke-width="0.45" stroke-linecap="round"/>
  <circle cx="24" cy="26" r="1.8" fill="url(#${f})"/>`,
  rutiner: (g, f) => `
  <circle cx="24" cy="22" r="9" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.1"/>
  <path d="M18 22 L21.5 25.5 L30 17" stroke="url(#${g})" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M15 12 H33 M15 32 H27" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.55" stroke-linecap="round"/>
  <circle cx="24" cy="10" r="1.2" fill="url(#${f})"/>`,
  ekonomi: (g, f) => `
  <ellipse cx="16" cy="19" rx="4.5" ry="2.4" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.14"/>
  <ellipse cx="32" cy="23" rx="4.5" ry="2.4" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.22"/>
  <circle cx="32" cy="18" r="2.2" fill="url(#${f})"/>
  <circle cx="16" cy="24" r="2.2" fill="url(#${g})" fill-opacity="0.45"/>
  <path d="M12 28 H36" stroke="url(#${g})" stroke-opacity="0.25" stroke-width="0.45"/>`,
  utveckling: (g, f) => `
  <path d="M24 28 Q20 20 22 14 Q24 10 26 14 Q28 20 24 28" stroke="url(#${g})" stroke-width="0.75" fill="url(#${g})" fill-opacity="0.22"/>
  <path d="M24 28 Q28 20 30 16 Q32 14 30 18 Q28 22 24 28" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.16"/>
  <path d="M24 28 Q16 20 14 16 Q12 14 14 18 Q16 22 24 28" stroke="url(#${g})" stroke-width="0.65" fill="url(#${g})" fill-opacity="0.16"/>
  <circle cx="24" cy="12" r="1.5" fill="url(#${f})"/>`,
  kunskap: (g, f) => `
  <path d="M11 13 H17 V31 H11 Q9.5 22 11 13 Z" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.12"/>
  <path d="M37 13 H31 V31 H37 Q38.5 22 37 13 Z" stroke="url(#${g})" stroke-width="0.55" fill="url(#${g})" fill-opacity="0.18"/>
  <path d="M17 13 V31" stroke="url(#${g})" stroke-opacity="0.3" stroke-width="0.4"/>
  <circle cx="28" cy="22" r="5" stroke="url(#${g})" stroke-width="0.45" fill="none" opacity="0.45"/>
  <path d="M28 18.5 L29 22 L28 24.5 L27 22 Z" fill="url(#${f})"/>`,
};

function uid(parts) {
  return parts.join('').replace(/[^a-zA-Z0-9]/g, '');
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
  // obsidian deep 3d
  return `
  <circle cx="24" cy="24" r="19" stroke="url(#${g})" stroke-opacity="0.35" stroke-width="0.5" fill="none"/>
  <circle cx="24" cy="24" r="15.5" stroke="url(#${g})" stroke-opacity="0.22" stroke-width="0.4" stroke-dasharray="3 5" fill="none"/>
  <circle cx="24" cy="24" r="11.5" stroke="url(#${g})" stroke-opacity="0.14" stroke-width="0.35" fill="none"/>
  <path d="M24 6 L27.5 20 L24 24 L20.5 20 Z" fill="url(#${f})" filter="url(#${gl})"/>
  <ellipse cx="24" cy="26" rx="8" ry="3" fill="#000" opacity="0.35"${filter3d}/>`;
}

function buildRoundIcon(catKey, style, styleIndex, catPrefix) {
  const id = uid(['r', catKey, style.id]);
  const ids = defsBlock(id, style.mode);
  const outer = `
  <circle cx="24" cy="24" r="22" fill="url(#${ids.d})" stroke="url(#${ids.g})" stroke-width="1.15" stroke-opacity="0.72"/>
  <circle cx="24" cy="24" r="20.5" stroke="url(#${ids.g})" stroke-opacity="0.08" stroke-width="0.35" fill="none"/>
  ${tickRing(ids.g)}
  ${styleLayer(style, ids)}
  ${GLYPHS[catKey](ids.g, ids.f)}
  <circle cx="24" cy="24" r="2.8" fill="url(#${ids.g})" stroke="#0a0a0a" stroke-width="0.45"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>${catPrefix}${styleIndex + 1} — ${style.name}</title>
  <defs>${ids.defs}</defs>
  ${outer}
</svg>
`;
}

function buildCompassMark(style, idx) {
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
  const id = uid(['kmp', style.id]);
  const ids = defsBlock(id, style.mode);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <title>M${idx + 1} — ${style.name}</title>
  <defs>${ids.defs}</defs>
  <circle cx="24" cy="24" r="22" fill="url(#${ids.d})" stroke="url(#${ids.g})" stroke-width="0.95" stroke-opacity="0.55"/>
  ${style.family === 'stjarn'
    ? styleLayer(style, ids)
    : `
  <circle cx="24" cy="24" r="20" fill="url(#${ids.g})" fill-opacity="0.08"/>
  <path d="M24 8 L24 32" stroke="url(#${ids.f})" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
  <path d="M20 32 H28 V36 H20 Z" fill="url(#${ids.g})" fill-opacity="0.35"/>
  <circle cx="24" cy="8" r="2.5" fill="url(#${ids.f})" filter="url(#${ids.gl})"/>`}
  <circle cx="24" cy="22" r="2" fill="#fff8e0"/>
</svg>
`;
}

function buildAppIcon(style, idx) {
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

function main() {
  let count = 0;

  const coreApp = join(outDir, 'core/app');
  const coreKompass = join(outDir, 'core/kompass');
  const coreKompis = join(outDir, 'core/kompis');
  mkdirSync(coreApp, { recursive: true });
  mkdirSync(coreKompass, { recursive: true });
  mkdirSync(coreKompis, { recursive: true });

  STYLES.forEach((style, i) => {
    writeFileSync(join(coreApp, `B${i + 1}-${style.id}.svg`), buildAppIcon(style, i), 'utf8');
    writeFileSync(join(coreKompass, `D${i + 1}-${style.id}.svg`), buildCompassMark(style, i), 'utf8');
    writeFileSync(join(coreKompis, `M${i + 1}-${style.id}.svg`), buildKompisMark(style, i), 'utf8');
    count += 3;
  });

  for (const cat of CATEGORIES) {
    const sub = join(outDir, cat.dir);
    mkdirSync(sub, { recursive: true });
    STYLES.forEach((style, idx) => {
      const fn = `${cat.prefix}${idx + 1}-${style.id}.svg`;
      writeFileSync(join(sub, fn), buildRoundIcon(cat.key, style, idx, cat.prefix), 'utf8');
      count++;
    });
  }

  console.log(`[generate_icon_proposals_v4] Wrote ${count} SVGs → ${outDir}`);
}

main();
