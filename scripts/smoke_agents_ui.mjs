/**
 * Static + unit smoke: Agent UX P0/P1 wiring.
 * Usage: npm run smoke:agents-ui
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readAgentsCallableSource, assertAgentsIncludes } from './lib/readAgentsCallableSource.mjs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

console.log('[smoke:agents-ui] Shared agents module...');
mustInclude('src/modules/shared/agents/api/agentRegistryService.ts', 'getAgentRegistry', 'fetchAgentRegistry');
mustInclude('src/modules/shared/agents/hooks/useAgentRegistry.tsx', 'AgentRegistryProvider', 'useAgentRegistry');
mustInclude('src/modules/shared/agents/components/AgentRoutingBadge.tsx', 'AgentRoutingBadge');
mustInclude('src/modules/shared/agents/components/AgentResponseFooter.tsx', 'AgentResponseFooter');
mustInclude('src/modules/shared/agents/utils/resolveExecutorDisplay.ts', 'resolveExecutorId');

console.log('[smoke:agents-ui] Valv Orkester wiring...');
mustInclude(
  'src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx',
  'AgentRegistryProvider',
  'AdkAgentRegistryPanel',
  'AgentRoutingBadge',
  'analyzeBiffMessageInVault',
  'Assistentroller',
  'vaultTab=sok',
  'glow="blue"',
);

console.log('[smoke:agents-ui] Valv Sök P1...');
mustInclude(
  'src/modules/features/lifeJournal/evidence/vaultChat/components/SanningsAnalytikernHeader.tsx',
  'Sannings-Analytikern',
);
mustInclude(
  'src/modules/features/lifeJournal/evidence/vaultChat/components/ValvChatPanel.tsx',
  'SanningsAnalytikernHeader',
  'AgentResponseFooter',
);

console.log('[smoke:agents-ui] Backend callable...');
assertAgentsIncludes(root, 'getAgentRegistry', 'listAgentCards', 'valv_orkester', 'assertVaultSession');
mustInclude('functions/src/index.ts', 'getAgentRegistry');

console.log('[smoke:agents-ui] Unit tests...');
execSync('npx vitest run src/modules/shared/agents/utils/resolveExecutorDisplay.test.ts src/modules/shared/agents/utils/routingBadgeText.test.ts', {
  cwd: root,
  stdio: 'inherit',
});

console.log('[smoke:agents-ui] PASS');
