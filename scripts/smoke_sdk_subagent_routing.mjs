#!/usr/bin/env node
/**
 * Verifierar yolo_subagent_router — alla build-manifest agenter ska resolve.
 * Usage: npm run smoke:sdk-subagent-routing
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveSubagent,
  resolveAgentFile,
  listRegisteredAgents,
} from './lib/yolo_subagent_router.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function main() {
  console.log('[smoke:sdk-subagent-routing] Agent registry…');
  const agents = listRegisteredAgents();
  assert(agents.length >= 20, `För få agenter i .cursor/agents (${agents.length})`);

  const manifestPath = resolve(root, '.orkester/cursor-yolo-build-manifest.json');
  assert(existsSync(manifestPath), 'Saknar cursor-yolo-build-manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  console.log('[smoke:sdk-subagent-routing] Build manifest agenter…');
  for (const wave of manifest.waves ?? []) {
    const resolved = resolveSubagent({
      agent: wave.agent,
      title: wave.title,
      plan: wave.plan,
      id: wave.id,
    });
    assert(resolved.agentId, `v${wave.version}: ingen agentId`);
    const file = resolveAgentFile(resolved.agentId);
    assert(file?.file, `v${wave.version}: agent ${resolved.agentId} saknar fil`);
    console.log(`  v${wave.version} ${wave.agent} → ${resolved.agentId} (${resolved.source})`);
  }

  console.log('[smoke:sdk-subagent-routing] Keyword routing…');
  const nav = resolveSubagent({
    title: 'Navigation drawer accordion',
    plan: 'navTruth flikar',
    id: 'test-nav',
  });
  assert(nav.agentId.includes('ux') || nav.agentId.includes('guardian'), 'nav routing fail');

  console.log('[smoke:sdk-subagent-routing] PASS');
}

main();
