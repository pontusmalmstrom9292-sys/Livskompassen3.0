#!/usr/bin/env node
/**
 * AI Governance validation — files, phase hierarchy, Copilot phrase parity with pack:copilot.
 * Run: npm run smoke:governance
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COPILOT_REQUIRED_PHRASES,
  GOVERNANCE_REQUIRED_FILES,
  AI_GOVERNANCE_SECTIONS,
} from './lib/governance_phrases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

for (const rel of GOVERNANCE_REQUIRED_FILES) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Missing required file: ${rel}`);
  }
}

// Enforce uppercase canonical doc names on case-sensitive filesystems
const docsDir = join(root, 'docs');
if (existsSync(docsDir)) {
  const names = readdirSync(docsDir);
  for (const wrong of ['Roadmap.md', 'Dashboard.md', 'Progress.md']) {
    if (names.includes(wrong)) {
      errors.push(`Wrong filename case: docs/${wrong} — use UPPERCASE (ROADMAP, DASHBOARD, PROGRESS)`);
    }
  }
}

if (existsSync(join(root, 'docs/Progress.md.new'))) {
  errors.push('Orphan file docs/Progress.md.new — delete');
}

const projectStatePath = join(root, 'docs/PROJECT_STATE.md');
if (existsSync(projectStatePath)) {
  const content = readFileSync(projectStatePath, 'utf8');
  if (!content.includes('Phase hierarchy')) {
    errors.push('PROJECT_STATE.md missing Phase hierarchy section');
  }
  if (!content.includes('Fas 24')) {
    warnings.push('PROJECT_STATE.md may be missing Fas 24 marker');
  }
  if (!content.includes('Premium UI Polish')) {
    warnings.push('PROJECT_STATE.md missing active program name');
  }
  const dateMatch = content.match(/\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) {
    warnings.push('PROJECT_STATE.md missing **Last updated:** date');
  } else {
    const ageDays = (Date.now() - new Date(dateMatch[1]).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 14) {
      warnings.push(`PROJECT_STATE.md stale (${dateMatch[1]})`);
    }
  }
}

const copilotPath = join(root, '.github/copilot-instructions.md');
if (existsSync(copilotPath)) {
  const copilot = readFileSync(copilotPath, 'utf8').toLowerCase();
  for (const phrase of COPILOT_REQUIRED_PHRASES) {
    if (!copilot.includes(phrase.toLowerCase())) {
      errors.push(`copilot-instructions.md missing phrase: ${phrase}`);
    }
  }
}

const governancePath = join(root, 'docs/AI-GOVERNANCE.md');
if (existsSync(governancePath)) {
  const gov = readFileSync(governancePath, 'utf8');
  for (const s of AI_GOVERNANCE_SECTIONS) {
    if (!gov.toLowerCase().includes(s.toLowerCase())) {
      errors.push(`AI-GOVERNANCE.md missing section: ${s}`);
    }
  }
}

const legacyGov = join(root, '.cursor/rules/livskompassen-governance.mdc');
if (existsSync(legacyGov)) {
  const leg = readFileSync(legacyGov, 'utf8');
  if (!leg.includes('ai-governance-entry.mdc') && !leg.includes('superseded')) {
    warnings.push('livskompassen-governance.mdc should point to ai-governance-entry (deprecation)');
  }
}

const entryPath = join(root, '.cursor/rules/ai-governance-entry.mdc');
const indexPath = join(root, '.cursor/index.mdc');
if (existsSync(indexPath)) {
  const index = readFileSync(indexPath, 'utf8');
  if (!index.includes('alwaysApply: true')) {
    errors.push('index.mdc must be sole alwaysApply: true (smoke:mdc kanon)');
  }
  if (!index.includes('ai-governance-entry.mdc') && !index.includes('AI-GOVERNANCE')) {
    errors.push('index.mdc must reference ai-governance-entry or AI-GOVERNANCE');
  }
}
if (existsSync(entryPath)) {
  const entry = readFileSync(entryPath, 'utf8');
  if (entry.includes('alwaysApply: true')) {
    errors.push(
      'ai-governance-entry.mdc must not use alwaysApply: true — index.mdc is sole always-on (smoke:mdc)',
    );
  }
  if (!entry.includes('ROADMAP.md')) {
    errors.push('ai-governance-entry.mdc must reference ROADMAP.md in after-task updates');
  }
}

for (const w of warnings) console.warn(`[smoke:governance] WARN: ${w}`);

if (errors.length) {
  console.error('[smoke:governance] FAIL');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `[smoke:governance] PASS (${GOVERNANCE_REQUIRED_FILES.length} files, ${COPILOT_REQUIRED_PHRASES.length} copilot phrases)`,
);
