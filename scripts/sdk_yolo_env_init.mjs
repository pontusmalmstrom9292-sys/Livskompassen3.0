#!/usr/bin/env node
/**
 * Skapar .env.local med CURSOR_API_KEY-plats (gitignorerad).
 * Usage: npm run sdk:yolo:env-init
 */
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { projectRoot } from "./lib/load_cursor_api_key.mjs";

const path = join(projectRoot, ".env.local");

if (existsSync(path)) {
  console.log("[sdk:yolo:env-init] .env.local finns redan — redigera CURSOR_API_KEY där.");
  process.exit(0);
}

writeFileSync(
  path,
  `# Cursor SDK — committas ALDRIG (gitignore)\n# Nyckel: cursor.com/dashboard → API-nycklar\nCURSOR_API_KEY=\n`,
  "utf8",
);
console.log("[sdk:yolo:env-init] Skapade .env.local");
console.log("[sdk:yolo:env-init] Öppna filen och klistra in nyckeln efter =");
console.log(`[sdk:yolo:env-init] Sedan: npm run sdk:yolo:v15`);
