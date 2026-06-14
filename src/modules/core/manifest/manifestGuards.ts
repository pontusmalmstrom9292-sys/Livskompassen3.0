/**
 * Master Integration Manifest — runtime guards (inert until wired).
 * Kanon: docs/architecture/MASTER-INTEGRATION-MANIFEST.md
 */

import {
  DEFAULT_WORM_POLICY,
  SILO_ISOLATED_DOMAINS,
  type DomainContract,
  type DomainId,
  type SiloId,
  type WormPolicy,
} from './domainContract';
import {
  DOMAIN_IDS,
  MASTER_MANIFEST,
  getDomainContract,
  resolveCollectionDomain,
} from './masterManifest';

export class ManifestViolationError extends Error {
  readonly code: 'SILO_ISOLATION' | 'WORM_VIOLATION' | 'VAULT_REQUIRED' | 'UNKNOWN_COLLECTION';

  constructor(
    code: ManifestViolationError['code'],
    message: string,
  ) {
    super(message);
    this.name = 'ManifestViolationError';
    this.code = code;
  }
}

/** Type guard: value is a registered domain ID. */
export function isDomainId(value: string): value is DomainId {
  return (DOMAIN_IDS as readonly string[]).includes(value);
}

/** Type guard: value is a known silo ID. */
export function isSiloId(value: string): value is SiloId {
  return value === 'kunskap' || value === 'valv' || value === 'barnen' || value === 'vardag' || value === 'core';
}

/** Returns true if collection is registered as WORM in any domain. */
export function isWormCollection(collection: string): boolean {
  const domain = resolveCollectionDomain(collection);
  if (!domain) return false;
  return domain.wormCollections.some((col) => col === collection);
}

/** Returns WORM policy for a collection, or undefined if not WORM. */
export function getWormPolicy(collection: string): WormPolicy | undefined {
  return isWormCollection(collection) ? DEFAULT_WORM_POLICY : undefined;
}

/**
 * Assert U1 silo isolation — K/V/F MUST NOT cross-read other silos via RAG.
 * Core (C) is the only domain allowed non-empty allowedCrossReads (synapse coordination).
 */
export function assertSiloIsolation(fromSilo: SiloId, toSilo: SiloId): void {
  if (fromSilo === toSilo) return;
  if (fromSilo === 'core' || toSilo === 'core') return;

  const fromDomain = Object.values(MASTER_MANIFEST).find((d) => d.silo === fromSilo);
  if (!fromDomain) {
    throw new ManifestViolationError(
      'SILO_ISOLATION',
      `Unknown source silo: ${fromSilo}`,
    );
  }

  if (
    SILO_ISOLATED_DOMAINS.includes(fromDomain.id) &&
    fromDomain.allowedCrossReads.length === 0
  ) {
    throw new ManifestViolationError(
      'SILO_ISOLATION',
      `Cross-RAG forbidden: ${fromSilo} → ${toSilo} (U1)`,
    );
  }
}

/**
 * Assert a collection is WORM — client update/delete MUST be rejected.
 * Returns false (no throw) when collection is unknown (caller may fall through to Firestore rules).
 */
export function assertWorm(collection: string, operation: 'update' | 'delete'): boolean {
  if (!isWormCollection(collection)) return false;
  throw new ManifestViolationError(
    'WORM_VIOLATION',
    `WORM collection "${collection}" forbids ${operation}`,
  );
}

/**
 * Assert agent may access a collection per domain manifest + silo policy.
 * Mirrors functions/src/adk/registry.ts assertCollectionAccess (frontend mirror).
 */
export function assertCollectionAccess(
  domainId: DomainId,
  collection: string,
): boolean {
  const contract = getDomainContract(domainId);
  const allowed = [
    ...contract.wormCollections,
    ...contract.mutableCollections,
    ...contract.adminOnlyCollections,
  ];
  return allowed.some((col) => col === collection);
}

/**
 * Assert Valv domain access requires vault unlock token.
 */
export function assertVaultAccess(domainId: DomainId, vaultUnlocked: boolean): void {
  const contract = getDomainContract(domainId);
  if (contract.requiresVaultUnlock && !vaultUnlocked) {
    throw new ManifestViolationError(
      'VAULT_REQUIRED',
      `Domain ${domainId} requires vault unlock`,
    );
  }
}

/** Validate all silo-isolated domains have empty allowedCrossReads (build-time / smoke). */
export function validateSiloIsolationManifest(): string[] {
  const errors: string[] = [];
  for (const domainId of SILO_ISOLATED_DOMAINS) {
    const contract = getDomainContract(domainId);
    if (contract.allowedCrossReads.length > 0) {
      errors.push(
        `Domain ${domainId} violates U1: allowedCrossReads must be []`,
      );
    }
  }
  return errors;
}

/** Validate domain contract shape (smoke helper). */
export function validateDomainContract(contract: DomainContract): string[] {
  const errors: string[] = [];
  if (SILO_ISOLATED_DOMAINS.includes(contract.id) && contract.allowedCrossReads.length > 0) {
    errors.push(`${contract.id}: allowedCrossReads must be empty for silo-isolated domains`);
  }
  if (contract.id !== 'C' && contract.silo === 'core') {
    errors.push(`${contract.id}: only C may use silo "core"`);
  }
  return errors;
}
