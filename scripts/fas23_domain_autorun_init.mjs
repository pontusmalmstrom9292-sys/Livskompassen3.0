/**
 * Init Fas 23 Domän Sprint state.
 * Usage: npm run fas23:domain-autorun [--reset]
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'fas23-domain-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-fas23-domain-log.md`);

const FAS23_WAVES = [
  { id: '23.D1', plan: '5 domän-agenter + dirigent + ORKESTER doc', deploy: 'none', agent: true },
  { id: '23.D2', plan: 'MB-REF-REST-01..03 i bank', deploy: 'none', agent: true },
  { id: '23.D3', plan: 'Kunskap våg 31 FACT (jur/soc/bh)', deploy: 'none', agent: true },
  { id: '23.D4', plan: 'Neuro-psyk FACT (gad/pu)', deploy: 'none', agent: true },
  { id: '23.D5', plan: 'HCF cn-049..051 + tactic patterns', deploy: 'none', agent: true },
  { id: '23.D6', plan: 'smoke:domän-specialister + innehall', deploy: 'none', agent: false },
  { id: '23.D7', plan: 'JWT session sync PMIR (read-only defer)', deploy: 'none', agent: true },
  { id: '23.D8', plan: 'slutrapport + orkester:night', deploy: 'none', agent: true },
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

function main() {
  mkdirSync(orkesterDir, { recursive: true });
  const git = gitSnapshot();
  const reset = process.argv.includes('--reset');
  let existing = null;
  if (existsSync(statePath)) {
    try {
      existing = JSON.parse(readFileSync(statePath, 'utf8'));
    } catch {
      existing = null;
    }
  }

  let nextWaveId = reset || !existing ? '23.D1' : existing.nextWaveId ?? '23.D8';
  let completedWaves = reset || !existing ? [] : existing.completedWaves ?? [];
  let status = reset || !existing ? 'running' : existing.status ?? 'running';

  const state = {
    version: 1,
    sprint: 'fas23-domain',
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status,
    nextWaveId,
    completedWaves,
    waves: FAS23_WAVES.map((w) => w.id),
    waveDetails: FAS23_WAVES,
    git,
    policy: {
      smokePerWave: true,
      pmirStops: ['firestore.rules', 'barnporten-kanon-ui', 'parent-fysio-ui', 'mass-delete'],
    },
  };

  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
  if (!existsSync(logPath)) {
    writeFileSync(
      logPath,
      `# Fas 23 domän log — ${today}\n\n| Tid | Våg | Status | Notering |\n|-----|-----|--------|----------|\n`,
      'utf8',
    );
  }

  console.log('[fas23:domain-autorun] State:', statePath);
  console.log('[fas23:domain-autorun] nextWaveId:', nextWaveId);
}

main();
