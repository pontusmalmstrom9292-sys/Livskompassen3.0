#!/usr/bin/env node
/**
 * Rollback working tree to pre-wave tag.
 *
 * Usage:
 *   node scripts/wave_rollback.mjs --version=49
 *   node scripts/wave_rollback.mjs --tag=pre-wave-v49
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { restoreToTag, loadWaveMachineState, saveWaveMachineState, releaseWaveLock } from "./lib/wave_machine.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function parseArg(name) {
  return args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
}

const version = parseArg("version");
const tag = parseArg("tag") ?? (version ? `pre-wave-v${version}` : null) ?? loadWaveMachineState().rollbackTag;

if (!tag) {
  console.error("[wave-rollback] Ange --version=N eller --tag=pre-wave-vN");
  process.exit(1);
}

const list = spawnSync("git", ["tag", "-l", tag], { cwd: root, encoding: "utf8" });
if (!list.stdout?.trim()) {
  console.error(`[wave-rollback] Tag saknas: ${tag}`);
  process.exit(1);
}

const result = restoreToTag(tag);
if (!result.ok) {
  console.error(`[wave-rollback] FAIL: ${result.reason}`);
  process.exit(1);
}

releaseWaveLock();
saveWaveMachineState({
  ...loadWaveMachineState(),
  status: "paused",
  activeVersion: null,
  failedAt: version ? Number(version) : loadWaveMachineState().failedAt,
});

console.log(`[wave-rollback] ✓ Restored to ${tag} (ingen force-push; main orörd)`);
