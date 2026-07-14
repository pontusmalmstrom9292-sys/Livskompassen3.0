#!/usr/bin/env node
/**
 * Ett kommando — vänta på att en våg är klar, kör sedan marathon till slut.
 * För att slippa vara kvar och starta nästa block manuellt.
 *
 * Usage:
 *   npm run sdk:yolo:away
 *   npm run sdk:yolo:away -- --after=22 --from=23 --through=33
 *   npm run sdk:yolo:away -- --from=23 --through=33   # starta direkt (ingen väntan)
 *
 * Mac — håll vaken:
 *   caffeinate -dimsu npm run sdk:yolo:away
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCursorApiKey, cursorApiKeyHint } from "./lib/load_cursor_api_key.mjs";
import {
  getYoloConfig,
  loadState,
  isQueueComplete,
} from "./lib/cursor_yolo_shared.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

const afterArg = args.find((a) => a.startsWith("--after="))?.split("=")[1];
const fromArg = args.find((a) => a.startsWith("--from="))?.split("=")[1];
const throughArg = args.find((a) => a.startsWith("--through="))?.split("=")[1];
const pollMs = Number(args.find((a) => a.startsWith("--poll="))?.split("=")[1] ?? 60_000);

const waitAfterVersion = afterArg ? Number(afterArg) : 22;
const fromVersion = Number(fromArg ?? 23);
const throughVersion = Number(throughArg ?? 33);
const waveCount = throughVersion - fromVersion + 1;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isVersionComplete(version) {
  const config = getYoloConfig(version);
  if (!config) return false;
  try {
    const state = loadState(config);
    if (!state.taskOrder?.length) return false;
    return isQueueComplete(state);
  } catch {
    return false;
  }
}

async function waitForVersion(version) {
  const config = getYoloConfig(version);
  if (!config) {
    console.error(`[sdk:away] Okänd våg v${version}`);
    process.exit(1);
  }
  console.log(`[sdk:away] Väntar på att v${version} ska bli klar (poll ${pollMs / 1000}s)…`);
  console.log("[sdk:away] Låt Cursor + terminalen med pågående marathon vara öppna.");

  while (!isVersionComplete(version)) {
    const state = loadState(config);
    const done =
      (state.sequentialPhase?.completedTaskIds?.length ?? 0) +
      (state.sequentialPhase?.skippedTaskIds?.length ?? 0);
    const total = state.taskOrder?.length ?? 0;
    const cur = state.sequentialPhase?.currentTaskId ?? "—";
    console.log(`[sdk:away] v${version}: ${done}/${total} · nu: ${cur}`);
    await sleep(pollMs);
  }
  console.log(`[sdk:away] ✓ v${version} klar — startar v${fromVersion}→v${throughVersion}`);
}

function runMarathon(from, waves) {
  console.log(`[sdk:away] Marathon v${from} → v${from + waves - 1} (${waves} våg(ar))…`);
  const code =
    spawnSync(
      process.execPath,
      [`scripts/sdk-yolo-marathon.mjs`, `--from=${from}`, `--waves=${waves}`],
      { cwd: root, stdio: "inherit", env: process.env },
    ).status ?? 1;
  return code;
}

async function main() {
  const keyInfo = loadCursorApiKey();
  if (!keyInfo.key) {
    console.error("[sdk:away] CURSOR_API_KEY saknas.");
    console.error(cursorApiKeyHint());
    process.exit(1);
  }
  if (keyInfo.source !== "process.env") {
    console.log(`[sdk:away] CURSOR_API_KEY från ${keyInfo.source}`);
  }

  if (waveCount < 1 || fromVersion > throughVersion) {
    console.error("[sdk:away] Ogiltigt intervall from/through");
    process.exit(1);
  }

  if (!getYoloConfig(fromVersion)) {
    console.error(`[sdk:away] Ingen config för v${fromVersion}`);
    process.exit(1);
  }

  console.log(`[sdk:away] Plan: v${fromVersion}→v${throughVersion} (${waveCount} vågor)`);

  const skipWait = args.includes("--no-wait");
  if (!skipWait && waitAfterVersion >= fromVersion) {
    console.error("[sdk:away] --after måste vara lägre än --from");
    process.exit(1);
  }

  if (!skipWait && waitAfterVersion > 0) {
    if (!isVersionComplete(waitAfterVersion)) {
      await waitForVersion(waitAfterVersion);
    } else {
      console.log(`[sdk:away] v${waitAfterVersion} redan klar — startar direkt.`);
    }
  }

  const code = runMarathon(fromVersion, waveCount);
  process.exit(code);
}

await main();
