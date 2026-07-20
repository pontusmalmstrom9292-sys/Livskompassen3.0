/**
 * Concatenate functions/src/callables/agents/*.ts for static smoke needles
 * (A11 split — former monolith agents.ts).
 */
import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function agentsCallableDir(root) {
  return resolve(root, 'functions/src/callables/agents');
}

export function readAgentsCallableSource(root) {
  const dir = agentsCallableDir(root);
  if (!existsSync(dir)) {
    throw new Error('saknar katalog: functions/src/callables/agents');
  }
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .sort();
  if (files.length === 0) {
    throw new Error('functions/src/callables/agents är tom');
  }
  return files.map((f) => readFileSync(resolve(dir, f), 'utf8')).join('\n');
}

export function assertAgentsIncludes(root, ...needles) {
  const text = readAgentsCallableSource(root);
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`functions/src/callables/agents/* saknar: ${needle}`);
    }
  }
  return text;
}
