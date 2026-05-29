#!/usr/bin/env node
/**
 * 10 Kognitiv Sköld — bakgrund + ikonstil (mobil mock 390×844).
 * Usage: node scripts/generate_kognitiv_skold_variants.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../docs/design/themes/kognitiv-skold-variants/svg');
mkdirSync(outDir, { recursive: true });

const W = 390;
const H = 844;

/** @typedef {{ id: string; title: string; bg: string; shield: string; rim: string; gold: string; glow: string; iconMode: 'emboss' | 'line' | 'gem' | 'pansar' }} Variant */
const VARIANTS = /** @type {Variant[]} */ ([
  {
    id: 'K01-sjo-solnedgang',
    title: 'Sjö solnedgång (kanon)',
    bg: 'k01bg',
    shield: '#0d3b3b',
    rim: '#d4af37',
    gold: '#f5e6b8',
    glow: '#ffb74d',
    iconMode: 'emboss',
  },
  {
    id: 'K02-aurora-fjall',
    title: 'Aurora fjällsjö',
    bg: 'k02bg',
    shield: '#0a2838',
    rim: '#7ec8e3',
    gold: '#c8e6ff',
    glow: '#4dd0e1',
    iconMode: 'gem',
  },
  {
    id: 'K03-obsidian-stjarna',
    title: 'Obsidian stjärnhimmel',
    bg: 'k03bg',
    shield: '#121018',
    rim: '#9a8b6a',
    gold: '#e8dcc8',
    glow: '#fff8e7',
    iconMode: 'line',
  },
  {
    id: 'K04-hamn-ember',
    title: 'Hamn ember strand',
    bg: 'k04bg',
    shield: '#2a1f14',
    rim: '#c97b4a',
    gold: '#ffd9a8',
    glow: '#ff8a50',
    iconMode: 'emboss',
  },
  {
    id: 'K05-regn-dimma',
    title: 'Regn dimma teal',
    bg: 'k05bg',
    shield: '#0f2e2a',
    rim: '#5ee0b8',
    gold: '#b8f0d8',
    glow: '#2ee6a6',
    iconMode: 'line',
  },
  {
    id: 'K06-nordic-flat',
    title: 'Nordic flat guld',
    bg: 'k06bg',
    shield: '#142220',
    rim: '#d4af37',
    gold: '#d4af37',
    glow: '#d4af37',
    iconMode: 'line',
  },
  {
    id: 'K07-frost-is',
    title: 'Frost isreflex',
    bg: 'k07bg',
    shield: '#1a2830',
    rim: '#b8d4e8',
    gold: '#e8f4ff',
    glow: '#ffffff',
    iconMode: 'gem',
  },
  {
    id: 'K08-valv-marmor',
    title: 'Valv marmor pansar',
    bg: 'k08bg',
    shield: '#1c1a18',
    rim: '#d4af37',
    gold: '#f0e0b0',
    glow: '#c9a227',
    iconMode: 'pansar',
  },
  {
    id: 'K09-astrolab-sacred',
    title: 'Astrolab sacred',
    bg: 'k09bg',
    shield: '#0c2a28',
    rim: '#d4af37',
    gold: '#f5e6b8',
    glow: '#ffe082',
    iconMode: 'emboss',
  },
  {
    id: 'K10-urban-rim',
    title: 'Urban dusk rim',
    bg: 'k10bg',
    shield: '#101820',
    rim: '#8b7cf6',
    gold: '#d4af37',
    glow: '#64ffda',
    iconMode: 'gem',
  },
]);

function bgDefs(v) {
  const maps = {
    k01bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a2830"/>
        <stop offset="45%" stop-color="#2a1810"/>
        <stop offset="100%" stop-color="#0a1210"/>
      </linearGradient>
      <radialGradient id="${v.bg}sun" cx="50%" cy="72%" r="45%">
        <stop offset="0%" stop-color="#ff9a4d" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#ff9a4d" stop-opacity="0"/>
      </radialGradient>`,
    k02bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a1020"/>
        <stop offset="50%" stop-color="#102838"/>
        <stop offset="100%" stop-color="#1a0830"/>
      </linearGradient>
      <radialGradient id="${v.bg}aur" cx="30%" cy="15%" r="55%">
        <stop offset="0%" stop-color="#4dd0e1" stop-opacity="0.45"/>
        <stop offset="50%" stop-color="#7e57c2" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#7e57c2" stop-opacity="0"/>
      </radialGradient>`,
    k03bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#080810"/>
        <stop offset="100%" stop-color="#141018"/>
      </linearGradient>`,
    k04bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3a2010"/>
        <stop offset="55%" stop-color="#5a3018"/>
        <stop offset="100%" stop-color="#120a08"/>
      </linearGradient>
      <radialGradient id="${v.bg}glow" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#ff8a50" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ff8a50" stop-opacity="0"/>
      </radialGradient>`,
    k05bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1818"/>
        <stop offset="100%" stop-color="#0f2824"/>
      </linearGradient>`,
    k06bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1614"/>
        <stop offset="100%" stop-color="#12151f"/>
      </linearGradient>`,
    k07bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#c8dce8"/>
        <stop offset="40%" stop-color="#6a8a9a"/>
        <stop offset="100%" stop-color="#1a2830"/>
      </linearGradient>`,
    k08bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2a2824"/>
        <stop offset="100%" stop-color="#0e0c0a"/>
      </linearGradient>`,
    k09bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#061818"/>
        <stop offset="100%" stop-color="#102820"/>
      </linearGradient>`,
    k10bg: `
      <linearGradient id="${v.bg}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#181420"/>
        <stop offset="100%" stop-color="#0a1018"/>
      </linearGradient>
      <linearGradient id="${v.bg}rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#64ffda" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#8b7cf6" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#d4af37" stop-opacity="0.3"/>
      </linearGradient>`,
  };
  return maps[v.bg] || maps.k01bg;
}

function bgLayers(v) {
  const extra = {
    k01bg: `<rect width="${W}" height="${H}" fill="url(#${v.bg}sun)"/>`,
    k02bg: `<rect width="${W}" height="${H}" fill="url(#${v.bg}aur)"/>`,
    k04bg: `<rect width="${W}" height="${H}" fill="url(#${v.bg}glow)"/>`,
    k03bg: Array.from({ length: 40 }, (_, i) => {
      const x = (i * 47) % W;
      const y = (i * 31) % (H * 0.6);
      return `<circle cx="${x}" cy="${y}" r="0.8" fill="#fff" opacity="${0.15 + (i % 5) * 0.08}"/>`;
    }).join(''),
    k10bg: `<rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="28" fill="none" stroke="url(#${v.bg}rim)" stroke-width="2"/>`,
  };
  return extra[v.bg] || '';
}

function shieldGeometry(v, cx, cy, r) {
  const gid = `shield-${v.id}`;
  const stroke = v.rim;
  const fill = v.shield;
  const pansar = v.iconMode === 'pansar' ? 'stroke-width="5"' : 'stroke-width="2.5"';
  return `
  <g id="${gid}">
    <circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="none" stroke="${stroke}" opacity="0.35" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" ${pansar} opacity="0.95"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 12}" fill="none" stroke="${stroke}" stroke-width="1" opacity="0.5" stroke-dasharray="4 6"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i * 45 * Math.PI) / 180;
      const x2 = cx + Math.cos(a) * (r - 18);
      const y2 = cy + Math.sin(a) * (r - 18);
      return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="0.6" opacity="0.35"/>`;
    }).join('')}
    <polygon points="${cx},${cy - r + 28} ${cx - 10},${cy + 8} ${cx + 10},${cy + 8}" fill="url(#needle-${v.id})" stroke="${v.gold}" stroke-width="0.8"/>
    <circle cx="${cx}" cy="${cy}" r="10" fill="#080808" stroke="${v.gold}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy - r + 20}" r="3" fill="${v.glow}" opacity="0.9"/>
  </g>`;
}

function miniIcons(v, cx, cy, r) {
  const g = v.gold;
  const sw = v.iconMode === 'line' ? 1.2 : 1.6;
  const fill = v.iconMode === 'line' ? 'none' : g;
  const op = v.iconMode === 'gem' ? 0.95 : 0.85;
  const slots = [
    { a: -90, d: 'M-6,-10 L6,-10 L0,8 Z' }, // arrow
    { a: 0, d: 'M-8,-6 h16 v12 h-16 z M-4,-2 h8' }, // book
    { a: 90, d: 'M-10,4 h20 M0,4 v-8 M-6,4 h12' }, // scale
    { a: 180, d: 'M0,6 Q-6,-4 0,-10 Q6,-4 0,6' }, // sprout
  ];
  return slots
    .map(({ a, d }) => {
      const rad = ((a - 90) * Math.PI) / 180;
      const ox = cx + Math.cos(rad) * (r - 36);
      const oy = cy + Math.sin(rad) * (r - 36);
      return `<g transform="translate(${ox},${oy}) rotate(${a})" opacity="${op}">
        <path d="${d}" fill="${fill}" stroke="${g}" stroke-width="${sw}" transform="scale(0.9)"/>
      </g>`;
    })
    .join('');
}

function labelChip(x, y, text, v) {
  return `
  <g transform="translate(${x},${y})">
    <rect x="0" y="0" width="${text.length * 7 + 28}" height="22" rx="4" fill="rgba(0,0,0,0.55)" stroke="${v.rim}" stroke-width="1"/>
    <rect x="6" y="6" width="10" height="10" rx="2" fill="none" stroke="${v.gold}" stroke-width="1"/>
    <path d="M8 11 L10 13 L14 9" stroke="${v.gold}" stroke-width="1" fill="none"/>
    <text x="22" y="15" fill="${v.gold}" font-family="Inter,sans-serif" font-size="9">${text}</text>
  </g>`;
}

function buildSvg(v) {
  const cx = 195;
  const cy = 340;
  const r = 118;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <title>${v.title}</title>
  <defs>
    ${bgDefs(v)}
    <linearGradient id="needle-${v.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${v.glow}"/>
      <stop offset="100%" stop-color="${v.gold}"/>
    </linearGradient>
    <filter id="glow-${v.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${v.bg})"/>
  ${bgLayers(v)}
  <text x="195" y="52" text-anchor="middle" fill="${v.gold}" font-family="Georgia,serif" font-size="11" letter-spacing="3">STYR MED MENING</text>
  <text x="195" y="68" text-anchor="middle" fill="${v.gold}" font-size="9" opacity="0.75" font-family="Inter,sans-serif">Lev med riktning</text>
  <rect x="318" y="38" width="52" height="24" rx="6" fill="rgba(0,0,0,0.5)" stroke="${v.rim}" stroke-width="1"/>
  <text x="344" y="54" text-anchor="middle" fill="${v.gold}" font-size="11" font-family="Inter,sans-serif">128</text>
  <path d="M195,${cy - r - 42} A 90 90 0 0 1 285 ${cy - r - 8}" fill="none" id="arc-${v.id}"/>
  <text fill="${v.gold}" font-family="Georgia,serif" font-size="13" letter-spacing="4">
    <textPath href="#arc-${v.id}" startOffset="12%">KOGNITIV SKÖLD</textPath>
  </text>
  <g filter="url(#glow-${v.id})">
    ${shieldGeometry(v, cx, cy, r)}
    ${miniIcons(v, cx, cy, r)}
  </g>
  ${labelChip(24, cy - 90, 'rutiner', v)}
  ${labelChip(24, cy + 20, 'budget', v)}
  <text x="${cx}" y="${cy + r + 36}" text-anchor="middle" fill="${v.gold}" font-size="9" font-family="Inter,sans-serif">personlig utveckling</text>
  <g transform="translate(20, ${H - 160})">
    <rect width="350" height="72" rx="12" fill="rgba(8,12,18,0.78)" stroke="${v.rim}" stroke-width="2"/>
    <circle cx="36" cy="36" r="14" fill="none" stroke="${v.gold}" stroke-width="1.2"/>
    <polygon points="36,26 40,38 32,38" fill="${v.gold}" opacity="0.8"/>
    <text x="58" y="28" fill="${v.gold}" font-family="Inter,sans-serif" font-size="11" font-weight="600">Dagens riktning</text>
    <text x="58" y="48" fill="#e8e4dc" font-size="9" font-family="Inter,sans-serif">Små steg i rätt riktning skapar det liv</text>
    <text x="58" y="60" fill="#e8e4dc" font-size="9" font-family="Inter,sans-serif">du drömmer om.</text>
    <path d="M330 36 L338 36 M334 32 L338 36 L334 40" stroke="${v.gold}" stroke-width="1.5" fill="none"/>
  </g>
  <g transform="translate(155, ${H - 48})">
    ${[0, 1, 2, 3, 4]
      .map((i) => `<circle cx="${i * 16}" cy="0" r="3" fill="${i === 1 ? v.gold : '#4a4a4a'}"/>`)
      .join('')}
  </g>
  <text x="12" y="${H - 8}" fill="#6b7280" font-size="8" font-family="monospace">${v.id}</text>
</svg>`;
}

for (const v of VARIANTS) {
  const path = resolve(outDir, `${v.id}.svg`);
  writeFileSync(path, buildSvg(v), 'utf8');
  console.log('Skrev:', path);
}

console.log(`\n${VARIANTS.length} varianter → docs/design/themes/kognitiv-skold-variants/svg/`);
