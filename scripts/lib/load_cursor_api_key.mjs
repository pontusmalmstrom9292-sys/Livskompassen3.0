/**
 * Laddar CURSOR_API_KEY från miljö eller lokala env-filer (gitignorerade).
 * Prioritet: process.env → .env.local → .env
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const ENV_FILES = [".env.local", ".env"];

function readEnvValue(filePath, key) {
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const name = trimmed.slice(0, eq).trim();
    if (name !== key) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value.trim();
  }
  return "";
}

/** @returns {{ loaded: boolean, source: string | null, key: string }} */
export function loadCursorApiKey() {
  const fromEnv = process.env.CURSOR_API_KEY?.trim();
  if (fromEnv) {
    return { loaded: true, source: "process.env", key: fromEnv };
  }

  for (const rel of ENV_FILES) {
    const path = join(root, rel);
    if (!existsSync(path)) continue;
    const value = readEnvValue(path, "CURSOR_API_KEY");
    if (!value) continue;
    process.env.CURSOR_API_KEY = value;
    return { loaded: true, source: rel, key: value };
  }

  return { loaded: false, source: null, key: "" };
}

export function cursorApiKeyHint() {
  return [
    "Sätt nyckel på ett av sätten:",
    "  1. Lägg i .env (projektroten): CURSOR_API_KEY=crsr_...",
    "  2. Eller .env.local (samma format) — dold fil, Cmd+P → .env.local",
    "  3. export CURSOR_API_KEY=\"crsr_...\" i samma terminal",
    "Nyckel: cursor.com/dashboard → API-nycklar",
  ].join("\n");
}

export { root as projectRoot };
