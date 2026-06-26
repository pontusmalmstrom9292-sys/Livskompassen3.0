#!/usr/bin/env node
/**
 * Sync human-readable prompt mirrors from functions/src/sharedRules.ts
 * Usage: npm run prompts:sync [--check]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const sharedRulesPath = resolve(root, 'functions/src/sharedRules.ts');
const outDir = resolve(root, 'docs/prompts');

/** @type {Array<{ constant: string, file: string, agentId?: string, callables?: string[] }>} */
const MIRRORS = [
  { constant: 'SANNING_ANALYTIKERN_SYSTEM_PROMPT', file: 'SANNINGS-ANALYTIKERN-PROMPT.md', agentId: 'agent_sannings_analytikern', callables: ['valvChatQuery', 'compareVaultEvidence'] },
  { constant: 'SPEGLINGS_COACHEN_SYSTEM_PROMPT', file: 'SPEGLINGSCOACHEN-PROMPT.md', agentId: 'agent_speglings_coachen', callables: ['speglingsMirror'] },
  { constant: 'MONSTER_ARKIVARIEN_SYSTEM_PROMPT', file: 'MONSTER-ARKIVARIEN-PROMPT.md', agentId: 'agent_monster_arkivarien', callables: ['generateWeeklyInsights', 'valvChatQuery'] },
  { constant: 'MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT', file: 'MONSTER-ARKIVARIEN-BARNEN-PROMPT.md', agentId: 'agent_monster_arkivarien_barnen', callables: ['childrenLogsQuery'] },
  { constant: 'BRUSFILTER_SYSTEM_INSTRUCTION', file: 'BRUSFILTRET-PROMPT.md', agentId: 'agent_brusfiltret', callables: ['processBrusfilter'] },
  { constant: 'GRANS_ARKITEKTEN_SYSTEM_PROMPT', file: 'GRANS-ARKITEKTEN-PROMPT.md', agentId: 'agent_grans_arkitekten', callables: ['analyzeMessage'] },
  { constant: 'BIFF_REWRITE_DRAFT_SYSTEM_PROMPT', file: 'BIFF-REWRITE-DRAFT-PROMPT.md', agentId: 'agent_biff_skolden', callables: ['biffRewriteDraft'] },
  { constant: 'UPPGIFTS_KROSSAREN_SYSTEM_PROMPT', file: 'UPPGIFTS-KROSSAREN-PROMPT.md', agentId: 'agent_uppgifts_krossaren', callables: ['crushTask'] },
  { constant: 'PARALYS_BRYTAREN_SYSTEM_PROMPT', file: 'PARALYS-BRYTAREN-PROMPT.md', agentId: 'agent_paralys_brytaren', callables: ['breakDownResponse'] },
  { constant: 'RSD_KYLAREN_SYSTEM_PROMPT', file: 'RSD-KYLAREN-PROMPT.md', agentId: 'agent_rsd_kylaren', callables: ['analyzeMessage'] },
  { constant: 'INKORG_SORTERARE_SYSTEM_PROMPT', file: 'INKORG-SORTERARE-PROMPT.md', callables: ['previewInboxClassification', 'submitInkastLite'] },
  { constant: 'VÄVAREN_SYSTEM_PROMPT', file: 'VAVAREN-PROMPT.md', callables: ['weaveJournalEntry'] },
  { constant: 'LIVS_ARKIVARIEN_SYSTEM_PROMPT', file: 'LIVS-ARKIVARIEN-PROMPT.md', agentId: 'agent_livs_arkivarien', callables: ['knowledgeVaultQuery'] },
  { constant: 'KOMPIS_SYSTEM_PROMPT', file: 'KOMPIS-PROMPT.md', agentId: 'agent_kompis_supervisor', callables: ['chatWithKompis'] },
  { constant: 'DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT', file: 'DAGBOK-SNABB-COACH-PROMPT.md', callables: ['journalQuickMirror'] },
  { constant: 'MABRA_COACHEN_SYSTEM_PROMPT', file: 'MABRA-COACH-PROMPT.md', agentId: 'agent_mabra_coachen', callables: ['mabraCoach'] },
  { constant: 'VIT_CHAT_COACH_SYSTEM_PROMPT', file: 'VIT-CHAT-COACH-PROMPT.md', callables: ['mabraCoach'] },
  { constant: 'KBT_TRANSFORMATOR_SYSTEM_PROMPT', file: 'KBT-TRANSFORMATOR-PROMPT.md', callables: ['mabraCoach'] },
  { constant: 'DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT', file: 'DCAP-SEMANTIC-PROMPT.md', callables: ['DCAP.ts'] },
  { constant: 'VOICE_TO_VAULT_SYSTEM_PROMPT', file: 'VOICE-TO-VAULT-PROMPT.md', callables: ['ingestWidgetRecording'] },
  { constant: 'VOICE_COMMAND_SYSTEM_PROMPT', file: 'VOICE-COMMAND-PROMPT.md', callables: ['parseVoiceCommand'] },
  { constant: 'KOMPASSRAD_SYSTEM_PROMPT', file: 'KOMPASSRAD-PROMPT.md', callables: ['generateKompassrad'] },
  { constant: 'JOURNAL_SILENT_REFLECTION_PROMPT', file: 'JOURNAL-SILENT-REFLECTION-PROMPT.md', callables: ['journalSilentReflection'] },
];

function extractPrompt(source, constantName) {
  const domainMarker = 'export const DOMAIN_COVERT_HCF_LENS = `';
  const domainStart = source.indexOf(domainMarker);
  const domainEnd = source.indexOf('`;', domainStart + domainMarker.length);
  const domainLens =
    domainStart >= 0 ? `${source.slice(domainStart + domainMarker.length, domainEnd)}\n` : '';

  const marker = `export const ${constantName} = `;
  const i = source.indexOf(marker);
  if (i < 0) return null;

  let j = i + marker.length;
  if (source.slice(j, j + '${DOMAIN_COVERT_HCF_LENS}'.length) === '${DOMAIN_COVERT_HCF_LENS}') {
    j = source.indexOf('`', j) + 1;
    const end = source.indexOf('`;', j);
    return domainLens + source.slice(j, end);
  }
  if (source[j] !== '`') return null;
  j += 1;
  const end = source.indexOf('`;', j);
  return source.slice(j, end);
}

function buildMirror({ constant, file, agentId, callables }, body) {
  const today = new Date().toISOString().slice(0, 10);
  const meta = [
    '<!-- AUTO-SYNCED — redigera functions/src/sharedRules.ts, kör npm run prompts:sync -->',
    '',
    `**Runtime-källa:** \`functions/src/sharedRules.ts\` → \`${constant}\``,
    agentId ? `**Agent-ID:** \`${agentId}\`` : null,
    callables?.length ? `**Callables:** ${callables.map((c) => `\`${c}\``).join(' · ')}` : null,
    `**Synkad:** ${today} · **Status:** produktion (läsbar spegel, ej runtime)`,
    '',
    '---',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  const bodyBlock =
    body.startsWith('# System Prompt:') || body.startsWith('# ')
      ? body
      : `# ${constant.replace(/_SYSTEM_PROMPT|_SYSTEM_INSTRUCTION/g, '').replace(/_/g, ' ')}\n\n${body}`;

  return `${meta}${bodyBlock}\n`;
}

function hash(content) {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const source = readFileSync(sharedRulesPath, 'utf-8');
  let changed = 0;
  let failed = 0;

  for (const mirror of MIRRORS) {
    const body = extractPrompt(source, mirror.constant);
    if (!body) {
      console.error(`[prompts:sync] FAIL — kunde inte extrahera ${mirror.constant}`);
      failed += 1;
      continue;
    }
    const content = buildMirror(mirror, body);
    const outPath = resolve(outDir, mirror.file);
    const prev = existsSync(outPath) ? readFileSync(outPath, 'utf-8') : '';
    const prevBody = prev.replace(/<!--[\s\S]*?---\n\n/, '');
    const newBody = content.replace(/<!--[\s\S]*?---\n\n/, '');

    if (hash(prevBody) !== hash(newBody)) {
      if (checkOnly) {
        console.error(`[prompts:sync] DRIFT — ${mirror.file} inte synkad med ${mirror.constant}`);
        failed += 1;
      } else {
        writeFileSync(outPath, content, 'utf-8');
        console.log(`[prompts:sync] uppdaterad ${mirror.file}`);
        changed += 1;
      }
    } else {
      console.log(`[prompts:sync] OK ${mirror.file}`);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
  console.log(`[prompts:sync] ${checkOnly ? 'CHECK' : 'SYNC'} PASS (${changed} uppdaterade)`);
}

main();
