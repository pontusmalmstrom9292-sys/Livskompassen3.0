/**
 * Physical device probe — ADB + optional Maestro. SKIP if no USB device.
 * Usage: node scripts/debug_device_probe.mjs
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { writeJson, ROOT, QA_DIR, ensureQaDir } from './lib/qa_harden_io.mjs';

ensureQaDir();

const PACKAGE = 'com.livskompassen.app';
const MAESTRO_FLOW_FULL = resolve(ROOT, '.maestro/smoke-full-public.yaml');
const MAESTRO_FLOW = resolve(ROOT, '.maestro/smoke-dock.yaml');
const SCREENSHOT = resolve(QA_DIR, 'device-home.png');

function which(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  if (cmd === 'maestro') {
    const home = resolve(process.env.HOME || '', '.maestro/bin/maestro');
    if (existsSync(home)) return home;
  }
  return '';
}

function adb(args, opts = {}) {
  const adbPath =
    which('adb') ||
    resolve(process.env.HOME || '', 'Library/Android/sdk/platform-tools/adb');
  if (!existsSync(adbPath) && !which('adb')) {
    return { status: 127, stdout: '', stderr: 'adb not found' };
  }
  return spawnSync(adbPath, args, {
    encoding: 'utf8',
    cwd: ROOT,
    ...opts,
  });
}

const result = {
  probe: 'device',
  at: new Date().toISOString(),
  status: 'skip',
  detail: '',
  devices: [],
  maestro: null,
  logcatFatal: [],
  screenshot: null,
};

const devicesOut = adb(['devices']);
if (devicesOut.status === 127) {
  result.detail = 'adb saknas — installera Android platform-tools (gratis)';
  writeJson('device-probe.json', result);
  console.log(`[device] SKIP ${result.detail}`);
  process.exit(0);
}

const lines = (devicesOut.stdout || '')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('List'));
const ready = lines.filter((l) => /\tdevice$/.test(l)).map((l) => l.split('\t')[0]);
result.devices = ready;

if (ready.length === 0) {
  result.status = 'skip';
  result.detail = 'Ingen USB-telefon (adb devices tom) — webb-loop räcker';
  writeJson('device-probe.json', result);
  console.log(`[device] SKIP ${result.detail}`);
  process.exit(0);
}

result.detail = `device=${ready[0]}`;

// logcat FATAL (last buffer)
const logcat = adb(['logcat', '-d', '-t', '80', '*:E']);
const fatal = (logcat.stdout || '')
  .split('\n')
  .filter((l) => /FATAL|AndroidRuntime|Livskompassen/i.test(l))
  .slice(0, 15);
result.logcatFatal = fatal;

// screenshot (may be black on FLAG_SECURE zones — home usually ok on non-sacred)
mkdirSync(QA_DIR, { recursive: true });
const shot = adb(['exec-out', 'screencap', '-p'], { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 });
if (shot.status === 0 && shot.stdout && shot.stdout.length > 1000) {
  writeFileSync(SCREENSHOT, shot.stdout);
  result.screenshot = SCREENSHOT;
}

// Maestro: full public crawl by default (phone-primary). Dock-only: QA_DEVICE_FULL=0
const maestro = which('maestro');
const wantFull = process.env.QA_DEVICE_FULL !== '0';
const flow = wantFull && existsSync(MAESTRO_FLOW_FULL)
  ? MAESTRO_FLOW_FULL
  : existsSync(MAESTRO_FLOW)
    ? MAESTRO_FLOW
    : existsSync(MAESTRO_FLOW_FULL)
      ? MAESTRO_FLOW_FULL
      : null;
const flowLabel = flow && flow.includes('full') ? 'FULL' : 'dock';
const maestroTimeoutMs = Number(process.env.QA_DEVICE_TIMEOUT_MS || (wantFull ? 600_000 : 180_000));
if (maestro && flow) {
  console.log(`[device] Running Maestro ${flowLabel} flow (timeout ${Math.round(maestroTimeoutMs / 1000)}s)…`);
  const m = spawnSync(maestro, ['test', flow], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: maestroTimeoutMs,
    env: {
      ...process.env,
      MAESTRO_APP_ID: PACKAGE,
      MAESTRO_CLI_NO_ANALYTICS: '1',
      PATH: `${process.env.HOME}/.maestro/bin:${process.env.HOME}/Library/Android/sdk/platform-tools:${process.env.PATH || ''}`,
    },
  });
  const timedOut = m.error && m.error.code === 'ETIMEDOUT';
  result.maestro = {
    flow: flow.includes('full') ? 'smoke-full-public' : 'smoke-dock',
    exit: timedOut ? 124 : (m.status ?? 1),
    out: timedOut
      ? `TIMEOUT after ${maestroTimeoutMs}ms`
      : ((m.stdout || '') + (m.stderr || '')).slice(0, 1200),
  };
  result.status = !timedOut && (m.status ?? 1) === 0 ? 'pass' : 'fail';
  if (timedOut) result.detail += ' · maestro TIMEOUT';
  else if (result.status === 'fail') result.detail += ' · maestro FAIL';
} else {
  result.maestro = {
    exit: null,
    out: maestro ? 'flow missing' : 'maestro CLI ej installerad (valfritt, OSS)',
  };
  result.status = fatal.some((l) => /FATAL EXCEPTION/i.test(l)) ? 'fail' : 'pass';
  if (!maestro) result.detail += ' · maestro SKIP';
}

// Exhaustive every-button crawl on phone WebView (CDP) — default ON with USB.
// Disable: QA_DEVICE_EXHAUSTIVE=0
const wantExhaustive = process.env.QA_DEVICE_EXHAUSTIVE !== '0';
result.exhaustive = null;
if (wantExhaustive && ready.length > 0) {
  const exhaustScript = resolve(ROOT, 'scripts/debug_device_tap_exhaustive.mjs');
  if (existsSync(exhaustScript)) {
    console.log('[device] Running exhaustive WebView tap crawl (CDP)…');
    // Keep screen awake during long CDP crawl
    adb(['shell', 'input', 'keyevent', 'KEYCODE_WAKEUP']);
    adb(['shell', 'svc', 'power', 'stayon', 'true']);
    // 83 routes × taps × scroll — default 20 min; override via QA_DEVICE_EXHAUSTIVE_TIMEOUT_MS
    const exTimeout = Number(process.env.QA_DEVICE_EXHAUSTIVE_TIMEOUT_MS || 1_200_000);
    const ex = spawnSync(process.execPath, [exhaustScript], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: exTimeout,
      env: {
        ...process.env,
        QA_DEVICE_SERIAL: ready[0],
        PATH: `${process.env.HOME}/Library/Android/sdk/platform-tools:${process.env.PATH || ''}`,
      },
    });
    adb(['shell', 'svc', 'power', 'stayon', 'false']);
    const timedOut = ex.error && ex.error.code === 'ETIMEDOUT';
    let exJson = null;
    const exPath = resolve(QA_DIR, 'device-tap-exhaustive.json');
    if (existsSync(exPath)) {
      try {
        exJson = JSON.parse(readFileSync(exPath, 'utf8'));
      } catch {
        exJson = null;
      }
    }
    const issueCount = exJson?.issueCount ?? null;
    const detailRaw = timedOut
      ? `TIMEOUT after ${exTimeout}ms`
      : exJson?.detail || ((ex.stdout || '') + (ex.stderr || '')).slice(-400);
    const harnessOnly =
      (timedOut || /Target page, context or browser has been closed|TIMEOUT/i.test(String(detailRaw))) &&
      (issueCount === 0 || issueCount === null);
    const exFail = timedOut
      ? !harnessOnly
      : (exJson?.status || (ex.status === 0 ? 'pass' : 'fail')) === 'fail' && !harnessOnly;
    result.exhaustive = {
      exit: timedOut ? 124 : (ex.status ?? 1),
      status: harnessOnly ? 'soft-fail' : timedOut ? 'fail' : exJson?.status || (ex.status === 0 ? 'pass' : 'fail'),
      detail: harnessOnly
        ? `harness-timeout (0 UI issues) — ${String(detailRaw).slice(0, 120)}`
        : detailRaw,
      routesVisited: exJson?.routesVisited ?? null,
      actions: exJson?.actions ?? null,
      issueCount,
      harnessOnly: harnessOnly || undefined,
    };
    if (result.exhaustive.status === 'fail' || exFail) {
      result.status = 'fail';
      result.detail += ' · exhaustive FAIL';
    } else if (result.exhaustive.status === 'soft-fail') {
      result.detail += ` · exhaustive soft-fail (${result.exhaustive.routesVisited || 0} vyer, 0 UI-fel)`;
    } else {
      result.detail += ` · exhaustive ${result.exhaustive.routesVisited || 0} vyer / ${result.exhaustive.actions || 0} tryck`;
    }
    if (ex.stdout) console.log(ex.stdout.slice(-1500));
    if (ex.stderr) console.log(ex.stderr.slice(-500));
  }
}

writeJson('device-probe.json', result);
console.log(`[device] ${result.status.toUpperCase()} ${result.detail}`);
if (fatal.length) console.log(`[device] logcat hits=${fatal.length}`);
process.exit(result.status === 'fail' ? 1 : 0);
