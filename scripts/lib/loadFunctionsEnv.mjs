import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const PROJECT_ID = 'gen-lang-client-0481875058';

export function loadFunctionsEnv() {
  const path = resolve(root, 'functions', `.env.${PROJECT_ID}`);
  if (!existsSync(path)) {
    throw new Error(`Saknar ${path} — sätt DRIVE_INGEST_OWNER_UID och deploy notifyNewFile`);
  }
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

export { root, PROJECT_ID };
