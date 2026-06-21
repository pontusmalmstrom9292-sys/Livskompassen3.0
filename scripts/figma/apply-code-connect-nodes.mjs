#!/usr/bin/env node
/**
 * Apply Figma node IDs from L0-atoms plugin export.
 *
 * Updates:
 * - src/figma/designSystem.ts (registry)
 * - src/figma/connect/*.figma.tsx (FIGMA_URL string literals — required by Figma CLI)
 *
 * Usage:
 *   node scripts/figma/apply-code-connect-nodes.mjs '{"BentoCard":"123:456",...}'
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const designSystemPath = resolve(root, 'src/figma/designSystem.ts');
const connectDir = resolve(root, 'src/figma/connect');

const connectFiles = {
  BentoCard: 'BentoCard.figma.tsx',
  'Hub/Header': 'HubHeader.figma.tsx',
  EmptyState: 'EmptyState.figma.tsx',
  HubPanelSkeleton: 'HubPanelSkeleton.figma.tsx',
  'Dock/Shell': 'DockShell.figma.tsx',
  DockNavButton: 'DockNavButton.figma.tsx',
  'Button/BIFF': 'BiffRewriteButton.figma.tsx',
  StatusBadge: 'StatusBadge.figma.tsx',
  HubDropdownNav: 'HubDropdownNav.figma.tsx',
  CognitiveLoadStrip: 'CognitiveLoadStrip.figma.tsx',
};

const rawArg = process.argv[2];
if (!rawArg) {
  console.error('Usage: node scripts/figma/apply-code-connect-nodes.mjs <json-string-or-file>');
  process.exit(1);
}

let nodes;
try {
  nodes = rawArg.trim().startsWith('{')
    ? JSON.parse(rawArg)
    : JSON.parse(readFileSync(resolve(process.cwd(), rawArg), 'utf8'));
} catch (err) {
  console.error('Kunde inte läsa JSON:', err.message);
  process.exit(1);
}

let designSrc = readFileSync(designSystemPath, 'utf8');

// Läs in befintliga IDs som fallback för att tillåta partiella uppdateringar
const idMatch = designSrc.match(/export const FIGMA_COMPONENT_NODE_IDS = \{([\s\S]*?)\} as const;/);
if (idMatch) {
  const lines = idMatch[1].split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*['"]?([^'":]+)['"]?\s*:\s*['"]([^'"]+)['"]/);
    if (match) {
      const key = match[1];
      const val = match[2];
      if (!nodes[key]) {
        nodes[key] = val;
      }
    }
  }
}

const required = Object.keys(connectFiles);
for (const key of required) {
  if (!nodes[key] || !/^\d+:\d+$/.test(nodes[key])) {
    console.error(`Saknar giltigt node-id för "${key}" (format 123:456)`);
    process.exit(1);
  }
}

const fileKey = 'Qp6b3nSJXq7qgFiwvDBk2C';
const fileSlug = 'Livskompassen-Obsidian-Calm';

function urlFor(id) {
  return `https://www.figma.com/design/${fileKey}/${fileSlug}?node-id=${id.replace(':', '-')}`;
}

const idsBlockLines = Object.keys(connectFiles).map(key => `  '${key}': '${nodes[key]}',`);
const idsBlock = `export const FIGMA_COMPONENT_NODE_IDS = {
${idsBlockLines.join('\n')}
} as const;`;

const urlsBlockLines = Object.keys(connectFiles).map(key => `  '${key}': '${urlFor(nodes[key])}',`);
const urlsBlock = `export const FIGMA_CONNECT_URLS: Record<FigmaComponentKey, string> = {
${urlsBlockLines.join('\n')}
};`;

// designSrc är redan inläst ovan
designSrc = designSrc.replace(
  /export const FIGMA_COMPONENT_NODE_IDS = \{[\s\S]*?\} as const;/,
  idsBlock,
);
designSrc = designSrc.replace(
  /export const FIGMA_CONNECT_URLS: Record<FigmaComponentKey, string> = \{[\s\S]*?\};/,
  urlsBlock,
);
writeFileSync(designSystemPath, designSrc, 'utf8');

for (const [key, filename] of Object.entries(connectFiles)) {
  const filePath = resolve(connectDir, filename);
  const url = urlFor(nodes[key]);
  let src = readFileSync(filePath, 'utf8');
  src = src.replace(
    /'https:\/\/www\.figma\.com\/design\/Qp6b3nSJXq7qgFiwvDBk2C\/Livskompassen-Obsidian-Calm\?node-id=[^']+'/,
    `'${url}'`,
  );
  writeFileSync(filePath, src, 'utf8');
  console.log(`✓ ${filename} → node-id=${nodes[key].replace(':', '-')}`);
}

console.log('✓ Uppdaterade src/figma/designSystem.ts');
