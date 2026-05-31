/**
 * Init Master YOLO Autorun state + dagens logg-header.
 * Usage: npm run master:yolo
 *
 * Skriver:
 *   .orkester/master-state.json
 *   docs/evaluations/YYYY-MM-DD-master-yolo-log.md (header om ny)
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'master-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-master-yolo-log.md`);

/** Kanon — synkad med docs/MASTER-YOLO-AUTORUN.md */
const MASTER_WAVES = [
  { id: 'baseline', plan: 'npm run orkester:night', deploy: 'none', agent: false },
  { id: 'doc-sync', plan: 'SENASTE-SAMMANFATTNING + MODUL-GAP superhub', deploy: 'none', agent: true },
  { id: 'hub-gora', plan: 'docs/evaluations/2026-05-31-gora-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-dagbok', plan: 'docs/evaluations/2026-05-31-dagbok-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-familjen', plan: 'docs/evaluations/2026-05-31-familjen-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-valv', plan: 'docs/evaluations/2026-05-31-valv-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-trygghet', plan: 'docs/evaluations/2026-05-31-trygghet-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-arbetsliv', plan: 'docs/evaluations/2026-05-31-arbetsliv-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-vardag', plan: 'docs/evaluations/2026-05-31-vardag-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'hub-kompass', plan: 'docs/evaluations/2026-05-31-kompass-ombyggnad-plan.md', deploy: 'hosting', agent: true },
  { id: 'mabra-fas2', plan: 'docs/evaluations/2026-05-29-mabra-cursor-plan.md', deploy: 'hosting', agent: true },
  { id: 'valv-samla', plan: 'docs/evaluations/2026-05-29-valv-samla-cursor-plan.md', deploy: 'hosting', agent: true },
  { id: 'inkast-fas2', plan: 'docs/evaluations/2026-05-27-nasta-fas-plan.md spår 4', deploy: 'functions:submitInkastLite', agent: true },
  { id: 'kunskap-ux', plan: 'docs/evaluations/2026-05-29-kunskap-cursor-plan.md', deploy: 'hosting', agent: true },
  { id: 'projekt-p2', plan: 'docs/evaluations/2026-05-29-projekt-cursor-plan.md + fas5d', deploy: 'hosting', agent: true },
  { id: 'lifeos-d', plan: 'docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md Fas D', deploy: 'hosting', agent: true },
  { id: 'barnporten-fas2', plan: 'docs/evaluations/2026-05-29-barnporten-cursor-plan.md', deploy: 'hosting', agent: true },
  { id: 'planering-fas3', plan: 'docs/evaluations/2026-05-29-planering-cursor-plan.md', deploy: 'hosting', agent: true },
  { id: 'slutrapport', plan: 'master-yolo-leverans + orkester:night', deploy: 'hosting', agent: true },
];

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout?.trim();
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
    console.log(`[master:yolo] Logg finns: ${logPath}`);
    return;
  }
  const lines = [
    `# Master YOLO log — ${today}`,
    '',
    `**Init:** ${new Date().toISOString()}`,
    `**Git:** ${git.branch} @ ${git.sha}`,
    `**Kanon:** [MASTER-YOLO-AUTORUN.md](../MASTER-YOLO-AUTORUN.md)`,
    '',
    '## Vågar',
    '',
    '| Tid | Våg | Status | Notering |',
    '|-----|-----|--------|----------|',
  ];
  writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(`[master:yolo] Logg skapad: ${logPath}`);
}

function main() {
  mkdirSync(orkesterDir, { recursive: true });
  const git = gitSnapshot();
  const existing = loadExistingState();
  const startedAt = existing?.startedAt ?? new Date().toISOString();

  const state = {
    version: 1,
    startedAt,
    updatedAt: new Date().toISOString(),
    status: existing?.status === 'done' ? 'running' : (existing?.status ?? 'running'),
    nextWaveId: existing?.nextWaveId ?? 'doc-sync',
    completedWaves: existing?.completedWaves ?? [],
    skippedWaves: existing?.skippedWaves ?? [],
    failures: existing?.failures ?? [],
    waves: MASTER_WAVES.map((w) => w.id),
    git,
    policy: {
      smokePerWave: true,
      commitPushDeploy: 'full',
      firebaseProject: 'gen-lang-client-0481875058',
    },
  };

  if (existing?.status === 'done' && !process.argv.includes('--reset')) {
    console.log('[master:yolo] Tidigare körning done. Kör med --reset för ny kö från doc-sync.');
    state.status = 'running';
    state.nextWaveId = 'doc-sync';
    state.completedWaves = [];
    state.skippedWaves = [];
    state.failures = [];
    state.startedAt = new Date().toISOString();
  }

  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  writeLogHeader(git);

  console.log('[master:yolo] State:', statePath);
  console.log('[master:yolo] nextWaveId:', state.nextWaveId);
  console.log('[master:yolo] Nästa: export MASTER_AUTORUN=1 ORKESTER_AUTORUN=1 && npm run orkester:night');
  console.log('[master:yolo] Agent: startprompt i docs/MASTER-YOLO-AUTORUN.md');
}

main();
