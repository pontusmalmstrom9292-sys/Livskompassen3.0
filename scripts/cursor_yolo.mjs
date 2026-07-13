#!/usr/bin/env node
/**
 * Cursor YOLO v5/v6/v7/v8/v9/v10/v11 — sekventiell kö.
 *
 * Usage:
 *   npm run cursor:yolo -- status          # v5 default
 *   npm run cursor:yolo:v6 -- status       # v6
 *   npm run cursor:yolo:v7 -- status       # v7
 *   npm run cursor:yolo:v8 -- status       # v8
 *   npm run cursor:yolo:v9 -- status       # v9
 *   npm run cursor:yolo:v10 -- status      # v10
 *   npm run cursor:yolo:v11 -- status      # v11
 *   npm run cursor:yolo -- gate | gate-pass | next | master | done | skip | watch
 *
 * Env:
 *   CURSOR_YOLO_VERSION=5|6|7|8|9|10|11
 *   CURSOR_YOLO_SKIP_SMOKE=1   hoppa smoke vid done
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const yoloVersion = Number(process.env.CURSOR_YOLO_VERSION ?? 5);

const CONFIG = {
  5: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v5.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v5.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v5/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v5/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v5',
    logSuffix: 'cursor-yolo-v5-log',
    label: 'v5',
    masterTaskId: 'p4-p13-master',
    masterTitle: 'MASTER sekventiell P4→P13',
    requiresParallelGate: true,
    gateArtifacts: [
      { id: 'p1-yolo-vakt', paths: ['docs/evaluations/2026-07-13-yolo-audit.md'] },
      { id: 'p2-ux-guardian', paths: ['docs/evaluations/2026-07-13-ux-guardian.md'] },
      {
        id: 'p3-design-debt',
        paths: [
          'docs/evaluations/2026-07-13-design-debt-done.md',
          'docs/evaluations/2026-07-13-cursor-yolo-v5-log.md',
        ],
        requireAll: false,
      },
    ],
  },
  6: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v6.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v6.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v6/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v6/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v6',
    logSuffix: 'cursor-yolo-v6-log',
    label: 'v6',
    masterTaskId: 'p14-p23-master',
    masterTitle: 'MASTER sekventiell P14→P23',
    requiresParallelGate: false,
    gateArtifacts: [],
  },
  7: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v7.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v7.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v7/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v7/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v7',
    logSuffix: 'cursor-yolo-v7-log',
    label: 'v7',
    masterTaskId: 'p24-p33-master',
    masterTitle: 'MASTER sekventiell P24→P33',
    requiresParallelGate: false,
    gateArtifacts: [
      { id: 'p24-baseline', paths: ['docs/evaluations/2026-07-13-yolo-v7-baseline.md'] },
    ],
  },
  8: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v8.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v8.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v8/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v8/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v8',
    logSuffix: 'cursor-yolo-v8-log',
    label: 'v8',
    masterTaskId: 'p34-p43-master',
    masterTitle: 'MASTER sekventiell P34→P43',
    requiresParallelGate: false,
    gateArtifacts: [
      { id: 'p34-baseline', paths: ['docs/evaluations/2026-07-13-yolo-v8-baseline.md'] },
    ],
  },
  9: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v9.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v9.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v9/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v9/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v9',
    logSuffix: 'cursor-yolo-v9-log',
    label: 'v9',
    masterTaskId: 'p44-p53-master',
    masterTitle: 'MASTER sekventiell P44→P53',
    requiresParallelGate: false,
    gateArtifacts: [
      { id: 'p44-baseline', paths: ['docs/evaluations/2026-07-13-yolo-v9-baseline.md'] },
    ],
  },
  10: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v10.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v10.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v10/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v10/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v10',
    logSuffix: 'cursor-yolo-v10-log',
    label: 'v10',
    masterTaskId: 'p54-p63-master',
    masterTitle: 'MASTER sekventiell P54→P63',
    requiresParallelGate: false,
    gateArtifacts: [
      { id: 'p54-baseline', paths: ['docs/evaluations/2026-07-13-yolo-v10-baseline.md'] },
    ],
  },
  11: {
    queuePath: join(root, '.orkester/cursor-yolo-queue-v11.json'),
    statePath: join(root, '.orkester/cursor-yolo-state-v11.json'),
    nextPromptPath: join(root, '.cursor/pipeline/yolo-v11/NEXT-PROMPT.md'),
    masterPath: join(root, 'docs/cursor-pipeline/yolo-v11/MASTER-SEQUENTIAL.md'),
    promptDir: 'docs/cursor-pipeline/yolo-v11',
    logSuffix: 'cursor-yolo-v11-log',
    label: 'v11',
    masterTaskId: 'p64-p73-master',
    masterTitle: 'MASTER sekventiell P64→P73',
    requiresParallelGate: false,
    gateArtifacts: [
      { id: 'p64-baseline', paths: ['docs/evaluations/2026-07-13-cursor-yolo-v11-log.md'] },
    ],
  },
}[yoloVersion] ?? null;

if (!CONFIG) {
  console.error('[cursor:yolo] Okänd CURSOR_YOLO_VERSION:', yoloVersion);
  process.exit(1);
}

const {
  queuePath,
  statePath,
  nextPromptPath,
  masterPath,
  promptDir,
  logSuffix,
  label,
  masterTaskId,
  masterTitle,
  requiresParallelGate,
  gateArtifacts: GATE_ARTIFACTS,
} = CONFIG;

const today = new Date().toISOString().slice(0, 10);
const logPath = join(root, 'docs/evaluations', `${today}-${logSuffix}.md`);

const argv = process.argv.slice(2);
const cmd = argv[0] ?? 'status';

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function loadQueue() {
  const queue = readJson(queuePath);
  if (!queue?.tasks?.length) {
    console.error('[cursor:yolo] Saknar kö:', queuePath);
    process.exit(1);
  }
  return queue;
}

function loadState() {
  return (
    readJson(statePath) ?? {
      version: yoloVersion,
      parallelPhase: {
        status: requiresParallelGate ? 'in_progress' : 'skipped',
        gatePassed: !requiresParallelGate,
        completedTaskIds: [],
      },
      sequentialPhase: {
        status: requiresParallelGate ? 'waiting_for_gate' : 'ready',
        completedTaskIds: [],
        skippedTaskIds: [],
        failedTaskIds: [],
      },
      taskOrder: [],
    }
  );
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeJson(statePath, state);
}

function readPrompt(task) {
  const rel = task.promptFile ?? `${promptDir}/${task.id}.md`;
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    return `# ${task.id}\n\n${task.plan}\n`;
  }
  const raw = readFileSync(abs, 'utf8');
  const match = raw.match(/```[\s\S]*?```/);
  return match ? match[0].replace(/^```\n?/, '').replace(/\n?```$/, '') : raw;
}

function gateStatus() {
  const missing = [];
  for (const g of GATE_ARTIFACTS) {
    const requireAll = g.requireAll !== false;
    const checks = g.paths.map((p) => existsSync(join(root, p)));
    const ok = requireAll ? checks.every(Boolean) : checks.some(Boolean);
    if (!ok) missing.push(g.id);
  }
  return { pass: missing.length === 0, missing };
}

function ensureLog() {
  mkdirSync(join(root, 'docs/evaluations'), { recursive: true });
  if (existsSync(logPath)) return;
  writeFileSync(
    logPath,
    `# Cursor YOLO ${label} log — ${today}\n\n| Tid | Task | Status | Notering |\n|-----|------|--------|----------|\n`,
    'utf8',
  );
}

function logLine(taskId, status, note) {
  ensureLog();
  const ts = new Date().toISOString().slice(11, 19);
  appendFileSync(logPath, `| ${ts} | ${taskId} | ${status} | ${note} |\n`, 'utf8');
}

function resolveNextTask(queue, state) {
  if (requiresParallelGate && !state.parallelPhase?.gatePassed) return null;
  for (const id of state.taskOrder ?? []) {
    if (state.sequentialPhase.completedTaskIds?.includes(id)) continue;
    if (state.sequentialPhase.skippedTaskIds?.includes(id)) continue;
    const t = queue.tasks.find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

function runSmoke(task) {
  const steps = [...(task.smoke ?? [])];
  if (task.fullGate) steps.push('npm run smoke:predeploy:build');
  if (steps.length === 0) return true;
  for (const step of steps) {
    console.log(`[cursor:yolo] smoke → ${step}`);
    const r = spawnSync(step, { cwd: root, shell: true, stdio: 'inherit' });
    if (r.status !== 0) return false;
  }
  return true;
}

function readMasterPrompt() {
  if (!existsSync(masterPath)) return '';
  const raw = readFileSync(masterPath, 'utf8');
  const match = raw.match(/```[\s\S]*?```/);
  return match ? match[0].replace(/^```\n?/, '').replace(/\n?```$/, '').trim() : raw.trim();
}

function emitPromptBlock(taskId, title, prompt, promptLabel) {
  const doneCmd =
    yoloVersion === 6 ? `npm run cursor:yolo:v6 -- done ${taskId}` : `npm run cursor:yolo -- done ${taskId}`;
  const body = `# Cursor YOLO ${label} — ${promptLabel}\n\n**Task:** \`${taskId}\` — ${title}\n\n**När klar:** \`${doneCmd}\`\n\n---\n\n\`\`\`\n${prompt.trim()}\n\`\`\`\n`;
  mkdirSync(dirname(nextPromptPath), { recursive: true });
  writeFileSync(nextPromptPath, body, 'utf8');
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`  ${promptLabel}: ${taskId} — ${title}`);
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log(prompt.trim());
  console.log('');
  console.log(`[cursor:yolo] Prompt sparad → ${nextPromptPath}`);
  console.log(`[cursor:yolo] Efter klar: ${doneCmd}`);
  try {
    spawnSync('pbcopy', { input: prompt.trim(), encoding: 'utf8' });
    console.log('[cursor:yolo] Kopierad till urklipp (pbcopy).');
  } catch {
    /* optional */
  }
}

function emitNextPrompt(task, label) {
  emitPromptBlock(task.id, task.title, readPrompt(task), label);
}

function printStatus(queue, state) {
  const gate = gateStatus();
  console.log(`[cursor:yolo] ${label} sekventiell kö`);
  if (requiresParallelGate) {
    console.log('[cursor:yolo] Gate P1–P3:', gate.pass ? 'PASS' : `väntar (${gate.missing.join(', ')})`);
    console.log('[cursor:yolo] Sekventiell gate:', state.parallelPhase?.gatePassed ? 'öppen' : 'stängd');
  } else {
    console.log('[cursor:yolo] Parallell gate: ej krävd (v6 fortsätter från v5 PASS)');
  }
  const done = state.sequentialPhase?.completedTaskIds?.length ?? 0;
  const total = state.taskOrder?.length ?? 0;
  console.log('[cursor:yolo] Sekventiell progress:', done, '/', total);
  const next = resolveNextTask(queue, state);
  if (next) console.log('[cursor:yolo] Nästa:', next.id, '—', next.title);
  else if (state.parallelPhase?.gatePassed) console.log('[cursor:yolo] Alla sekventiella uppgifter klara.');
  else if (requiresParallelGate) console.log('[cursor:yolo] Väntar på gate — kör: npm run cursor:yolo -- gate-pass');
}

function main() {
  const queue = loadQueue();
  let state = loadState();

  if (!state.taskOrder?.length) {
    state.taskOrder = queue.tasks.filter((t) => t.phase === 'sequential').map((t) => t.id);
  }

  if (cmd === 'status') {
    printStatus(queue, state);
    return;
  }

  if (cmd === 'gate') {
    if (!requiresParallelGate) {
      console.log('[cursor:yolo] v6 — ingen parallell gate (redan öppen)');
      return;
    }
    const g = gateStatus();
    console.log('[cursor:yolo] Gate artifacts:', g.pass ? 'alla finns' : 'saknas');
    if (!g.pass) g.missing.forEach((m) => console.log('  -', m));
    return;
  }

  if (cmd === 'gate-pass') {
    if (!requiresParallelGate) {
      console.log('[cursor:yolo] v6 — gate redan öppen från start');
      return;
    }
    state.parallelPhase = state.parallelPhase ?? {};
    state.parallelPhase.gatePassed = true;
    state.parallelPhase.gatePassedAt = new Date().toISOString();
    state.parallelPhase.status = 'done';
    state.sequentialPhase = state.sequentialPhase ?? {};
    state.sequentialPhase.status = 'ready';
    saveState(state);
    logLine('gate', 'PASS', 'P1–P3 gate öppnad');
    console.log('[cursor:yolo] ✓ Gate öppen — sekventiell fas kan starta.');
    const next = resolveNextTask(queue, state);
    if (next) {
      console.log('[cursor:yolo] Kör: npm run cursor:yolo -- master   (EN chatt P4→P13)');
      console.log('[cursor:yolo] Eller: npm run cursor:yolo -- next   (en uppgift i taget)');
    }
    return;
  }

  if (cmd === 'master') {
    if (requiresParallelGate && !state.parallelPhase?.gatePassed) {
      const g = gateStatus();
      if (g.pass) {
        state.parallelPhase.gatePassed = true;
        saveState(state);
      } else {
        console.error('[cursor:yolo] Gate stängd. Vänta på P1–P3 eller: npm run cursor:yolo -- gate-pass');
        process.exit(1);
      }
    }
    if (!existsSync(masterPath)) {
      console.error('[cursor:yolo] Saknar', masterPath);
      process.exit(1);
    }
    const master = readMasterPrompt();
    emitPromptBlock(masterTaskId, masterTitle, master, 'MASTER SEKVENTIELL');
    console.log('[cursor:yolo] Öppna EN ny Agent-chatt (YOLO på), klistra in MASTER-prompten ovan.');
    return;
  }

  if (cmd === 'next') {
    if (requiresParallelGate && !state.parallelPhase?.gatePassed) {
      console.error('[cursor:yolo] Gate stängd. Kör gate-pass först.');
      process.exit(1);
    }
    const task = resolveNextTask(queue, state);
    if (!task) {
      console.log('[cursor:yolo] Ingen fler uppgift i kön.');
      return;
    }
    state.sequentialPhase.currentTaskId = task.id;
    saveState(state);
    emitNextPrompt(task, 'NÄSTA UPPGIFT');
    return;
  }

  if (cmd === 'done') {
    const id = argv[1] ?? state.sequentialPhase?.currentTaskId ?? resolveNextTask(queue, state)?.id;
    if (!id) {
      console.error('[cursor:yolo] Usage: cursor:yolo done <task-id>');
      process.exit(1);
    }
    const task = queue.tasks.find((t) => t.id === id);
    if (!task) {
      console.error('[cursor:yolo] Okänd task:', id);
      process.exit(1);
    }
    if (process.env.CURSOR_YOLO_SKIP_SMOKE !== '1') {
      console.log('[cursor:yolo] Kör task-smoke...');
      if (!runSmoke(task)) {
        if (!state.sequentialPhase.failedTaskIds.includes(id)) {
          state.sequentialPhase.failedTaskIds.push(id);
        }
        saveState(state);
        logLine(id, 'smoke FAIL', task.title);
        process.exit(1);
      }
    }
    if (!state.sequentialPhase.completedTaskIds.includes(id)) {
      state.sequentialPhase.completedTaskIds.push(id);
    }
    state.sequentialPhase.currentTaskId = null;
    saveState(state);
    logLine(id, 'PASS', task.title);
    console.log('[cursor:yolo] ✓ Klar:', id);
    const next = resolveNextTask(queue, state);
    if (next) {
      console.log('[cursor:yolo] Nästa automatiskt: npm run cursor:yolo -- next');
      emitNextPrompt(next, 'AUTO NÄSTA');
    } else {
      console.log('[cursor:yolo] 🎉 Hela sekventiella kön klar.');
    }
    return;
  }

  if (cmd === 'skip') {
    const id = argv[1] ?? state.sequentialPhase?.currentTaskId;
    if (!id) {
      console.error('[cursor:yolo] Usage: cursor:yolo skip <task-id>');
      process.exit(1);
    }
    if (!state.sequentialPhase.skippedTaskIds.includes(id)) {
      state.sequentialPhase.skippedTaskIds.push(id);
    }
    state.sequentialPhase.currentTaskId = null;
    saveState(state);
    logLine(id, 'SKIP', '');
    console.log('[cursor:yolo] Hoppade över:', id);
    printStatus(queue, state);
    return;
  }

  if (cmd === 'watch') {
    const pollMs = Number(argv[1] ?? 45_000);
    console.log(`[cursor:yolo] Watch — poll var ${pollMs / 1000}s (Ctrl+C avbryt)`);
    const tick = () => {
      state = loadState();
      const g = gateStatus();
      if (requiresParallelGate && !state.parallelPhase?.gatePassed) {
        if (g.pass) {
          state.parallelPhase.gatePassed = true;
          state.parallelPhase.gatePassedAt = new Date().toISOString();
          state.sequentialPhase.status = 'ready';
          saveState(state);
          console.log('[cursor:yolo] ✓ Gate auto-PASS (P1–P3 artifacts)');
          emitPromptBlock(masterTaskId, masterTitle, readMasterPrompt(), 'GATE ÖPPEN — STARTA MASTER');
          console.log('[cursor:yolo] Öppna NY Agent-chatt (YOLO på) och klistra in prompten.');
          return;
        }
        console.log('[cursor:yolo] Väntar på P1–P3... saknas:', g.missing.join(', '));
        setTimeout(tick, pollMs);
        return;
      }
      const next = resolveNextTask(queue, state);
      if (next) {
        console.log('[cursor:yolo] Gate öppen. Nästa i kö:', next.id, '— kör: npm run cursor:yolo -- next');
      }
    };
    tick();
    return;
  }

  console.error('[cursor:yolo] Okänt kommando:', cmd);
  console.error('Kommandon: status | gate | gate-pass | master | next | done | skip | watch');
  process.exit(1);
}

main();
