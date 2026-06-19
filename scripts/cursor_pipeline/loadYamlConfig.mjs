#!/usr/bin/env node
/** Minimal YAML loader for pipeline config — uses `yaml` if available, else JSON fallback. */
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * @param {string} configPath
 * @returns {Record<string, unknown>}
 */
export function loadYamlConfig(configPath) {
  if (!existsSync(configPath)) {
    throw new Error(`Pipeline config saknas: ${configPath}`);
  }
  const text = readFileSync(configPath, 'utf8');
  const jsonFallback = configPath.replace(/\.yaml$/, '.json');
  try {
    const { parse } = require('yaml');
    return parse(text);
  } catch {
    if (existsSync(jsonFallback)) {
      return JSON.parse(readFileSync(jsonFallback, 'utf8'));
    }
    throw new Error(
      'Installera devDependency "yaml" (npm install -D yaml) eller lägg till .json-fallback.',
    );
  }
}

/**
 * @param {unknown} config
 */
export function validatePipelineConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Pipeline config måste vara ett objekt.');
  }
  const c = /** @type {Record<string, unknown>} */ (config);
  if (c.version !== 1) {
    throw new Error(`Unsupported pipeline version: ${c.version}`);
  }
  if (!Array.isArray(c.packages) || c.packages.length === 0) {
    throw new Error('packages[] saknas eller är tom.');
  }
  for (const pkg of c.packages) {
    const p = /** @type {Record<string, unknown>} */ (pkg);
    if (!p.id || !p.packCommand || !p.promptTemplate) {
      throw new Error(`Paket saknar id, packCommand eller promptTemplate: ${JSON.stringify(pkg)}`);
    }
  }
  const build = /** @type {Record<string, unknown>} */ (c.build ?? {});
  if (!Array.isArray(build.phases) || build.phases.length === 0) {
    throw new Error('build.phases[] saknas eller är tom.');
  }
  return c;
}

export const defaultConfigPath = join(__dirname, '../../.cursor/pipeline/livskompassen-v2.yaml');
