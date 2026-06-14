/**
 * Test verification layer — isolated manifest guard harness.
 * Mirrors assertArchitectureWrite from firestore.ts without Firebase init.
 * MUST NOT be imported by production code.
 */
import { execSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

/** Bundle manifest guards to a temp ESM file (no Firebase, no network after bundle). */
export async function loadManifestGuards() {
  const tempDir = mkdtempSync(join(tmpdir(), 'lk-manifest-guards-'));
  const outfile = join(tempDir, 'manifestGuards.bundle.mjs');
  const entry = join(root, 'src/modules/core/manifest/index.ts');

  try {
    execSync(
      `npx esbuild "${entry}" --bundle --format=esm --platform=node --outfile="${outfile}"`,
      { cwd: root, stdio: 'pipe', encoding: 'utf8' },
    );
    const mod = await import(pathToFileURL(outfile).href);
    return { guards: mod, cleanup: () => rmSync(tempDir, { recursive: true, force: true }) };
  } catch (err) {
    rmSync(tempDir, { recursive: true, force: true });
    throw err;
  }
}

/**
 * Mirror of firestore.ts assertArchitectureWrite — test-only, no side effects.
 * Keeps production VaultService.ts untouched while verifying the same guard chain.
 */
export function createArchitectureWriteAssert(guards) {
  const { assertSiloIsolation, assertWorm, ManifestViolationError } = guards;

  return function assertArchitectureWrite(collectionId, operation, crossSilo) {
    try {
      if (crossSilo) {
        assertSiloIsolation(crossSilo.fromSilo, crossSilo.toSilo);
      }
      if (operation === 'update' || operation === 'delete') {
        assertWorm(collectionId, operation);
      }
    } catch (err) {
      if (err instanceof ManifestViolationError) {
        throw new ManifestViolationError(
          err.code,
          `Architecture Violation [${err.code}]: ${err.message}`,
        );
      }
      throw err;
    }
  };
}

/** VaultService uses collection `reality_vault` — simulate blocked WORM update. */
export function simulateVaultServiceWormUpdate(assertArchitectureWrite) {
  assertArchitectureWrite('reality_vault', 'update');
}

/** Cross-silo RAG/data path — kunskap → valv must be rejected (U1). */
export function simulateCrossSiloAccess(assertArchitectureWrite) {
  assertArchitectureWrite('kampspar', 'create', { fromSilo: 'kunskap', toSilo: 'valv' });
}

export function expectManifestViolation(label, fn, { code, messageIncludes }) {
  try {
    fn();
    throw new Error(`${label}: förväntade ManifestViolationError men inget kastades`);
  } catch (err) {
    if (err.message?.includes('förväntade ManifestViolationError')) throw err;
    if (err?.name !== 'ManifestViolationError') {
      throw new Error(`${label}: oväntat fel — ${err?.name ?? 'Error'}: ${err?.message ?? err}`);
    }
    if (code && err.code !== code) {
      throw new Error(`${label}: fel code — fick ${err.code}, förväntade ${code}`);
    }
    if (messageIncludes && !String(err.message).includes(messageIncludes)) {
      throw new Error(`${label}: meddelande saknar "${messageIncludes}" — ${err.message}`);
    }
    console.log(`[smoke:manifest] ${label}: STOPPAD (OK) — ${err.message}`);
  }
}
