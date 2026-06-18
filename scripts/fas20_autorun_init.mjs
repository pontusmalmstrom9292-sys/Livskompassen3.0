/**
 * Init Fas 20 Sprint Autorun state + dagens logg-header.
 * Usage: npm run fas20:autorun [--reset]
 *
 * Skriver:
 *   .orkester/fas20-state.json
 *   docs/evaluations/YYYY-MM-DD-fas20-log.md (header om ny)
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'fas20-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-fas20-log.md`);

/** Kanon — synkad med docs/FAS20-SPRINT-AUTORUN.md */
const FAS20_WAVES = [
  { id: 'baseline', plan: 'npm run orkester:night', deploy: 'none', agent: false },
  {
    id: '20.1',
    plan: 'doc-synk post-Fas19 + zone memos + archive PMIR',
    deploy: 'none',
    agent: true,
  },
  {
    id: '20.2',
    plan: 'Valv JWT lock on invalidateSession (Zero Footprint)',
    deploy: 'functions:invalidateSession',
    agent: true,
  },
  {
    id: '20.3',
    plan: 'hex→tokens P2 planering.css',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '20.4',
    plan: 'Hjärtat + Inkast polish (toast copy)',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '20.5',
    plan: 'content v30 prep + content:night',
    deploy: 'none',
    agent: true,
  },
  {
    id: '20.6',
    plan: 'tri-gate economy_advanced → evolution_hub + capability',
    deploy: 'functions:mabraEconomySync',
    agent: true,
  },
  {
    id: '20.7',
    plan: '/oversikt redirect → /dashboard',
    deploy: 'hosting',
    agent: true,
  },
  {
    id: '20.9',
    plan: 'Android doc-synk + smoke:android-platform',
    deploy: 'none',
    agent: true,
  },
  {
    id: 'slutrapport',
    plan: 'fas20-leverans + smoke:tier1 + orkester:night',
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
    console.log(`[fas20:autorun] Logg finns: ${logPath}`);
    return;
  }
  const lines = [
    `# Fas 20 log — ${today}`,
    '',
    `**Init:** ${new Date().toISOString()}`,
    `**Git:** ${git.branch} @ ${git.sha}`,
    `**Kanon:** [FAS20-SPRINT-AUTORUN.md](../FAS20-SPRINT-AUTORUN.md)`,
    '',
    '## Vågar',
    '',
    '| Tid | Våg | Status | Notering |',
    '|-----|-----|--------|----------|',
  ];
  writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(`[fas20:autorun] Logg skapad: ${logPath}`);
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
      console.log('[fas20:autorun] --reset: ny kö från baseline');
    }
  } else if (existing.status === 'done' && !reset) {
    console.log(
      '[fas20:autorun] Tidigare körning done. Kör med --reset för ny kö, eller handoff för en öppen våg.'
    );
  }

  const state = {
    version: 1,
    sprint: 'fas20-masterplan-v2',
    startedAt,
    updatedAt: new Date().toISOString(),
    status,
    nextWaveId,
    completedWaves,
    skippedWaves,
    failures,
    waves: FAS20_WAVES.map((w) => w.id),
    waveDetails: FAS20_WAVES,
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

  console.log('[fas20:autorun] State:', statePath);
  console.log('[fas20:autorun] nextWaveId:', state.nextWaveId);
  console.log(
    '[fas20:autorun] Nästa: export FAS20_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1 && npm run orkester:night'
  );
  console.log('[fas20:autorun] Agent: startprompt i docs/FAS20-SPRINT-AUTORUN.md');
}

main();
