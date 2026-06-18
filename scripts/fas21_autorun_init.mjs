/**
 * Init Fas 21 Sprint Autorun state + dagens logg-header.
 * Usage: npm run fas21:autorun [--reset]
 *
 * Skriver:
 *   .orkester/fas21-state.json
 *   docs/evaluations/YYYY-MM-DD-fas21-log.md (header om ny)
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'fas21-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-fas21-log.md`);

/** Kanon — synkad med docs/FAS21-SPRINT-AUTORUN.md */
const FAS21_WAVES = [
  { id: 'baseline', plan: 'npm run orkester:night', deploy: 'none', agent: false },
  {
    id: '21.1',
    plan: 'Fas20 post-leverans doc-synk + arkiv-batch 4a',
    deploy: 'none',
    agent: true,
  },
  {
    id: '21.2',
    plan: 'M3.0-C PMIR eval doc',
    deploy: 'none',
    agent: true,
  },
  {
    id: '21.3',
    plan: 'M3.0-C Phase 1 UI wire (ingen ny collection)',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '21.4',
    plan: 'MåBra v27 bank-wire (5 ref + 3 play)',
    deploy: 'hosting,functions:mabraCoach',
    agent: true,
  },
  {
    id: '21.5',
    plan: 'Content våg 30 CUR-MYNDIGHET-01 curriculum',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '21.6',
    plan: 'Arkiv-batch 4b + sub-lazy Valv/Familjen',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '21.7',
    plan: 'Adaptiv Hemkompass wire (Forge morgon + Paralys dag)',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '21.8',
    plan: 'Smart Inkast Hem→Hjärtat genväg + toast',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '21.9',
    plan: 'Familjen/Hamn polish + brusfilter-wizard PMIR',
    deploy: 'none',
    agent: true,
  },
  {
    id: '21.10',
    plan: 'App Check guard audit + JWT refresh + runbook',
    deploy: 'functions:invalidateSession,hosting',
    agent: true,
  },
  {
    id: '21.11',
    plan: 'Android doc-synk + Play Integrity runbook',
    deploy: 'none',
    agent: true,
  },
  {
    id: 'slutrapport',
    plan: 'fas21-leverans + smoke:tier1 + orkester:night',
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
    console.log(`[fas21:autorun] Logg finns: ${logPath}`);
    return;
  }
  const lines = [
    `# Fas 21 log — ${today}`,
    '',
    `**Init:** ${new Date().toISOString()}`,
    `**Git:** ${git.branch} @ ${git.sha}`,
    `**Kanon:** [FAS21-SPRINT-AUTORUN.md](../FAS21-SPRINT-AUTORUN.md)`,
    '',
    '## Vågar',
    '',
    '| Tid | Våg | Status | Notering |',
    '|-----|-----|--------|----------|',
  ];
  writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(`[fas21:autorun] Logg skapad: ${logPath}`);
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
      console.log('[fas21:autorun] --reset: ny kö från baseline');
    }
  } else if (existing.status === 'done' && !reset) {
    console.log(
      '[fas21:autorun] Tidigare körning done. Kör med --reset för ny kö, eller handoff för en öppen våg.'
    );
  }

  const state = {
    version: 1,
    sprint: 'fas21-masterplan-v2',
    startedAt,
    updatedAt: new Date().toISOString(),
    status,
    nextWaveId,
    completedWaves,
    skippedWaves,
    failures,
    waves: FAS21_WAVES.map((w) => w.id),
    waveDetails: FAS21_WAVES,
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

  console.log('[fas21:autorun] State:', statePath);
  console.log('[fas21:autorun] nextWaveId:', state.nextWaveId);
  console.log(
    '[fas21:autorun] Nästa: export FAS21_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1 && npm run orkester:night'
  );
  console.log('[fas21:autorun] Agent: startprompt i docs/FAS21-SPRINT-AUTORUN.md');
}

main();
