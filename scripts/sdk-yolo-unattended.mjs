#!/usr/bin/env node
/**
 * Unattended post-wave ops: auto-commit, merge main, deploy hosting vid v47.
 *
 * Usage:
 *   node scripts/sdk-yolo-unattended.mjs --after-wave=34
 *   node scripts/sdk-yolo-unattended.mjs --deploy-hosting  (v47 only)
 *
 * Env:
 *   SDK_YOLO_UNATTENDED=1   krävs för git/deploy
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, root } from "./lib/cursor_yolo_shared.mjs";
import { BUILD_WAVE_MAX } from "./lib/cursor_yolo_build.mjs";

const args = process.argv.slice(2);

function parseArg(name) {
  return args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
}

function git(args, opts = {}) {
  return spawnSync("git", args, { cwd: root, stdio: "inherit", ...opts });
}

function run(cmd) {
  return spawnSync(cmd, { cwd: root, shell: true, stdio: "inherit" });
}

const FORBIDDEN_STAGE = [
  /(^|\/)\.env(\..+)?$/,
  /(^|\/)service-account.*\.json$/i,
  /(^|\/)gcp-key.*\.json$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)client_secret.*\.json$/i,
  /(^|\/)firebase-adminsdk.*\.json$/i,
];

function isForbiddenStagePath(path) {
  return FORBIDDEN_STAGE.some((re) => re.test(path));
}

function parsePorcelainPath(line) {
  if (!line.trim()) return "";
  const cleaned = line.replace(/^\?\?\s+/, "").replace(/^[ MADRCU?!]{1,2}\s+/, "");
  const parts = cleaned.split(" -> ");
  const raw = parts[parts.length - 1].trim();
  return raw.replace(/^"(.+)"$/, "$1");
}

function listChangedFiles() {
  const r = spawnSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" });
  if (r.status !== 0) return [];
  return (r.stdout ?? "")
    .split("\n")
    .map(parsePorcelainPath)
    .filter((p) => p && !isForbiddenStagePath(p));
}

function autoCommit(version) {
  const files = listChangedFiles();
  if (files.length === 0) {
    console.log("[sdk:unattended] Ingen säker diff — hoppar commit");
    return 0;
  }
  git(["reset"]);
  for (const file of files) {
    const r = git(["add", "--", file]);
    if (r.status !== 0) {
      console.warn(`[sdk:unattended] Hoppar fil (git add fail): ${file}`);
    }
  }
  const msg = `chore(yolo): build v${version} — SDK unattended marathon`;
  const r = git(["commit", "-m", msg]);
  if (r.status !== 0) {
    console.error("[sdk:unattended] Commit misslyckades");
    return r.status ?? 1;
  }
  console.log(`[sdk:unattended] ✓ Committed v${version} (${files.length} filer)`);
  return 0;
}

function mergeMain() {
  const branch = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).stdout?.trim();
  if (branch === "main") {
    console.log("[sdk:unattended] Redan på main");
    return 0;
  }
  git(["fetch", "origin", "main"]);
  const r = git(["merge", "origin/main", "--no-edit"]);
  if (r.status !== 0) {
    console.error("[sdk:unattended] Merge main FAIL — manuell fix krävs");
    return r.status ?? 1;
  }
  console.log("[sdk:unattended] ✓ Merged origin/main");
  return 0;
}

function deployHosting() {
  const pmir = readJson(join(root, ".orkester/sdk-pmir-register.json"));
  console.log("[sdk:unattended] Kör wave-gate full före deploy…");
  const gate = run("npm run smoke:predeploy:build");
  if (gate.status !== 0) {
    console.error("[sdk:unattended] smoke:predeploy:build FAIL — ingen deploy");
    return gate.status ?? 1;
  }
  if (!process.env.SDK_YOLO_ALLOW_DEPLOY && !args.includes("--allow-deploy")) {
    console.log("[sdk:unattended] Deploy SKIP — sätt SDK_YOLO_ALLOW_DEPLOY=1 eller --allow-deploy");
    return 0;
  }
  console.log("[sdk:unattended] firebase deploy --only hosting");
  const r = run("firebase deploy --only hosting");
  return r.status ?? 1;
}

async function main() {
  const unattended = process.env.SDK_YOLO_UNATTENDED === "1" || process.env.SDK_YOLO_UNATTENDED === "true";
  if (!unattended && !args.includes("--force")) {
    console.error("[sdk:unattended] Sätt SDK_YOLO_UNATTENDED=1");
    process.exit(1);
  }

  if (args.includes("--deploy-hosting")) {
    process.exit(deployHosting());
  }

  const afterWave = Number(parseArg("after-wave") ?? "0");
  if (!afterWave) {
    console.error("[sdk:unattended] Ange --after-wave=N");
    process.exit(1);
  }

  let code = autoCommit(afterWave);
  if (code !== 0) process.exit(code);

  code = mergeMain();
  if (code !== 0) process.exit(code);

  if (afterWave === BUILD_WAVE_MAX) {
    code = deployHosting();
    if (code !== 0) process.exit(code);
  }

  console.log(`[sdk:unattended] ✓ Post-wave v${afterWave} klar`);
}

await main();
