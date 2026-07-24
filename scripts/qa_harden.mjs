/**
 * UI QA Harden Loop — detect → classify → Tier A recipes → smoke → report (max rounds).
 *
 * Usage:
 *   npm run qa:harden
 *   node scripts/qa_harden.mjs [baseUrl] [--rounds=5] [--no-smoke] [--no-device] [--detect-only]
 */
import { spawnSync, spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'node:net';
import {
  ROOT,
  QA_DIR,
  writeLatest,
  writeJson,
  readLatest,
  todayStamp,
  ensureQaDir,
} from './lib/qa_harden_io.mjs';
import { classifyFromLatest, swedishSummary } from './lib/qa_harden_classify.mjs';
import { applyTierARecipes } from './lib/qa_harden_tier_a_recipes.mjs';

const args = process.argv.slice(2);
const roundsArg = args.find((a) => a.startsWith('--rounds='));
const MAX_ROUNDS = roundsArg ? Math.max(1, Number(roundsArg.split('=')[1]) || 5) : 5;
const NO_SMOKE = args.includes('--no-smoke');
const NO_DEVICE = args.includes('--no-device');
const DETECT_ONLY = args.includes('--detect-only');

function portInUse(port) {
  return new Promise((resolvePort) => {
    const s = createServer();
    s.once('error', () => resolvePort(true));
    s.once('listening', () => {
      s.close(() => resolvePort(false));
    });
    s.listen(port, '127.0.0.1');
  });
}

async function probeUrl(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

/** Prefer explicit URL; else first live Vite on 5173–5178 (Pontus often lands on 5175). */
async function resolveBase() {
  const explicit = args.find((a) => a.startsWith('http'));
  if (explicit) return explicit;
  // Highest port first — Vite bumps 5173→5174→5175 when old servers linger
  for (const port of [5178, 5177, 5176, 5175, 5174, 5173]) {
    const url = `http://127.0.0.1:${port}`;
    if (await probeUrl(url)) {
      console.log(`[qa:harden] Found Vite at ${url}`);
      return url;
    }
  }
  return 'http://127.0.0.1:5173';
}

function runNode(script, scriptArgs = []) {
  return spawnSync(process.execPath, [resolve(ROOT, script), ...scriptArgs], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  });
}

function runNpm(scriptName) {
  return spawnSync('npm', ['run', scriptName], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
    shell: true,
  });
}

async function ensureVite(base) {
  if (await probeUrl(base)) {
    console.log(`[qa:harden] Vite reachable at ${base}`);
    return base;
  }
  const u = new URL(base);
  const port = Number(u.port || 5173);
  if (await portInUse(port)) {
    console.log(`[qa:harden] Port :${port} in use but not HTTP-ready — waiting…`);
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (await probeUrl(base)) {
        console.log(`[qa:harden] Vite ready at ${base}`);
        return base;
      }
    }
  }
  console.log(`[qa:harden] Starting vite on :${port} …`);
  const proc = spawn('npm', ['run', 'dev'], {
    cwd: ROOT,
    stdio: 'ignore',
    env: process.env,
    shell: true,
    detached: true,
  });
  proc.unref();
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    // Vite may bump port if busy — re-scan
    for (const p of [port, port + 1, port + 2, 5175]) {
      const url = `http://127.0.0.1:${p}`;
      if (await probeUrl(url)) {
        console.log(`[qa:harden] Vite ready at ${url}`);
        return url;
      }
    }
  }
  console.warn('[qa:harden] Vite start timeout — continuing anyway');
  return base;
}

ensureQaDir();
let BASE = await resolveBase();
BASE = await ensureVite(BASE);

const roundLogs = [];
let lastClassified = { findings: [], tierA: [], tierB: [], tierC: [] };

for (let round = 1; round <= MAX_ROUNDS; round++) {
  console.log(`\n######## QA HARDEN ROUND ${round}/${MAX_ROUNDS} ########`);

  const suite = runNode('scripts/debug_ui_suite.mjs', [BASE]);
  const suiteExit = suite.status ?? 1;

  let device = { status: 'skipped', detail: 'no-device flag' };
  // Always run a fresh device probe each round (reuse caused sticky false FAIL)
  if (!NO_DEVICE) {
    runNode('scripts/debug_device_probe.mjs', []);
    const deviceJson = resolve(QA_DIR, 'device-probe.json');
    if (existsSync(deviceJson)) {
      try {
        device = JSON.parse(readFileSync(deviceJson, 'utf8'));
      } catch {
        device = { status: 'skip', detail: 'parse-fail' };
      }
    } else {
      device = { status: 'skip', detail: 'no device-probe output' };
    }
  }

  const latestRaw = readLatest() || {};
  const latest = writeLatest({
    ...latestRaw,
    kind: 'qa-harden',
    round,
    suiteExit,
    device,
  });

  lastClassified = classifyFromLatest(latest);
  writeJson('classified.json', lastClassified);

  const md = swedishSummary(lastClassified, { date: todayStamp(), round });
  const evalDir = resolve(ROOT, 'docs/evaluations');
  mkdirSync(evalDir, { recursive: true });
  writeFileSync(
    resolve(evalDir, `${todayStamp()}-qa-harden.md`),
    `${md}\n\n_round ${round} · suiteExit=${suiteExit}_\n`,
  );
  if (lastClassified.tierB.length) {
    writeFileSync(
      resolve(evalDir, `${todayStamp()}-qa-harden-pontus.md`),
      `# Tier B — väntar på Pontus\n\n${lastClassified.tierB.map((f) => `- ${f.swedish}`).join('\n')}\n`,
    );
  }

  console.log(md);

  roundLogs.push({
    round,
    suiteExit,
    tierA: lastClassified.tierA.length,
    tierB: lastClassified.tierB.length,
    device: device.status,
  });

  if (DETECT_ONLY) {
    console.log('[qa:harden] --detect-only → stop');
    writeLatest({
      kind: 'qa-harden-final',
      base: BASE,
      rounds: roundLogs,
      classified: lastClassified,
      device: roundLogs[roundLogs.length - 1]?.device,
    });
    process.exit(suiteExit !== 0 ? 1 : 0);
  }

  if (lastClassified.tierA.length === 0) {
    console.log('[qa:harden] No Tier A findings — stop loop');
    if (!NO_SMOKE) {
      console.log('[qa:harden] Smoke gate…');
      const s1 = runNpm('smoke:locked-ux');
      const s2 = runNpm('smoke:design-modules');
      roundLogs[roundLogs.length - 1].smokeLocked = s1.status ?? 1;
      roundLogs[roundLogs.length - 1].smokeDesign = s2.status ?? 1;
    }
    break;
  }

  const fix = applyTierARecipes(lastClassified.tierA);
  writeJson(`tier-a-round-${round}.json`, { findings: lastClassified.tierA, fix });
  console.log(`[qa:harden] recipes applied=${fix.applied}`);
  for (const n of fix.notes) console.log(`  · ${n}`);

  writeJson('tier-a-agent-queue.json', {
    at: new Date().toISOString(),
    round,
    prompt:
      'Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.',
    findings: lastClassified.tierA,
    agents: ['sync-scroll-shell', 'sync-chrome-lock', 'sync-g85-ui-qa'],
  });

  if (!NO_SMOKE) {
    console.log('[qa:harden] Smoke after recipes…');
    const s1 = runNpm('smoke:locked-ux');
    const s2 = runNpm('smoke:design-modules');
    roundLogs[roundLogs.length - 1].smokeLocked = s1.status ?? 1;
    roundLogs[roundLogs.length - 1].smokeDesign = s2.status ?? 1;
  }

  if (fix.applied === 0) {
    const onlyNoise = lastClassified.tierA.every((f) =>
      ['CRASH_OR_STUCK', 'PAGEERROR', 'TOUCH_TOO_SMALL'].includes(f.code),
    );
    if (onlyNoise || lastClassified.tierA.length === 0) {
      console.log('[qa:harden] No further auto-recipes — stop (queue left for Cursor)');
      break;
    }
    console.log('[qa:harden] No recipe changes — re-detect next round');
    continue;
  }
}

writeLatest({
  kind: 'qa-harden-final',
  base: BASE,
  rounds: roundLogs,
  classified: lastClassified,
  device: roundLogs[roundLogs.length - 1]?.device,
});

const remainingA = lastClassified.tierA.length;
const failedSmoke = roundLogs.some((r) => r.smokeLocked === 1 || r.smokeDesign === 1);
console.log('\n=== QA HARDEN DONE ===');
console.log(JSON.stringify(roundLogs, null, 2));
process.exit(remainingA > 0 || failedSmoke ? 1 : 0);
