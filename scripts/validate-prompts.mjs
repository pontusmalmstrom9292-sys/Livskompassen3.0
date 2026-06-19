#!/usr/bin/env node
/**
 * Static validation: Livskompassen prompt JSON files (hallucination + security guards).
 * Usage: npm run smoke:prompts
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validatePromptFile(relPath) {
  const fullPath = resolve(root, relPath);
  assert(existsSync(fullPath), `saknar fil: ${relPath}`);

  const content = readFileSync(fullPath, 'utf-8');

  assert(
    content.includes('Ej tillräckligt data'),
    `Prompt ${relPath} saknar hallucinationsskydd.`,
  );

  assert(
    content.match(/WORM|silo|låsta flöden/),
    `Prompt ${relPath} saknar säkerhetsinstruktioner.`,
  );

  JSON.parse(content);

  console.log(`${relPath} validerad OK.`);
}

function main() {
  console.log('[smoke:prompts] Validerar promptfiler…');
  for (const relPath of PROMPT_PATHS) {
    validatePromptFile(relPath);
  }
  console.log('[smoke:prompts] PASS');
}

main();
