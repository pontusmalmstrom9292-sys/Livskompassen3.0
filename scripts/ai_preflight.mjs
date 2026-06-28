#!/usr/bin/env node
/**
 * Print mandatory AI pre-flight read list for CLI agents (Codex, Gemini, terminal).
 * Run: node scripts/ai_preflight.mjs  |  npm run ai:preflight
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const reads = [
  'docs/PROJECT_STATE.md',
  'docs/ROADMAP.md',
  'docs/TODO.md',
  'docs/DASHBOARD.md',
  'docs/AI-GOVERNANCE.md',
  '.context/system-plan.md',
];

console.log('# Livskompassen AI Pre-flight — read in order\n');
for (let i = 0; i < reads.length; i++) {
  const rel = reads[i];
  const ok = existsSync(join(root, rel));
  console.log(`${i + 1}. ${rel}${ok ? '' : ' [MISSING]'}`);
}

console.log('\n# Phase hierarchy');
console.log('- System phase: PROJECT_STATE.md (e.g. Fas 24) — wins on conflict');
console.log('- Active program: ROADMAP.md (e.g. Premium UI Polish Phase 0)');
console.log('- ROADMAP.md is NOT the system Fas number\n');

console.log('# Rules');
console.log('- Never guess phase; stay in active system phase + program');
console.log('- No redesign; no functionality removal without PMIR');
console.log('- After task: TODO, DASHBOARD, PROGRESS, ROADMAP (if program), PROJECT_STATE (if system)');
console.log('- Validate: npm run smoke:governance');
console.log('- Merge gate: npm run smoke:predeploy:build');
console.log('\n# Kanon (when touching code)');
console.log('- AGENTS.md · .github/copilot-instructions.md · .cursor/index.mdc');
console.log('- docs/DEFINITION-OF-DONE.md · docs/governance/GUARD-REGLERBOK.md');
