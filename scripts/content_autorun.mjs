#!/usr/bin/env node
/**
 * Content Autorun — deterministisk bank/våg-smoke utan LLM.
 * Usage: npm run content:night
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const contentDir = resolve(root, '.content-autorun');
const runsDir = resolve(contentDir, 'runs');
const statePath = resolve(contentDir, 'state.json');
const wavesPath = resolve(root, 'docs/content/CONTENT-WAVES.md');
const today = new Date().toISOString().slice(0, 10);

function readActiveWave() {
  if (!existsSync(wavesPath)) return { wave: '?', line: 'saknar CONTENT-WAVES.md' };
  const text = readFileSync(wavesPath, 'utf8');
  const m = text.match(/\*\*Aktiv våg:\*\*\s*`(\d+)`/);
  return { wave: m?.[1] ?? '?', line: m?.[0] ?? 'okänd' };
}

const PHASES = [
  { id: 'export', label: 'Export kunskap manifest', cmd: 'npm run export:kunskap-seed' },
  { id: 'waves', label: 'Content waves smoke', cmd: 'npm run smoke:content-waves' },
  { id: 'innehall', label: 'Innehall U6', cmd: 'npm run smoke:innehall' },
  { id: 'mabra-static', label: 'Mabra bank parity', cmd: 'node scripts/smoke_content_mabra_static.mjs' },
  { id: 'build', label: 'Frontend build', cmd: 'npm run build' },
];

function runPhase(phase) {
  const cwd = phase.cwd ? resolve(root, phase.cwd) : root;
  const started = Date.now();
  try {
    execSync(phase.cmd, { cwd, stdio: 'pipe', encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return { id: phase.id, label: phase.label, status: 'PASS', durationMs: Date.now() - started };
  } catch (err) {
    return {
      id: phase.id,
      label: phase.label,
      status: 'FAIL',
      durationMs: Date.now() - started,
      error: (err.stderr?.toString?.() ?? err.message ?? String(err)).slice(0, 4000),
    };
  }
}

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

function writeReport(run, activeWave) {
  const reportPath = resolve(
    root,
    'docs/evaluations',
    `${today}-content-autorun-vag-${activeWave.wave}.md`,
  );
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
  const failures = run.phases.filter((p) => p.status === 'FAIL');
  const lines = [
    `# Content autorun — våg ${activeWave.wave} — ${today}`,
    '',
    `**Kört:** ${run.startedAt}`,
    `**Git:** ${run.git.branch} @ ${run.git.sha}`,
    `**Register:** ${activeWave.line}`,
    '',
    '## Faser',
    '',
    '| Fas | Status | ms |',
    '|-----|--------|-----|',
  ];
  for (const p of run.phases) {
    lines.push(`| ${p.label} | ${p.status} | ${p.durationMs} |`);
  }
  lines.push('', '## Sammanfattning', '');
  if (failures.length === 0) {
    lines.push('Alla faser **PASS**. Bank-paritet och build gröna.');
  } else {
    lines.push(`${failures.length} fas(er) **FAIL**.`);
  }
  lines.push('', '## Nästa steg (1)', '');
  if (failures.length > 0) {
    lines.push(`Fixa **${failures[0].label}**.`);
  } else if (activeWave.wave === '8') {
    lines.push('Manuell granskning → `node scripts/seed_kampspar_profile.mjs --manifest=kunskap-facts --dry-run`');
  } else {
    lines.push('Se [`docs/content/CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) för nästa våg.');
  }
  for (const p of failures) {
    lines.push('', `### ${p.label}`, '', '```', p.error ?? '', '```');
  }
  writeFileSync(reportPath, lines.join('\n'), 'utf8');
  return reportPath;
}

function main() {
  mkdirSync(runsDir, { recursive: true });
  const startedAt = new Date().toISOString();
  const runId = startedAt.replace(/[:.]/g, '-');
  const git = gitSnapshot();
  const activeWave = readActiveWave();

  console.log(`[content:night] Start ${startedAt} — aktiv våg ${activeWave.wave}`);
  const phaseResults = [];

  for (const phase of PHASES) {
    console.log(`[content:night] → ${phase.label}...`);
    const result = runPhase(phase);
    phaseResults.push(result);
    console.log(`[content:night]   ${result.status} (${result.durationMs}ms)`);
  }

  const run = { startedAt, git, activeWave, phases: phaseResults };
  writeFileSync(resolve(runsDir, `${runId}.json`), JSON.stringify(run, null, 2), 'utf8');
  writeFileSync(
    statePath,
    JSON.stringify({ ...run, finishedAt: new Date().toISOString() }, null, 2),
    'utf8',
  );

  const reportPath = writeReport(run, activeWave);
  const hardFail = phaseResults.some((p) => p.status === 'FAIL');
  console.log(`[content:night] Rapport: ${reportPath}`);
  console.log(`[content:night] ${hardFail ? 'FAIL' : 'PASS'}`);
  process.exit(hardFail ? 1 : 0);
}

main();
