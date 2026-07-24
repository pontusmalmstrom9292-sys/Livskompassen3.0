/**
 * Shared IO for UI QA Harden Loop — unified report under .cursor/qa-harden/
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const QA_DIR = resolve(ROOT, '.cursor/qa-harden');
export const LATEST_JSON = resolve(QA_DIR, 'latest.json');
export const LOG_NDJSON = resolve(QA_DIR, 'run.ndjson');

export function ensureQaDir() {
  mkdirSync(QA_DIR, { recursive: true });
}

export function writeLatest(payload) {
  ensureQaDir();
  const doc = {
    schema: 'qa-harden/v1',
    at: new Date().toISOString(),
    ...payload,
  };
  writeFileSync(LATEST_JSON, JSON.stringify(doc, null, 2));
  return doc;
}

export function readLatest() {
  if (!existsSync(LATEST_JSON)) return null;
  return JSON.parse(readFileSync(LATEST_JSON, 'utf8'));
}

export function appendNdjson(row) {
  ensureQaDir();
  writeFileSync(LOG_NDJSON, `${JSON.stringify({ ...row, t: Date.now() })}\n`, {
    flag: 'a',
  });
}

export function writeJson(name, data) {
  ensureQaDir();
  const p = resolve(QA_DIR, name);
  writeFileSync(p, JSON.stringify(data, null, 2));
  return p;
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export { ROOT };
