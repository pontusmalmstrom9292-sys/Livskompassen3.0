/**
 * Master Integration Manifest — barrel export.
 * Kanon: docs/architecture/MASTER-INTEGRATION-MANIFEST.md
 * Fas 1: inert — safe to import for new modules; not wired into ADK/runtime yet.
 */

export type {
  DomainContract,
  DomainId,
  MasterManifest,
  SiloId,
  SynapseTrigger,
  WormPolicy,
} from './domainContract';

export {
  CANONICAL_WORM_COLLECTIONS,
  DEFAULT_WORM_POLICY,
  SILO_ISOLATED_DOMAINS,
} from './domainContract';

export {
  DOMAIN_IDS,
  MASTER_MANIFEST,
  getAllWormCollections,
  getDomainContract,
  resolveCollectionDomain,
} from './masterManifest';

export {
  ManifestViolationError,
  assertCollectionAccess,
  assertSiloIsolation,
  assertVaultAccess,
  assertWorm,
  getWormPolicy,
  isDomainId,
  isSiloId,
  isWormCollection,
  validateDomainContract,
  validateSiloIsolationManifest,
} from './manifestGuards';
