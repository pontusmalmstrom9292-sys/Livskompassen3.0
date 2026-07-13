#!/usr/bin/env node
/**
 * Natt-CI — lokal valideringsloop (build + smoke).
 * SDK-wrapper för framtida cloud-orkestrering; kör stegen direkt i denna process.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** @param {string} cmd @param {string[]} args @param {string} cwd */
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

const steps = [
  ["functions build", "npm", ["run", "build"], path.join(root, "functions")],
  ["frontend build", "npm", ["run", "build"], root],
  ["eslint", "npx", ["eslint", ".", "--max-warnings", "0"], root],
  ["smoke:valv", "npm", ["run", "smoke:valv"], root],
  ["smoke:kunskap", "npm", ["run", "smoke:kunskap"], root],
  ["smoke:dossier", "npm", ["run", "smoke:dossier"], root],
];

console.log("Natt-CI — start", new Date().toISOString());

const results = [];
for (const [label, cmd, args, cwd] of steps) {
  results.push({ label, ok: await runStep(label, cmd, args, cwd) });
}

console.log("\n── Sammanfattning ──");
let failed = 0;
for (const { label, ok } of results) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failed++;
}

process.exit(failed > 0 ? 2 : 0);
