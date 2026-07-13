#!/usr/bin/env node
/**
 * Natt-CI — nattpass enligt docs/NATT-CI.md.
 * Fas A = smoke:predeploy:build (functions + frontend + smoke:predeploy)
 * Fas B = live Firebase-smokes (kräver .env)
 *
 * Cloud SDK: npm run sdk:natt-ci
 */
import { spawn, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const functionsDir = path.join(root, "functions");
const hasEnv = existsSync(path.join(root, ".env"));

function ensureEnvFile() {
  if (hasEnv) return true;
  console.log("\n▶ setup:env (skapar .env från google-services.json)");
  try {
    execSync("node scripts/setup_env_from_google_services.mjs", { cwd: root, stdio: "inherit" });
    return existsSync(path.join(root, ".env"));
  } catch {
    return false;
  }
}

/** @param {string} label @param {string} cmd @param {string[]} args @param {string} cwd */
function runStep(label, cmd, args, cwd = root) {
  return new Promise((resolve) => {
    console.log(`\n▶ ${label}`);
    const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false, env: process.env });
    child.on("close", (code) => {
      const ok = code === 0;
      console.log(ok ? `✓ ${label}` : `✗ ${label} (exit ${code})`);
      resolve(ok);
    });
  });
}

/** @param {string} label @param {string} script */
function runNpm(label, script, cwd = root) {
  return runStep(label, "npm", ["run", script], cwd);
}

function ensurePlaywright() {
  const marker = path.join(
    process.env.HOME ?? "/tmp",
    ".cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell",
  );
  if (existsSync(marker)) return true;
  console.log("\n▶ playwright install chromium (saknade browsers)");
  try {
    execSync("npx playwright install chromium", { cwd: root, stdio: "inherit" });
    console.log("✓ playwright install chromium");
    return true;
  } catch {
    console.log("✗ playwright install chromium");
    return false;
  }
}

function ensureFunctionsDeps() {
  if (existsSync(path.join(functionsDir, "node_modules"))) return true;
  console.log("\n▶ functions npm install (saknade node_modules)");
  try {
    execSync("npm install", { cwd: functionsDir, stdio: "inherit" });
    console.log("✓ functions npm install");
    return true;
  } catch {
    console.log("✗ functions npm install");
    return false;
  }
}

const staticSteps = [
  ["functions build", "npm", ["run", "build"], functionsDir],
  ["frontend build", "npm", ["run", "build"], root],
  ["smoke:predeploy", "npm", ["run", "smoke:predeploy"], root],
];

const liveSteps = [
  ["smoke:valv", "smoke:valv"],
  ["smoke:kunskap", "smoke:kunskap"],
  ["smoke:dossier", "smoke:dossier"],
];

console.log("Natt-CI — start", new Date().toISOString());
const envReady = ensureEnvFile();
console.log(
  envReady
    ? "Fas B: .env finns — kör live-smokes"
    : "Fas B: SKIP — kunde inte skapa .env",
);

const results = [];

if (!ensureFunctionsDeps()) {
  results.push({ label: "functions npm install", ok: false, phase: "A" });
} else if (!ensurePlaywright()) {
  results.push({ label: "playwright install chromium", ok: false, phase: "A" });
} else {
  for (const [label, cmd, args, cwd] of staticSteps) {
    results.push({ label, ok: await runStep(label, cmd, args, cwd), phase: "A" });
  }
}

if (envReady) {
  for (const [label, script] of liveSteps) {
    results.push({ label, ok: await runNpm(label, script), phase: "B" });
  }
} else {
  for (const [label] of liveSteps) {
    results.push({ label, ok: null, phase: "B", skipped: true });
  }
}

console.log("\n── Sammanfattning ──");
let failed = 0;
for (const { label, ok, phase, skipped } of results) {
  if (skipped) {
    console.log(`SKIP  ${label} (fas ${phase}, saknar .env)`);
    continue;
  }
  console.log(`${ok ? "PASS" : "FAIL"}  ${label} (fas ${phase})`);
  if (!ok) failed++;
}

process.exit(failed > 0 ? 2 : 0);
