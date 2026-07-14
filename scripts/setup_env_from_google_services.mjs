#!/usr/bin/env node
/**
 * Skapar .env från publika Firebase-källor i repot (google-services.json).
 * Används av Natt-CI Fas B när .env saknas.
 * Firebase MCP firebase_get_sdk_config kräver inloggning — detta är offline-fallback.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");
const examplePath = resolve(root, ".env.example");
const googleServicesPath = resolve(root, "google-services.json");

/** Web app-id (samma projekt som google-services.json). */
const WEB_APP_ID = "1:1084026575972:web:2c85731a56adeb07dbd371";

function loadGoogleServices() {
  const raw = JSON.parse(readFileSync(googleServicesPath, "utf8"));
  const info = raw.project_info;
  const client = raw.client?.[0];
  const apiKey = client?.api_key?.[0]?.current_key;
  if (!info?.project_id || !apiKey) {
    throw new Error("google-services.json saknar project_id eller api_key");
  }
  return {
    apiKey,
    projectId: info.project_id,
    storageBucket: info.storage_bucket,
    messagingSenderId: info.project_number,
    authDomain: `${info.project_id}.firebaseapp.com`,
    appId: WEB_APP_ID,
  };
}

const OPTIONAL_ENV_KEYS = [
  "GEMINI_API_KEY",
  "VITE_GEMINI_API_KEY",
  "VITE_APP_CHECK_DEBUG_TOKEN",
  "VITE_APP_CHECK_RECAPTCHA_SITE_KEY",
  "SEED_FIREBASE_EMAIL",
  "SEED_FIREBASE_PASSWORD",
];

function applyOptionalFromProcess(lines) {
  for (const key of OPTIONAL_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) lines = upsertEnv(lines, key, value);
  }
  return lines;
}

function upsertEnv(lines, key, value) {
  const prefix = `${key}=`;
  const idx = lines.findIndex((l) => l.startsWith(prefix));
  const row = `${key}=${value}`;
  if (idx >= 0) lines[idx] = row;
  else lines.push(row);
  return lines;
}

function main() {
  const cfg = loadGoogleServices();
  let lines = existsSync(examplePath)
    ? readFileSync(examplePath, "utf8").split("\n")
    : [];

  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    lines = readFileSync(envPath, "utf8").split("\n");
  } else if (existsSync(envPath)) {
    lines = readFileSync(envPath, "utf8").split("\n");
  }

  lines = upsertEnv(lines, "VITE_FIREBASE_API_KEY", cfg.apiKey);
  lines = upsertEnv(lines, "VITE_FIREBASE_AUTH_DOMAIN", cfg.authDomain);
  lines = upsertEnv(lines, "VITE_FIREBASE_PROJECT_ID", cfg.projectId);
  lines = upsertEnv(lines, "VITE_FIREBASE_STORAGE_BUCKET", cfg.storageBucket);
  lines = upsertEnv(lines, "VITE_FIREBASE_MESSAGING_SENDER_ID", cfg.messagingSenderId);
  lines = upsertEnv(lines, "VITE_FIREBASE_APP_ID", cfg.appId);
  lines = upsertEnv(lines, "GCP_PROJECT_ID", cfg.projectId);
  lines = upsertEnv(lines, "GOOGLE_CLOUD_PROJECT", cfg.projectId);
  lines = applyOptionalFromProcess(lines);

  writeFileSync(envPath, lines.join("\n").replace(/\n*$/, "\n"), "utf8");
  const hasAppCheck = Boolean(
    readEnvValue(lines, "VITE_APP_CHECK_DEBUG_TOKEN") || process.env.VITE_APP_CHECK_DEBUG_TOKEN?.trim(),
  );
  console.log("[setup:env] .env skapad/uppdaterad från google-services.json");
  console.log(`[setup:env] project=${cfg.projectId} appId=${cfg.appId}`);
  console.log(`[setup:env] appCheckDebugToken=${hasAppCheck ? "ja" : "nej"}`);
}

function readEnvValue(lines, key) {
  const row = lines.find((l) => l.startsWith(`${key}=`));
  if (!row) return "";
  return row.slice(key.length + 1).trim();
}

main();
