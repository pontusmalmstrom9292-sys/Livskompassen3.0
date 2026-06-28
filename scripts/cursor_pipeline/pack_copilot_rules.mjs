#!/usr/bin/env node
/**
 * Pack + validate Copilot instructions against .cursor kanon.
 * Kör: npm run cursor:pipeline:pack:copilot
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const output = join(root, 'exports/cursor-pipeline/copilot-rules-pack.md');

const sources = [
  { label: 'index', path: '.cursor/index.mdc' },
  { label: 'grunder-kanon', path: '.cursor/rules/grunder-kanon.mdc' },
  { label: 'security-firestore', path: '.cursor/rules/security-firestore.mdc' },
  { label: 'memory-silo', path: '.cursor/rules/memory-silo.mdc' },
  { label: 'locked-ux', path: '.cursor/rules/locked-ux-features.mdc' },
  { label: 'anti-hallucination', path: '.cursor/rules/anti-hallucination.mdc' },
  { label: 'lead-ui-engineer', path: '.cursor/rules/lead-ui-engineer.mdc' },
  { label: 'premium-ui', path: '.cursor/rules/premium-ui.mdc' },
  { label: 'component-standards', path: '.cursor/rules/component-standards.mdc' },
  { label: 'lead-ui-engineer', path: '.cursor/rules/lead-ui-engineer.mdc' },
  { label: 'copilot-instructions', path: '.github/copilot-instructions.md' },
];

const requiredPhrases = [
  'WORM',
  'tre silos',
  'DCAP',
  'sharedRules.ts',
  'smoke:predeploy',
  'Locked UX',
  'Lead UI Engineer',
];

function read(path) {
  const abs = join(root, path);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf8');
}

const sections = [];
const missing = [];
for (const s of sources) {
  const text = read(s.path);
  if (!text) {
    missing.push(s.path);
    continue;
  }
  sections.push(`## ${s.label}\n\n\`\`\`\n${text.slice(0, 12000)}\n\`\`\`\n`);
}

const copilot = read('.github/copilot-instructions.md') ?? '';
const drift = requiredPhrases.filter((p) => !copilot.toLowerCase().includes(p.toLowerCase()));

mkdirSync(dirname(output), { recursive: true });
const body = [
  '# Copilot rules pack',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  drift.length ? `## DRIFT WARN\n\nSaknas i copilot-instructions.md: ${drift.join(', ')}` : '## DRIFT: none',
  missing.length ? `## MISSING\n\n${missing.join(', ')}` : '',
  '',
  ...sections,
].filter(Boolean).join('\n');

writeFileSync(output, body, 'utf8');
console.log(`[pack:copilot] → ${output}`);
if (missing.length) {
  console.error('[pack:copilot] FAIL — saknade källfiler:', missing.join(', '));
  process.exit(1);
}
if (drift.length) {
  console.error('[pack:copilot] WARN — copilot-instructions drift:', drift.join(', '));
  process.exit(1);
}
console.log('[pack:copilot] PASS');
