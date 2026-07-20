import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Silo,
  SILO_COLLECTIONS,
  clearSiloAccessLogs,
  createSiloGuard,
  enforceSiloIsolation,
  getSiloAccessLogs,
} from './siloEnforcer';

describe('siloEnforcer', () => {
  it('allows access within silo collection allowlist', () => {
    clearSiloAccessLogs();
    const guard = createSiloGuard('testAllow', Silo.KUNSKAP);
    guard.assertCollections(['kampspar', 'kb_docs']);
    const logs = getSiloAccessLogs(Silo.KUNSKAP);
    assert.equal(logs.at(-1)?.success, true);
  });

  it('throws on cross-silo collection access (fail-closed)', () => {
    clearSiloAccessLogs();
    const assertKunskap = enforceSiloIsolation(
      'testViolate',
      Silo.KUNSKAP,
      [...SILO_COLLECTIONS[Silo.KUNSKAP]],
    );
    assert.throws(
      () => assertKunskap(['reality_vault']),
      /Silo violation: cannot access reality_vault/,
    );
    const logs = getSiloAccessLogs(Silo.KUNSKAP);
    assert.equal(logs.at(-1)?.success, false);
  });
});
