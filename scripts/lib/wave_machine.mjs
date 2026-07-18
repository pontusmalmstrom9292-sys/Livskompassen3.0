/**
 * Improvement-wave machine helpers (Fas 24 v49+).
 * Lock · state · rollback tags · status hygiene · next-wave resolve.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  root,
  readJson,
  writeJson,
  getYoloConfig,
  isQueueComplete,
  BUILD_WAVE_MIN,
  BUILD_WAVE_MAX,
  IMPROVEMENT_WAVE_MIN,
} from "./cursor_yolo_shared.mjs";
import { loadBuildManifest, getBuildWaveDef } from "./cursor_yolo_build.mjs";

export const WAVE_MACHINE_STATE_PATH = join(root, ".orkester/wave-machine-state.json");
export const WAVE_LOCK_PATH = join(root, ".orkester/wave.lock");
export const PMIR_REGISTER_PATH = join(root, ".orkester/sdk-pmir-register.json");

/** @returns {object} */
export function defaultWaveMachineState() {
  return {
    machine: "improvement-waves",
    activeVersion: null,
    status: "idle",
    completedVersions: [],
    failedAt: null,
    pmirSkips: [],
    lastGate: null,
    rollbackTag: null,
    updatedAt: new Date().toISOString(),
  };
}

/** @returns {object} */
export function loadWaveMachineState() {
  return readJson(WAVE_MACHINE_STATE_PATH) ?? defaultWaveMachineState();
}

/** @param {object} state */
export function saveWaveMachineState(state) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  const tmp = `${WAVE_MACHINE_STATE_PATH}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  renameSync(tmp, WAVE_MACHINE_STATE_PATH);
  return next;
}

export function acquireWaveLock(version) {
  if (existsSync(WAVE_LOCK_PATH)) {
    const raw = readFileSync(WAVE_LOCK_PATH, "utf8").trim();
    let holder = raw;
    try {
      holder = JSON.parse(raw).version ?? raw;
    } catch {
      /* plain text */
    }
    throw new Error(`wave.lock held by v${holder} — endast en våg i taget`);
  }
  writeFileSync(
    WAVE_LOCK_PATH,
    `${JSON.stringify({ version, pid: process.pid, at: new Date().toISOString() }, null, 2)}\n`,
    "utf8",
  );
}

export function releaseWaveLock() {
  if (existsSync(WAVE_LOCK_PATH)) unlinkSync(WAVE_LOCK_PATH);
}

/** @param {number} version */
export function createRollbackTag(version) {
  const tag = `pre-wave-v${version}`;
  const r = spawnSync("git", ["tag", "-f", tag], { cwd: root, encoding: "utf8" });
  if (r.status !== 0) {
    console.warn(`[wave-machine] git tag ${tag} misslyckades:`, r.stderr?.trim() || r.stdout);
    return null;
  }
  return tag;
}

/** @param {string} tag */
export function restoreToTag(tag) {
  if (!tag) return { ok: false, reason: "no-tag" };
  const r = spawnSync("git", ["restore", "--source", tag, "--worktree", "--staged", "."], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    return { ok: false, reason: r.stderr?.trim() || "restore-failed" };
  }
  return { ok: true };
}

/**
 * Mark sequentialPhase.status=completed when all tasks done.
 * @param {number} [from]
 * @param {number} [to]
 */
export function hygieneWaveStatuses(from = BUILD_WAVE_MIN, to = BUILD_WAVE_MAX) {
  const fixed = [];
  for (let v = from; v <= to; v++) {
    const config = getYoloConfig(v);
    if (!config || !existsSync(config.statePath)) continue;
    const state = readJson(config.statePath);
    if (!state || !isQueueComplete(state)) continue;
    if (state.sequentialPhase?.status === "completed") continue;
    state.sequentialPhase = { ...state.sequentialPhase, status: "completed", currentTaskId: null };
    state.updatedAt = new Date().toISOString();
    if (!state.goNoGo && !state.gateVerdict) state.goNoGo = "GO";
    writeJson(config.statePath, state);
    fixed.push(v);
  }
  return fixed;
}

/**
 * Next incomplete build wave in [from, through].
 * @param {number} from
 * @param {number} through
 */
export function resolveNextIncompleteWave(from, through) {
  const manifest = loadBuildManifest();
  const versions = (manifest?.waves ?? [])
    .map((w) => w.version)
    .filter((v) => v >= from && v <= through)
    .sort((a, b) => a - b);

  for (const version of versions) {
    getBuildWaveDef(version); // throws if missing
    const config = getYoloConfig(version);
    if (!config) continue;
    if (!existsSync(config.statePath)) return version;
    const state = readJson(config.statePath);
    if (!state || !isQueueComplete(state) || state.sequentialPhase?.status !== "completed") {
      return version;
    }
  }
  return null;
}

/** @param {number} version */
export function markWaveCompleted(version, extra = {}) {
  const config = getYoloConfig(version);
  if (!config) throw new Error(`Ingen config v${version}`);
  const queue = readJson(config.queuePath);
  const state = readJson(config.statePath) ?? {
    version,
    queueFile: `.orkester/cursor-yolo-queue-v${version}.json`,
    sequentialPhase: {
      status: "in_progress",
      currentTaskId: null,
      completedTaskIds: [],
      skippedTaskIds: [],
      failedTaskIds: [],
    },
    taskOrder: queue?.tasks?.map((t) => t.id) ?? [],
  };

  const order = state.taskOrder?.length
    ? state.taskOrder
    : (queue?.tasks?.map((t) => t.id) ?? [`b${version}-deploy`, `b${version}-build`, `b${version}-gate`, `b${version}-vakt`]);

  const deployId = `b${version}-deploy`;
  const skipped = new Set(state.sequentialPhase?.skippedTaskIds ?? []);
  if (order.includes(deployId)) skipped.add(deployId);

  const completed = order.filter((id) => id !== deployId && !skipped.has(id));

  const next = {
    ...state,
    ...extra,
    version,
    buildWaveId: queue?.buildWave?.id ?? extra.buildWaveId ?? null,
    updatedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    sequentialPhase: {
      status: "completed",
      currentTaskId: null,
      completedTaskIds: completed,
      skippedTaskIds: [...skipped],
      failedTaskIds: [],
    },
    taskOrder: order,
    goNoGo: extra.goNoGo ?? state.goNoGo ?? "GO",
    gateVerdict: extra.gateVerdict ?? state.gateVerdict ?? "GO",
  };
  writeJson(config.statePath, next);

  const machine = loadWaveMachineState();
  const completedVersions = [...new Set([...(machine.completedVersions ?? []), version])].sort(
    (a, b) => a - b,
  );
  saveWaveMachineState({
    ...machine,
    activeVersion: null,
    status: version >= BUILD_WAVE_MAX ? "done" : "idle",
    completedVersions,
    failedAt: null,
    lastGate: { version, verdict: next.goNoGo },
    rollbackTag: machine.rollbackTag,
  });

  return next;
}

/** Ensure .orkester exists for state writes. */
export function ensureOrkesterDir() {
  const dir = join(root, ".orkester");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export { IMPROVEMENT_WAVE_MIN, BUILD_WAVE_MIN, BUILD_WAVE_MAX };
