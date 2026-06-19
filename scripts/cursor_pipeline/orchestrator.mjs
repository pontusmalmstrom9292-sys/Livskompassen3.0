#!/usr/bin/env node
/**
 * Livskompassen v2 — Cursor Pipeline orchestrator (lokal autorun).
 *
 * Usage:
 *   npm run cursor:pipeline
 *   npm run cursor:pipeline -- --pack-only
 *   npm run cursor:pipeline -- --build-smoke-only
 *   npm run cursor:pipeline -- --report-only
 *   npm run cursor:pipeline -- --skip-pack
 *
 * Skriver:
 *   .cursor/pipeline/state.json
 *   .cursor/pipeline/jobs/<id>-brief.md
 *   .cursor/pipeline/MASTER-PROMPT.md
 *   .cursor/pipeline/fix-brief.md (vid FAIL)
 *   .cursor/pipeline/runs/<timestamp>.json
 *   docs/evaluations/YYYY-MM-DD-cursor-pipeline.md
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultConfigPath, loadYamlConfig, validatePipelineConfig } from './loadYamlConfig.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const pipelineDir = join(root, '.cursor/pipeline');
const jobsDir = join(pipelineDir, 'jobs');
const statePath = join(pipelineDir, 'state.json');
const masterPromptPath = join(pipelineDir, 'MASTER-PROMPT.md');
const fixBriefPath = join(pipelineDir, 'fix-brief.md');

const args = process.argv.slice(2);
const packOnly = args.includes('--pack-only');
const buildSmokeOnly = args.includes('--build-smoke-only');
const reportOnly = args.includes('--report-only');
const skipPack = args.includes('--skip-pack');

/** @typedef {{ id: string; label?: string; packCommand: string; output?: string; promptTemplate: string; model?: string; scope?: string; parallel?: boolean; lockedUx?: string[] }} PipelinePackage */
/** @typedef {{ id: string; label?: string; cmd: string; cwd?: string }} BuildPhase */

function ensureDirs(config) {
  mkdirSync(jobsDir, { recursive: true });
  mkdirSync(join(root, config.report?.stateDir ?? '.cursor/pipeline/runs'), { recursive: true });
  mkdirSync(join(root, config.report?.dir ?? 'docs/evaluations'), { recursive: true });
}

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout?.trim();
    const changedFiles = dirty ? dirty.split('\n').map((l) => l.slice(3).trim()) : [];
    return { branch, sha, dirtyCount: changedFiles.length, changedFiles };
  } catch {
    return { branch: 'unknown', sha: 'unknown', dirtyCount: -1, changedFiles: [] };
  }
}

/**
 * @param {string} cmd
 * @param {{ cwd?: string; label: string }} opts
 */
function runCmd(cmd, opts) {
  const cwd = opts.cwd ? resolve(root, opts.cwd) : root;
  const started = Date.now();
  try {
    execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    return { label: opts.label, cmd, status: 'PASS', durationMs: Date.now() - started };
  } catch (err) {
    const stderr = err.stderr?.toString?.() ?? err.message ?? String(err);
    const stdout = err.stdout?.toString?.() ?? '';
    return {
      label: opts.label,
      cmd,
      status: 'FAIL',
      durationMs: Date.now() - started,
      error: stderr.slice(0, 8000),
      stdout: stdout.slice(0, 4000),
    };
  }
}

/**
 * @param {PipelinePackage[]} packages
 */
async function runPackPhase(packages) {
  const parallel = packages.filter((p) => p.parallel !== false);
  const results = await Promise.all(
    parallel.map(
      (pkg) =>
        new Promise((resolvePromise) => {
          console.log(`[cursor:pipeline] pack → ${pkg.id} (${pkg.packCommand})`);
          const r = runCmd(pkg.packCommand, { label: `pack:${pkg.id}` });
          resolvePromise({ ...r, packageId: pkg.id });
        }),
    ),
  );
  return results;
}

/**
 * @param {string} templatePath
 */
function readPromptTemplate(templatePath) {
  const abs = join(root, templatePath);
  if (!existsSync(abs)) {
    return `# ${templatePath}\n\n(Promptmall saknas — skapa filen.)\n`;
  }
  return readFileSync(abs, 'utf8');
}

/**
 * @param {PipelinePackage} pkg
 * @param {Record<string, unknown>} config
 */
function emitPackageBrief(pkg) {
  const template = readPromptTemplate(pkg.promptTemplate);
  const lockedUx =
    pkg.lockedUx?.length
      ? `\nLOCKED UX (MUST NOT remove):\n${pkg.lockedUx.map((u) => `- ${u}`).join('\n')}\n`
      : '';
  const repomix = pkg.output ? `\nREPOMIX CONTEXT: ${pkg.output}\n` : '';

  const brief = `---
PIPELINE PACKAGE: ${pkg.id}
LABEL: ${pkg.label ?? pkg.id}
MODEL: ${pkg.model ?? 'composer-2.5-fast'}
SCOPE: ${pkg.scope ?? 'full-stack'}
${repomix}${lockedUx}
---

${template}

---
VERIFY before claiming done:
  - cd functions && npm run build
  - npm run build
  - npm run smoke:predeploy

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
`;

  const outFile = join(jobsDir, `${pkg.id}-brief.md`);
  writeFileSync(outFile, brief, 'utf8');
  console.log(`[cursor:pipeline] brief → ${outFile}`);
  return outFile;
}

/**
 * @param {PipelinePackage[]} packages
 */
function emitMasterPrompt(packages) {
  const jobLines = packages
    .map(
      (p) =>
        `- **${p.id}** (${p.label ?? p.id}): läs \`.cursor/pipeline/jobs/${p.id}-brief.md\`, modell \`${p.model ?? 'composer-2.5-fast'}\`, starta Task-subagent parallellt.`,
    )
    .join('\n');

  const master = `# Cursor Pipeline — MASTER PROMPT

Kör **parallellt** (Task tool, en subagent per paket):

${jobLines}

## Ordning efter agent-jobb

1. \`cd functions && npm run build\`
2. \`npm run build\`
3. \`npm run smoke:predeploy\`
4. Om FAIL: läs \`.cursor/pipeline/fix-brief.md\` och fixa minsta diff.

## MUST NOT (hard NO-GO)

- Ändra \`firestore.rules\` / \`storage.rules\` utan PMIR
- Cross-RAG mellan Kunskap / Valv / Barnen
- Ta bort Locked UX (Barnfokus, Valv Mönster/Orkester, drawer plausible deniability)
- LLM-skriv till WORM utan explicit användarval

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
`;

  writeFileSync(masterPromptPath, master, 'utf8');
  console.log(`[cursor:pipeline] master → ${masterPromptPath}`);
}

/**
 * @param {Record<string, unknown>} config
 */
function runBuildPhase(config) {
  /** @type {BuildPhase[]} */
  const phases = config.build?.phases ?? [];
  return phases.map((phase) => {
    console.log(`[cursor:pipeline] build → ${phase.id}`);
    return runCmd(phase.cmd, {
      label: phase.label ?? phase.id,
      cwd: phase.cwd,
    });
  });
}

/**
 * @param {Record<string, unknown>} config
 */
function runSmokePhase(config) {
  const commands = config.smoke?.afterBuild ?? [];
  return commands.map((cmd) => {
    console.log(`[cursor:pipeline] smoke → ${cmd}`);
    return runCmd(cmd, { label: cmd });
  });
}

/**
 * @param {string[]} changedFiles
 * @param {string[]} pmirHardStop
 */
function checkPmirHardStop(changedFiles, pmirHardStop) {
  const hits = [];
  for (const pattern of pmirHardStop) {
    if (changedFiles.some((f) => f.includes(pattern) || f.endsWith(pattern))) {
      hits.push(pattern);
    }
  }
  return hits;
}

/**
 * @param {{ build: unknown[]; smoke: unknown[]; pack: unknown[] }} run
 * @param {Record<string, unknown>} config
 * @param {Record<string, unknown>} state
 */
function writeFixBrief(run, config, state) {
  const failures = [...run.build, ...run.smoke].filter(
    (r) => /** @type {{ status?: string }} */ (r).status === 'FAIL',
  );
  const first = /** @type {{ label?: string; cmd?: string; error?: string }} */ (failures[0]);
  const lines = [
    '# Cursor Pipeline — Fix Brief',
    '',
    `**Attempt:** ${state.attempt ?? 1} / ${config.iteration?.maxAttempts ?? 5}`,
    '',
    '## Failande steg',
    '',
  ];
  for (const f of failures) {
    const fr = /** @type {{ label?: string; cmd?: string; error?: string }} */ (f);
    lines.push(`### ${fr.label ?? 'unknown'}`, '', '```', fr.error ?? '(ingen stderr)', '```', '');
  }
  lines.push(
    '## Instruktion',
    '',
    `Fixa **${first?.label ?? 'failande steg'}** med minsta möjliga diff.`,
    'Kör sedan: `cd functions && npm run build && npm run build && npm run smoke:predeploy`',
    '',
    'Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.',
  );
  writeFileSync(fixBriefPath, lines.join('\n'), 'utf8');
  console.log(`[cursor:pipeline] fix-brief → ${fixBriefPath}`);
}

/**
 * @param {Record<string, unknown>} run
 * @param {Record<string, unknown>} config
 * @param {Record<string, unknown>} state
 */
function writeReport(run, config, state) {
  const today = new Date().toISOString().slice(0, 10);
  const reportDir = join(root, config.report?.dir ?? 'docs/evaluations');
  const reportPath = join(reportDir, `${today}-cursor-pipeline.md`);

  const templatePath = join(root, config.report?.template ?? 'docs/cursor-pipeline/report-template.md');
  const template = existsSync(templatePath) ? readFileSync(templatePath, 'utf8') : '';

  const allPhases = [
    ...(run.pack ?? []),
    ...(run.build ?? []),
    ...(run.smoke ?? []),
  ];
  const failures = allPhases.filter((p) => p.status === 'FAIL');
  const hardFail = failures.length > 0;
  const pmirHits = state.pmirHits ?? [];

  const tableRows = allPhases
    .map((p) => `| ${p.label ?? p.packageId ?? '?'} | ${p.status} | ${p.durationMs ?? 0} |`)
    .join('\n');

  const risks = [];
  if (pmirHits.length) risks.push(`PMIR-stopp: ${pmirHits.join(', ')}`);
  if (run.git?.dirtyCount > 0) risks.push(`Dirty tree: ${run.git.dirtyCount} filer`);
  if (hardFail) risks.push(`${failures.length} fas(er) FAIL — se fix-brief`);

  const body = [
    `# Cursor Pipeline — ${today}`,
    '',
    `**Kört:** ${run.startedAt}`,
    `**Git:** ${run.git?.branch} @ ${run.git?.sha} (${run.git?.dirtyCount ?? 0} unstaged)`,
    `**Attempt:** ${state.attempt ?? 1} / ${config.iteration?.maxAttempts ?? 5}`,
    `**Status:** ${hardFail ? 'FAIL' : pmirHits.length ? 'PMIR STOP' : 'PASS'}`,
    '',
    '## Faser',
    '',
    '| Fas | Status | ms |',
    '|-----|--------|-----|',
    tableRows,
    '',
    '## Risker',
    '',
    risks.length ? risks.map((r) => `- ${r}`).join('\n') : '- Inga identifierade risker.',
    '',
    '## Förbättringsförslag',
    '',
    hardFail
      ? `- Fixa: **${failures[0]?.label ?? 'se fix-brief'}**`
      : '- Kör manuell smoke enligt docs/SMOKE_CHECKLIST.md vid prod-deploy.',
    pmirHits.length ? '- Kräv PMIR + explicit godkännande före merge.' : '',
    '',
    '## Agent-jobb',
    '',
    `- Master prompt: \`.cursor/pipeline/MASTER-PROMPT.md\``,
    `- State: \`.cursor/pipeline/state.json\``,
    '',
    '---',
    '',
    template ? `<!-- template -->\n${template}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  writeFileSync(reportPath, body, 'utf8');
  console.log(`[cursor:pipeline] rapport → ${reportPath}`);
  return reportPath;
}

function loadOrInitState(config) {
  if (existsSync(statePath)) {
    try {
      return JSON.parse(readFileSync(statePath, 'utf8'));
    } catch {
      /* fresh state */
    }
  }
  return {
    phase: 'init',
    attempt: 1,
    maxAttempts: config.iteration?.maxAttempts ?? 5,
    packages: [],
    failures: [],
    nextAction: 'run_master_prompt',
  };
}

function saveState(state) {
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}

async function main() {
  const configPath = process.env.CURSOR_PIPELINE_CONFIG ?? defaultConfigPath;
  const config = validatePipelineConfig(loadYamlConfig(configPath));
  ensureDirs(config);

  const git = gitSnapshot();
  const state = loadOrInitState(config);
  const startedAt = new Date().toISOString();
  const runId = startedAt.replace(/[:.]/g, '-');
  const runsDir = join(root, config.report?.stateDir ?? '.cursor/pipeline/runs');

  /** @type {Record<string, unknown>} */
  const run = { startedAt, git, pack: [], build: [], smoke: [] };

  console.log(`[cursor:pipeline] Start ${startedAt}`);
  console.log(`[cursor:pipeline] Config: ${configPath}`);

  if (reportOnly) {
    writeReport(run, config, state);
    return;
  }

  /** @type {PipelinePackage[]} */
  const packages = config.packages;

  // PMIR hard-stop check on dirty files
  const pmirHardStop = config.smoke?.pmirHardStop ?? [];
  const pmirHits = checkPmirHardStop(git.changedFiles, pmirHardStop);
  state.pmirHits = pmirHits;
  if (pmirHits.length) {
    state.nextAction = 'PMIR required';
    saveState(state);
    console.error(`[cursor:pipeline] PMIR hard-stop: ${pmirHits.join(', ')}`);
  }

  if (!skipPack && !buildSmokeOnly) {
    state.phase = 'pack';
    saveState(state);
    run.pack = await runPackPhase(packages);

    state.phase = 'emit-briefs';
    state.packages = packages.map((p) => p.id);
    for (const pkg of packages) {
      emitPackageBrief(pkg);
    }
    emitMasterPrompt(packages);
    saveState(state);

    const packFail = run.pack.some((p) => p.status === 'FAIL');
    if (packFail) {
      console.error('[cursor:pipeline] Pack FAIL — avbryter build/smoke.');
      writeReport({ ...run, pack: run.pack }, config, state);
      process.exit(1);
    }

    if (packOnly) {
      writeReport({ ...run, pack: run.pack }, config, state);
      console.log('[cursor:pipeline] --pack-only klar. Kör MASTER-PROMPT.md i Agent (Cmd+L).');
      return;
    }
  }

  if (pmirHits.length) {
    writeReport(run, config, state);
    process.exit(2);
  }

  state.phase = 'build';
  saveState(state);
  run.build = runBuildPhase(config);

  state.phase = 'smoke';
  saveState(state);
  run.smoke = runSmokePhase(config);

  const buildFail = run.build.some((p) => p.status === 'FAIL');
  const smokeFail = run.smoke.some((p) => p.status === 'FAIL');

  if (buildFail || smokeFail) {
    state.phase = 'fix';
    state.failures = [...run.build, ...run.smoke].filter((p) => p.status === 'FAIL');
    state.nextAction = 'read_fix_brief';
    saveState(state);
    writeFixBrief(run, config, state);
  } else {
    state.phase = 'done';
    state.nextAction = 'idle';
    state.failures = [];
    saveState(state);
  }

  writeFileSync(join(runsDir, `${runId}.json`), JSON.stringify({ ...run, state }, null, 2), 'utf8');
  const reportPath = writeReport(run, config, state);

  const hardFail = buildFail || smokeFail;
  console.log(`[cursor:pipeline] ${hardFail ? 'FAIL' : 'PASS'} — ${reportPath}`);

  if (!hardFail && !packOnly) {
    console.log('[cursor:pipeline] Tips: kör MASTER-PROMPT.md i Agent för parallella paket-jobb.');
  }

  process.exit(hardFail ? 1 : 0);
}

main().catch((err) => {
  console.error('[cursor:pipeline] Fatal:', err.message ?? err);
  process.exit(1);
});
