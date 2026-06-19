#!/usr/bin/env node
/**
 * Static validation: Livskompassen governance + prompt JSON files.
 * Usage: npm run smoke:prompts | npm run smoke:guard
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const PROMPT_PATHS = [
  'prompts/safeClassificationPrompt.json',
  'prompts/guardedAgentInstruction.json',
  'docs/prompts/SAKER-AI-PROMPTS.json',
];

const GOVERNANCE_PATHS = [
  '.cursor/rules/projectGuard.mdc',
  '.cursor/rules/guard-regelbok.mdc',
  'docs/governance/GUARD-REGLERBOK.md',
];

const EXTENDED_UNCERTAINTY = 'Ej tillräckligt data för bedömning.';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validatePromptFile(relPath) {
  const fullPath = resolve(root, relPath);
  assert(existsSync(fullPath), `saknar fil: ${relPath}`);

  const content = readFileSync(fullPath, 'utf-8');

  assert(
    content.includes('Ej tillräckligt data'),
    `Prompt ${relPath} saknar hallucinationsskydd (basfras).`,
  );

  assert(
    content.includes(EXTENDED_UNCERTAINTY) ||
      content.includes('insufficientDataPhraseExtended'),
    `Prompt ${relPath} saknar utökad osäkerhetsfras eller metadata.`,
  );

  assert(
    content.match(/WORM|silo|låsta flöden/i),
    `Prompt ${relPath} saknar säkerhetsinstruktioner.`,
  );

  JSON.parse(content);

  console.log(`${relPath} validerad OK.`);
}

function validateRegistryExtendedPhrase() {
  const registryPath = resolve(root, 'docs/prompts/SAKER-AI-PROMPTS.json');
  const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
  assert(
    registry.uncertaintyPhraseExtended === EXTENDED_UNCERTAINTY,
    'SAKER-AI-PROMPTS.json: uncertaintyPhraseExtended matchar inte kanon.',
  );
  assert(
    Array.isArray(registry.templates) && registry.templates.length >= 2,
    'SAKER-AI-PROMPTS.json: templates saknas eller otillräcklig.',
  );
  for (const tpl of registry.templates) {
    assert(
      tpl.template.includes('Ej tillräckligt data'),
      `Template ${tpl.id} saknar osäkerhetsfras.`,
    );
  }
  console.log('SAKER-AI-PROMPTS.json registry-fält validerade OK.');
}

function validateGovernanceFiles() {
  for (const relPath of GOVERNANCE_PATHS) {
    const fullPath = resolve(root, relPath);
    assert(existsSync(fullPath), `saknar governance-fil: ${relPath}`);
    const content = readFileSync(fullPath, 'utf-8');
    assert(
      content.includes('Ej tillräckligt data'),
      `${relPath} saknar hallucinationsprotokoll.`,
    );
    console.log(`${relPath} governance OK.`);
  }

  const projectGuard = readFileSync(
    resolve(root, '.cursor/rules/projectGuard.mdc'),
    'utf-8',
  );
  assert(
    projectGuard.includes('GUARD-REGLERBOK.md'),
    'projectGuard.mdc pekar inte på GUARD-REGLERBOK.md.',
  );
  assert(
    projectGuard.includes('guard-regelbok.mdc'),
    'projectGuard.mdc pekar inte på guard-regelbok.mdc.',
  );
}

function main() {
  console.log('[smoke:guard] Validerar governance + promptfiler…');
  validateGovernanceFiles();
  for (const relPath of PROMPT_PATHS) {
    validatePromptFile(relPath);
  }
  validateRegistryExtendedPhrase();
  console.log('[smoke:guard] PASS');
}

main();
