/**
 * Init Fas 22 Sprint Autorun state + dagens logg-header.
 * Usage: npm run fas22:autorun [--reset]
 *
 * Skriver:
 *   .orkester/fas22-state.json
 *   docs/evaluations/YYYY-MM-DD-fas22-log.md (header om ny)
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'fas22-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-fas22-log.md`);

/** Kanon — synkad med docs/FAS22-SPRINT-AUTORUN.md */
const FAS22_WAVES = [
  { id: 'baseline', plan: 'npm run orkester:night', deploy: 'none', agent: false },
  { id: '22.1', plan: 'Fas21→22 doc-synk + sprint-infra', deploy: 'none', agent: true },
  { id: '22.2', plan: 'M3.0-C Phase 2 PMIR (rules-eval ONLY)', deploy: 'none', agent: true },
  { id: '22.3', plan: 'M3.0-C Phase 2 Firestore wire', deploy: 'firestore:rules,hosting', agent: true },
  { id: '22.4', plan: 'Hamn brusfilter-wizard Alt A', deploy: 'hosting', agent: true },
  { id: '22.5', plan: 'Content våg 30 FACT ingest', deploy: 'none', agent: true },
  { id: '22.6', plan: 'biffRewriteDraft deploy + Hjärtat polish', deploy: 'functions:biffRewriteDraft,hosting', agent: true },
  { id: '22.7', plan: 'Valv coach WORM hygiene', deploy: 'functions:mabraCoach', agent: true },
  { id: '22.8', plan: 'Hem→Hjärtat genväg polish', deploy: 'hosting', agent: true },
  { id: '22.9', plan: 'Android gate-checklist', deploy: 'none', agent: true },
  { id: '22.10', plan: 'App Check enforce-readiness', deploy: 'none', agent: true },
  { id: 'slutrapport', plan: 'fas22-leverans + smoke:tier1 + orkester:night', deploy: 'none', agent: true },
];

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    const dirty = spawnSync('git', ['status', '--porcelain'], {
      cwd: root,
      encoding: 'utf8',
    }).stdout?.trim();
    return { branch, sha, dirty: dirty ? dirty.split('\n').length : 0 };
  } catch {
    return { branch: 'unknown', sha: 'unknown', dirty: -1 };
  }
}

function loadExistingState() {
  if (!existsSync(statePath)) return null;
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeLogHeader(git) {
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
  if (existsSync(logPath)) {
    console.log(`[fas22:autorun] Logg finns: ${logPath}`);
    return;
  }
  const lines = [
    `# Fas 22 log — ${today}`,
    '',
    `**Init:** ${new Date().toISOString()}`,
    `**Git:** ${git.branch} @ ${git.sha}`,
    `**Kanon:** [FAS22-SPRINT-AUTORUN.md](../FAS22-SPRINT-AUTORUN.md)`,
    '',
    '## Vågar',
    '',
    '| Tid | Våg | Status | Notering |',
    '|-----|-----|--------|----------|',
  ];
  writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(`[fas22:autorun] Logg skapad: ${logPath}`);
}

function main() {
  mkdirSync(orkesterDir, { recursive: true });
  const git = gitSnapshot();
  const existing = loadExistingState();
  const reset = process.argv.includes('--reset');

  let nextWaveId = existing?.nextWaveId ?? 'baseline';
  let completedWaves = existing?.completedWaves ?? [];
  let skippedWaves = existing?.skippedWaves ?? [];
  let failures = existing?.failures ?? [];
  let status = existing?.status ?? 'running';
  let startedAt = existing?.startedAt ?? new Date().toISOString();

  if (reset || !existing) {
    nextWaveId = 'baseline';
    completedWaves = [];
    skippedWaves = [];
    failures = [];
    status = 'running';
    startedAt = new Date().toISOString();
    if (reset) {
      console.log('[fas22:autorun] --reset: ny kö från baseline');
    }
  } else if (existing.status === 'done' && !reset) {
    console.log(
      '[fas22:autorun] Tidigare körning done. Kör med --reset för ny kö, eller handoff för en öppen våg.'
    );
  }

  const state = {
    version: 1,
    sprint: 'fas22-masterplan-v2',
    startedAt,
    updatedAt: new Date().toISOString(),
    status,
    nextWaveId,
    completedWaves,
    skippedWaves,
    failures,
    waves: FAS22_WAVES.map((w) => w.id),
    waveDetails: FAS22_WAVES,
    git,
    policy: {
      smokePerWave: true,
      commitPushDeploy: 'on_pass',
      masterYolo: true,
      firebaseProject: 'gen-lang-client-0481875058',
      pmirStops: [
        'firestore.rules',
        'storage.rules',
        'barnporten-kanon-ui',
        'gmail-oauth',
        'genkit-v1',
        'mass-delete',
      ],
    },
  };

  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  writeLogHeader(git);

  console.log('[fas22:autorun] State:', statePath);
  console.log('[fas22:autorun] nextWaveId:', state.nextWaveId);
  console.log(
    '[fas22:autorun] Nästa: export FAS22_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1 && npm run orkester:night'
  );
  console.log('[fas22:autorun] Agent: startprompt i docs/FAS22-SPRINT-AUTORUN.md');
}

main();
