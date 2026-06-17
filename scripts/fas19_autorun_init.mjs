/**
 * Init Fas 19 Sprint Autorun state + dagens logg-header.
 * Usage: npm run fas19:autorun
 *
 * Skriver:
 *   .orkester/fas19-state.json
 *   docs/evaluations/YYYY-MM-DD-fas19-log.md (header om ny)
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'fas19-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-fas19-log.md`);

/** Kanon — synkad med docs/FAS19-SPRINT-AUTORUN.md */
const FAS19_WAVES = [
  { id: 'baseline', plan: 'npm run orkester:night', deploy: 'none', agent: false },
  {
    id: '19.1',
    plan: 'doc-synk + unlockVault P0 + App Check guards + LEG-VAULT read-fix',
    deploy: 'functions:unlockVault,hosting',
    agent: true,
  },
  {
    id: '19.2',
    plan: 'M3.0-B hybrid-8 pelarkort',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '19.3',
    plan: 'hex→tokens P0 + typecheck:core-strict',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '19.4',
    plan: 'JOY-17 + mabraCoach bank-synk',
    deploy: 'functions:mabraCoach,hosting',
    agent: true,
  },
  {
    id: '19.5',
    plan: 'evolution_ledger dual-write',
    deploy: 'named-functions',
    agent: true,
  },
  {
    id: '19.6',
    plan: 'arkiv-batch PMIR + orkester:night',
    deploy: 'none',
    agent: true,
  },
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
    console.log(`[fas19:autorun] Logg finns: ${logPath}`);
    return;
  }
  const lines = [
    `# Fas 19 log — ${today}`,
    '',
    `**Init:** ${new Date().toISOString()}`,
    `**Git:** ${git.branch} @ ${git.sha}`,
    `**Kanon:** [FAS19-SPRINT-AUTORUN.md](../FAS19-SPRINT-AUTORUN.md)`,
    '',
    '## Vågar',
    '',
    '| Tid | Våg | Status | Notering |',
    '|-----|-----|--------|----------|',
  ];
  writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(`[fas19:autorun] Logg skapad: ${logPath}`);
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
      console.log('[fas19:autorun] --reset: ny kö från baseline');
    }
  } else if (existing.status === 'done' && !reset) {
    console.log(
      '[fas19:autorun] Tidigare körning done. Kör med --reset för ny kö, eller handoff för en öppen våg.'
    );
  }

  const state = {
    version: 1,
    sprint: 'fas19-masterplan-v2',
    startedAt,
    updatedAt: new Date().toISOString(),
    status,
    nextWaveId,
    completedWaves,
    skippedWaves,
    failures,
    waves: FAS19_WAVES.map((w) => w.id),
    waveDetails: FAS19_WAVES,
    git,
    policy: {
      smokePerWave: true,
      commitPushDeploy: 'on_pass',
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

  console.log('[fas19:autorun] State:', statePath);
  console.log('[fas19:autorun] nextWaveId:', state.nextWaveId);
  console.log(
    '[fas19:autorun] Nästa: export FAS19_AUTORUN=1 ORKESTER_AUTORUN=1 && npm run orkester:night'
  );
  console.log('[fas19:autorun] Agent: startprompt i docs/FAS19-SPRINT-AUTORUN.md');
}

main();
