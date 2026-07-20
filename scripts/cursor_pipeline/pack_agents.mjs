import { readAgentsCallableSource, assertAgentsIncludes } from '../lib/readAgentsCallableSource.mjs';
#!/usr/bin/env node
/**
 * Repomix för AI-agents / ADK / SynapseBus (Cursor Pipeline paket).
 * Kör: npm run cursor:pipeline:pack:agents
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runRepomixPack } from '../lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const output = join(root, 'exports/cursor-pipeline/agents-pack.md');

const include = [
  '.context/agents.md',
  'AGENTS.md',
  'docs/pipeline-studio/tools/*.json',
  'functions/src/adk/**',
  'functions/src/agents/**',
  'functions/src/callables/agents/index.ts',
  'functions/src/callables/pipelineStudio.ts',
  'functions/src/lib/pipelineRunStore.ts',
  'scripts/pipeline-studio/**',
  'scripts/smoke_orkester_wiring.mjs',
  'scripts/smoke_agents_ui.mjs',
  'scripts/smoke_synapse_triggers.mjs',
];

runRepomixPack({
  root,
  output,
  include,
  label: 'cursor-pipeline agents-pack (ADK + SynapseBus + agent cards)',
});
