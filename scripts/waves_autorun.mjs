#!/usr/bin/env node
/**
 * Självgående förbättringsvågor (Fas 24) — v49+.
 *
 * Usage:
 *   npm run waves:autorun -- --dry-run
 *   npm run waves:autorun                    # nästa ofullständiga våg (SDK om nyckel finns)
 *   npm run waves:autorun -- --through=54    # kedja till 54
 *   npm run waves:autorun:night             # max 1 våg
 *
 * Env:
 *   CURSOR_API_KEY — krävs för SDK-agent (annars dry-run / local-only tips)
 *   SDK_YOLO_UNATTENDED=1 — branch-commit efter våg (ingen auto-merge main för v49+)
 *   YOLO_WAVE_AUTORUN=1 — tillåt kedja
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCursorApiKey, cursorApiKeyHint } from "./lib/load_cursor_api_key.mjs";
import {
  ensureBuildWaveScaffold,
  getYoloConfig,
  isQueueComplete,
  loadState,
  writeSdkRunReport,
  BUILD_WAVE_MAX,
} from "./lib/cursor_yolo_shared.mjs";
import {
  IMPROVEMENT_WAVE_MIN,
  acquireWaveLock,
  releaseWaveLock,
  createRollbackTag,
  restoreToTag,
  hygieneWaveStatuses,
  resolveNextIncompleteWave,
  loadWaveMachineState,
  saveWaveMachineState,
  ensureOrkesterDir,
  markWaveCompleted,
} from "./lib/wave_machine.mjs";
import { getBuildWaveDef } from "./lib/cursor_yolo_build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function parseArg(name, fallback) {
  const matches = args.filter((a) => a.startsWith(`--${name}=`));
  const eq = matches.at(-1)?.split("=")[1];
  if (eq !== undefined && eq !== "") return eq;
  return fallback;
}

const dryRun = hasFlag("dry-run");
const nightCap = hasFlag("night") || process.env.WAVES_AUTORUN_NIGHT === "1";
const fromDefault = String(IMPROVEMENT_WAVE_MIN);
const fromVersion = Number(parseArg("from", fromDefault));
const throughVersion = Number(parseArg("through", String(BUILD_WAVE_MAX)));
const waveGate = parseArg("wave-gate", "static");
const unattended =
  hasFlag("unattended") ||
  process.env.SDK_YOLO_UNATTENDED === "1" ||
  process.env.SDK_YOLO_UNATTENDED === "true";
const maxWaves = nightCap ? 1 : Number(parseArg("max-waves", "99"));
const maxRetries = Number(parseArg("max-retries", "2"));

function runNode(script, scriptArgs) {
  return (
    spawnSync(process.execPath, [script, ...scriptArgs], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    }).status ?? 1
  );
}

function runWaveSdk(version) {
  return runNode("scripts/sdk-cursor-yolo.mjs", ["--run", `--version=${version}`]);
}

function runWaveGate(version) {
  return runNode("scripts/sdk-yolo-wave-gate.mjs", [
    `--version=${version}`,
    `--gate=${waveGate}`,
  ]);
}

function runUnattendedPost(version) {
  if (!unattended) return 0;
  return runNode("scripts/sdk-yolo-unattended.mjs", [`--after-wave=${version}`]);
}

async function main() {
  ensureOrkesterDir();

  if (!existsSync(join(root, ".orkester/wave-machine-state.json"))) {
    saveWaveMachineState({
      machine: "improvement-waves",
      activeVersion: null,
      status: "idle",
      completedVersions: [],
      failedAt: null,
      pmirSkips: [],
      lastGate: null,
      rollbackTag: null,
    });
  }

  const hygieneFixed = hygieneWaveStatuses(34, 48);
  if (hygieneFixed.length) {
    console.log(`[waves] Status-hygien: markerade completed → v${hygieneFixed.join(", v")}`);
  }

  if (fromVersion < IMPROVEMENT_WAVE_MIN) {
    console.error(
      `[waves] Improvement waves startar vid v${IMPROVEMENT_WAVE_MIN} (använd sdk:yolo:full för 34–48)`,
    );
    process.exit(1);
  }
  if (throughVersion > BUILD_WAVE_MAX || fromVersion > throughVersion) {
    console.error(`[waves] Ogiltigt intervall ${fromVersion}–${throughVersion} (max ${BUILD_WAVE_MAX})`);
    process.exit(1);
  }

  const next = resolveNextIncompleteWave(fromVersion, throughVersion);
  console.log(`[waves] Improvement autorun v${fromVersion}→v${throughVersion}`);
  console.log(`[waves] Nästa ofullständiga våg: ${next ?? "(alla klara)"}`);
  console.log(`[waves] dry-run=${dryRun} night=${nightCap} gate=${waveGate} unattended=${unattended}`);

  if (dryRun) {
    if (next != null) {
      const wave = getBuildWaveDef(next);
      console.log(`[waves] dry-run OK — skulle köra v${next} ${wave.id}: ${wave.title}`);
      console.log(`[waves] agent=${wave.agent}`);
      console.log(`[waves] smoke=${(wave.smoke ?? []).join(" && ")}`);
    } else {
      console.log("[waves] dry-run OK — ingen kvarvarande våg i intervallet");
    }
    process.exit(0);
  }

  const markDone = parseArg("mark-done", "");
  if (markDone) {
    const v = Number(markDone);
    await ensureBuildWaveScaffold(v);
    markWaveCompleted(v, { notes: "Marked done via waves:autorun --mark-done" });
    console.log(`[waves] Markerade v${v} completed`);
    process.exit(0);
  }

  if (next == null) {
    saveWaveMachineState({
      ...loadWaveMachineState(),
      status: "done",
      activeVersion: null,
    });
    console.log("[waves] Alla förbättringsvågor klara i intervallet");
    process.exit(0);
  }

  const keyInfo = loadCursorApiKey();
  if (!keyInfo.key) {
    console.error("[waves] CURSOR_API_KEY saknas — SDK-agent kan inte köra.");
    console.error(cursorApiKeyHint());
    console.error(
      `[waves] Kör vågen i Cursor Agent, sedan: npm run waves:autorun -- --mark-done=${next}`,
    );
    process.exit(2);
  }

  let wavesRun = 0;
  let version = next;
  let lockHeld = false;
  const marathon = {
    runner: "waves:autorun",
    fromVersion,
    throughVersion,
    waveGate,
    unattended,
    startedAt: new Date().toISOString(),
    waves: [],
  };

  while (version != null && wavesRun < maxWaves) {
    const wave = getBuildWaveDef(version);
    await ensureBuildWaveScaffold(version);

    try {
      acquireWaveLock(version);
      lockHeld = true;
    } catch (err) {
      console.error(`[waves] ${err.message}`);
      process.exit(1);
    }

    const tag = createRollbackTag(version);
    saveWaveMachineState({
      ...loadWaveMachineState(),
      activeVersion: version,
      status: "running",
      rollbackTag: tag,
      failedAt: null,
    });

    console.log("");
    console.log("══════════════════════════════════════════════════");
    console.log(`  IMPROVEMENT våg v${version} — ${wave.id}`);
    console.log("══════════════════════════════════════════════════");

    const config = getYoloConfig(version);
    const state = loadState(config);
    let sdkExit = 0;

    if (isQueueComplete(state) && state.sequentialPhase?.status === "completed") {
      console.log(`[waves] v${version} redan completed — hoppar SDK`);
      marathon.waves.push({ version, skipped: true, reason: "already-complete" });
    } else {
      let attempt = 0;
      while (attempt <= maxRetries) {
        sdkExit = runWaveSdk(version);
        if (sdkExit === 0) break;
        attempt += 1;
        console.error(`[waves] SDK FAIL v${version} attempt ${attempt}/${maxRetries}`);
        if (attempt > maxRetries) break;
      }
      marathon.waves.push({ version, sdkExit, attempts: attempt + (sdkExit === 0 ? 0 : 1) });
      if (sdkExit !== 0) {
        if (tag) {
          const restored = restoreToTag(tag);
          console.error(`[waves] Rollback ${tag}: ${restored.ok ? "OK" : restored.reason}`);
        }
        saveWaveMachineState({
          ...loadWaveMachineState(),
          status: "failed",
          failedAt: version,
          activeVersion: null,
        });
        releaseWaveLock();
        writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version, reason: "sdk" });
        process.exit(sdkExit);
      }
    }

    const gateCode = runWaveGate(version);
    marathon.waves[marathon.waves.length - 1].gateExit = gateCode;
    if (gateCode !== 0) {
      if (tag) restoreToTag(tag);
      saveWaveMachineState({
        ...loadWaveMachineState(),
        status: "failed",
        failedAt: version,
        activeVersion: null,
      });
      releaseWaveLock();
      writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version, reason: "wave-gate" });
      process.exit(gateCode);
    }

    markWaveCompleted(version, {
      notes: `waves:autorun ${new Date().toISOString()}`,
      goNoGo: "GO",
      gateVerdict: "GO",
    });

    const postCode = runUnattendedPost(version);
    marathon.waves[marathon.waves.length - 1].unattendedExit = postCode;

    releaseWaveLock();
    lockHeld = false;
    wavesRun += 1;

    if (postCode !== 0) {
      writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version, reason: "unattended" });
      process.exit(postCode);
    }

    version = resolveNextIncompleteWave(fromVersion, throughVersion);
    if (nightCap) break;
  }

  if (lockHeld) releaseWaveLock();

  writeSdkRunReport({ ...marathon, completed: true });
  console.log(`[waves] Klart — körde ${wavesRun} våg(or). Nästa: ${resolveNextIncompleteWave(fromVersion, throughVersion) ?? "done"}`);
}

try {
  await main();
} catch (err) {
  console.error("[waves] FATAL", err);
  releaseWaveLock();
  process.exit(1);
}
