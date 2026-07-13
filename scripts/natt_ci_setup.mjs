/**
 * Natt-CI setup — verifierar @cursor/sdk, CURSOR_API_KEY och skapar state.
 * Usage: npm run natt-ci:setup
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const statePath = resolve(orkesterDir, 'natt-ci-state.json');
const require = createRequire(import.meta.url);

async function checkSdkPackage() {
  try {
    await import('@cursor/sdk');
    const entry = require.resolve('@cursor/sdk');
    const pkgPath = resolve(entry, '../../../package.json');
    const version = JSON.parse(readFileSync(pkgPath, 'utf8')).version;
    return { ok: true, version };
  } catch {
    return { ok: false, version: null };
  }
}

async function checkApiKey() {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key) return { ok: false, reason: 'CURSOR_API_KEY saknas' };
  try {
    const { Cursor } = await import('@cursor/sdk');
    const models = await Cursor.models.list({ apiKey: key });
    return { ok: true, modelCount: models?.length ?? 0 };
  } catch (err) {
    return { ok: false, reason: err?.message ?? String(err) };
  }
}

async function main() {
  mkdirSync(orkesterDir, { recursive: true });

  const sdk = await checkSdkPackage();
  console.log(`[natt-ci:setup] @cursor/sdk: ${sdk.ok ? `v${sdk.version}` : 'SAKNAS'}`);

  const state = {
    setupAt: new Date().toISOString(),
    sdk: { installed: sdk.ok, version: sdk.version },
    apiKey: { configured: Boolean(process.env.CURSOR_API_KEY?.trim()) },
    phases: {
      a: 'npm run natt-ci:fas-a  # orkester:night (deterministisk)',
      b: 'npm run natt-ci:fas-b  # ikoner (vid generator-ändring)',
      c: 'npm run natt-ci:fas-c  # git/arbetsyta',
      all: 'npm run natt-ci       # A+B+C+D',
    },
    agent: 'npm run natt-ci -- --agent  # valfri SDK-sammanfattning (kräver API-nyckel)',
  };

  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  console.log(`[natt-ci:setup] State: ${statePath}`);

  const api = await checkApiKey();
  state.apiKey.verified = api.ok;
  if (api.ok) {
    console.log(`[natt-ci:setup] CURSOR_API_KEY: OK (${api.modelCount} modeller)`);
    state.apiKey.modelCount = api.modelCount;
  } else if (state.apiKey.configured) {
    console.warn(`[natt-ci:setup] CURSOR_API_KEY: konfigurerad men ej verifierad — ${api.reason}`);
    state.apiKey.error = api.reason;
  } else {
    console.warn('[natt-ci:setup] CURSOR_API_KEY: saknas (deterministiska faser fungerar ändå)');
  }
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  if (!sdk.ok) {
    console.error('[natt-ci:setup] FAIL — kör: npm install --save-dev @cursor/sdk');
    process.exit(1);
  }
  console.log('[natt-ci:setup] PASS — kör: npm run natt-ci');
}

main();
