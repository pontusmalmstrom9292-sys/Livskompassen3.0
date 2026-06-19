#!/usr/bin/env node
/** Load P1 Flow Tool Definitions from docs/pipeline-studio/tools/ */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const toolsDir = join(root, 'docs/pipeline-studio/tools');

export const P1_TOOL_IDS = [
  'flow_brusfilter',
  'flow_biff_rewrite',
  'flow_dossier_foreword',
  'flow_pattern_assist',
  'flow_inkast_classify',
  'flow_valv_chat',
];

/**
 * @param {string} [toolId]
 */
export function loadFtd(toolId) {
  const path = join(toolsDir, `${toolId}.json`);
  if (!existsSync(path)) {
    throw new Error(`FTD saknas: ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function loadAllFtd() {
  return P1_TOOL_IDS.map((id) => loadFtd(id));
}

export function listToolIds() {
  if (!existsSync(toolsDir)) return [];
  return readdirSync(toolsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export { root, toolsDir };
