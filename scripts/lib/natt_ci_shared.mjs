/**
 * Delad logik för Natt-CI (`natt:ci`, `sdk:natt-ci`).
 */
import { spawn, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const functionsDir = path.join(root, "functions");
export const envPath = path.join(root, ".env");
export const runsDir = path.join(root, ".orkester/natt-ci-runs");
export const REPO = "https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0";

export const STATIC_STEPS = [
  ["setup:env", "npm", ["run", "setup:env"], root],
  ["functions build", "npm", ["run", "build"], functionsDir],
  ["frontend build", "npm", ["run", "build"], root],
  ["smoke:predeploy", "npm", ["run", "smoke:predeploy"], root],
];

export const LIVE_STEPS = [
  ["smoke:valv", "smoke:valv"],
  ["smoke:kunskap", "smoke:kunskap"],
  ["smoke:dossier", "smoke:dossier"],
];

/** @param {string} label @param {string} cmd @param {string[]} args @param {string} cwd */
export function runStep(label, cmd, args, cwd = root) {
  const started = Date.now();
  return new Promise((resolve) => {
    console.log(`\n▶ ${label}`);
    const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false, env: process.env });
    child.on("close", (code) => {
      const ok = code === 0;
      console.log(ok ? `✓ ${label}` : `✗ ${label} (exit ${code})`);
      resolve({ label, ok, phase: "A", durationMs: Date.now() - started, exitCode: code ?? 1 });
    });
  });
}

/** @param {string} label @param {string} script */
export function runNpm(label, script, cwd = root) {
  const started = Date.now();
  return runStep(label, "npm", ["run", script], cwd).then((r) => ({
    ...r,
    label,
    phase: "B",
    durationMs: Date.now() - started,
  }));
}

export function readEnvFile() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

export function hasAppCheckDebugToken(env = readEnvFile()) {
  const fromFile = env.VITE_APP_CHECK_DEBUG_TOKEN?.trim();
  const fromProcess = process.env.VITE_APP_CHECK_DEBUG_TOKEN?.trim();
  return Boolean(fromFile || fromProcess);
}

export function ensureEnvFile() {
  console.log("\n▶ setup:env (uppdaterar .env från google-services + secrets)");
  try {
    execSync("node scripts/setup_env_from_google_services.mjs", { cwd: root, stdio: "inherit" });
    return existsSync(envPath);
  } catch {
    return false;
  }
}

export function ensureRootDeps() {
  if (existsSync(path.join(root, "node_modules"))) return true;
  console.log("\n▶ npm install (saknade node_modules i root)");
  try {
    execSync("npm install --legacy-peer-deps", { cwd: root, stdio: "inherit" });
    console.log("✓ npm install");
    return true;
  } catch {
    console.log("✗ npm install");
    return false;
  }
}

export function ensureFunctionsDeps() {
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

export function ensurePlaywright() {
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

/** @param {Array<{label:string,ok:boolean|null,phase:string,skipped?:boolean,durationMs?:number}>} results @param {object} meta */
export function writeRunReport(results, meta = {}) {
  mkdirSync(runsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const report = {
    at: new Date().toISOString(),
    ...meta,
    results,
    summary: {
      pass: results.filter((r) => r.ok === true).length,
      fail: results.filter((r) => r.ok === false).length,
      skip: results.filter((r) => r.skipped).length,
    },
  };
  const file = path.join(runsDir, `${stamp}.json`);
  writeFileSync(file, JSON.stringify(report, null, 2), "utf8");
  console.log(`\n[natt-ci] Rapport: ${file}`);
  return file;
}

export function printSummary(results) {
  console.log("\n── Sammanfattning ──");
  let failed = 0;
  for (const { label, ok, phase, skipped } of results) {
    if (skipped) {
      console.log(`SKIP  ${label} (fas ${phase})`);
      continue;
    }
    console.log(`${ok ? "PASS" : "FAIL"}  ${label} (fas ${phase})`);
    if (!ok) failed++;
  }
  return failed;
}

export function buildSdkPrompt() {
  return `Kör Natt-CI i repo-roten. Ett steg i taget — rapportera PASS/FAIL:

Fas A (alltid):
1. npm run setup:env
2. npm install (root, om node_modules saknas)
3. cd functions && npm install (om saknas) && npm run build
4. npm run build (frontend)
5. npx playwright install chromium (om saknas)
6. npm run smoke:predeploy

Fas B (endast om VITE_APP_CHECK_DEBUG_TOKEN finns i .env eller miljö):
7. npm run smoke:valv
8. npm run smoke:kunskap
9. npm run smoke:dossier

Regler:
- Avbryt inte Fas A vid första fel — kör alla steg och rapportera.
- Fas B: SKIP med tydlig orsak om App Check-token saknas.
- Avsluta med tabell: steg | fas | status | ev. felrad.
- Gör INGA kodändringar eller commits om inte ett steg FAIL:ar p.g.a. uppenbar fix.`;
}
