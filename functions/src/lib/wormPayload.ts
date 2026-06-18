/**
 * Server-side WORM payload guards — mirrors client `assertWormPayload` + rules allowlists.
 * Admin SDK bypasses Firestore rules; these guards keep server writes schema-aligned.
 * PMIR: must match `firestore.rules` wormKeysOnly — do not add fields here without rules OK.
 */

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

/** Matches `isValidRealityVaultCreate()` in firestore.rules */
export const REALITY_VAULT_ALLOWED_KEYS = new Set([
  'userId',
  'ownerId',
  'action',
  'truth',
  'category',
  'sourceRef',
  'childrenImpact',
  'evidenceUrl',
  'biffUsed',
  'isLocked',
  'entryType',
  'theirVersion',
  'myReality',
  'bodySignals',
  'shieldWhat',
  'shieldFeeling',
  'shieldBoundary',
  'pinned',
  'createdAt',
]);

/** Matches `isValidChildrenLogCreate()` in firestore.rules */
export const CHILDREN_LOG_ALLOWED_KEYS = new Set([
  'userId',
  'ownerId',
  'childAlias',
  'observation',
  'truth',
  'action',
  'category',
  'childrenImpact',
  'authorRole',
  'channel',
  'visibility',
  'contentType',
  'signals',
  'bankId',
  'mediaUrl',
  'sourceRef',
  'createdAt',
]);

export function driveInboxSourceRef(driveFileId: string): string {
  return `drive:${driveFileId.trim().slice(0, 120)}`;
}

export function assertServerWormPayload(
  data: Record<string, unknown>,
  context: string,
  allowedKeys: Set<string> = REALITY_VAULT_ALLOWED_KEYS,
): void {
  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in data) {
      throw new Error(`WORM violation (${context}): field "${key}" is not allowed on create.`);
    }
  }
  for (const key of Object.keys(data)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`WORM schema drift (${context}): unexpected field "${key}".`);
    }
  }
  if (typeof data.action !== 'string' || !String(data.action).trim()) {
    throw new Error(`WORM violation (${context}): action required.`);
  }
  if (typeof data.truth !== 'string' || !String(data.truth).trim()) {
    throw new Error(`WORM violation (${context}): truth required.`);
  }
}
