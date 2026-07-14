#!/usr/bin/env node
/**
 * Full SDK build marathon v34→v47 med wave-gate + unattended git/deploy.
 *
 * Usage:
 *   caffeinate -dimsu npm run sdk:yolo:full
 *   npm run sdk:yolo:full -- --from=34 --through=47 --wave-gate=full --unattended
 *
 * Env:
 *   SDK_YOLO_UNATTENDED=1
 *   CURSOR_API_KEY=crsr_...
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCursorApiKey, cursorApiKeyHint } from "./lib/load_cursor_api_key.mjs";
import {
  getYoloConfig,
  ensureBuildWaveScaffold,
  loadState,
  isQueueComplete,
  writeSdkRunReport,
  BUILD_WAVE_MIN,
  BUILD_WAVE_MAX,
} from "./lib/cursor_yolo_shared.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function parseArg(name, fallback) {
  const matches = args.filter((a) => a.startsWith(`--${name}=`));
  const eq = matches.at(-1)?.split("=")[1];
  if (eq !== undefined && eq !== "") return eq;
  return fallback;
}

const fromVersion = Number(parseArg("from", process.env.CURSOR_YOLO_VERSION ?? String(BUILD_WAVE_MIN)));
const throughVersion = Number(parseArg("through", String(BUILD_WAVE_MAX)));
const waveGate = parseArg("wave-gate", "full");
const unattended = args.includes("--unattended") || process.env.SDK_YOLO_UNATTENDED === "1";

function runWave(version) {
  return (
    spawnSync(process.execPath, ["scripts/sdk-cursor-yolo.mjs", "--run", `--version=${version}`], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    }).status ?? 1
  );
}

function runWaveGate(version) {
  return (
    spawnSync(
      process.execPath,
      ["scripts/sdk-yolo-wave-gate.mjs", `--version=${version}`, `--gate=${waveGate}`],
      { cwd: root, stdio: "inherit", env: process.env },
    ).status ?? 1
  );
}

function runUnattendedPost(version) {
  if (!unattended) return 0;
  return (
    spawnSync(process.execPath, ["scripts/sdk-yolo-unattended.mjs", `--after-wave=${version}`], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    }).status ?? 1
  );
}

async function main() {
  const keyInfo = loadCursorApiKey();
  if (!keyInfo.key) {
    console.error("[sdk:full] CURSOR_API_KEY saknas.");
    console.error(cursorApiKeyHint());
    process.exit(1);
  }

  if (fromVersion < BUILD_WAVE_MIN || throughVersion > BUILD_WAVE_MAX || fromVersion > throughVersion) {
    console.error(`[sdk:full] Ogiltigt intervall — använd ${BUILD_WAVE_MIN}–${BUILD_WAVE_MAX}`);
    process.exit(1);
  }

  console.log(`[sdk:full] Build marathon v${fromVersion}→v${throughVersion}`);
  console.log(`[sdk:full] wave-gate=${waveGate} unattended=${unattended}`);

  const marathon = {
    runner: "sdk:yolo:full",
    fromVersion,
    throughVersion,
    waveGate,
    unattended,
    startedAt: new Date().toISOString(),
    waves: [],
  };

  for (let version = fromVersion; version <= throughVersion; version++) {
    await ensureBuildWaveScaffold(version);

    const config = getYoloConfig(version);
    if (!config) {
      console.error(`[sdk:full] Ingen config v${version}`);
      break;
    }

    const state = loadState(config);
    if (isQueueComplete(state)) {
      console.log(`[sdk:full] v${version} redan klar — hoppar SDK, kör gate`);
      marathon.waves.push({ version, skipped: true, reason: "already-complete" });
    } else {
      console.log("");
      console.log("══════════════════════════════════════════════════");
      console.log(`  BUILD våg v${version}`);
      console.log("══════════════════════════════════════════════════");

      const code = runWave(version);
      marathon.waves.push({ version, sdkExit: code });
      if (code !== 0) {
        writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version });
        process.exit(code);
      }
    }

    const gateCode = runWaveGate(version);
    marathon.waves[marathon.waves.length - 1].gateExit = gateCode;
    if (gateCode !== 0) {
      writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version, reason: "wave-gate" });
      process.exit(gateCode);
    }

    const postCode = runUnattendedPost(version);
    marathon.waves[marathon.waves.length - 1].unattendedExit = postCode;
    if (postCode !== 0) {
      writeSdkRunReport({ ...marathon, stopped: true, stoppedAt: version, reason: "unattended" });
      process.exit(postCode);
    }
  }

  writeSdkRunReport({ ...marathon, completed: true });
  console.log("[sdk:full] 🎉 Build marathon klart v34→v47");
}

await main();
