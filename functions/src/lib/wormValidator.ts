/**
 * WORM Schema Validator — Runtime Guard
 * Validerar VARJE WORM-write mot firestore.rules allowlists
 */

export const WORM_SCHEMA = {
  reality_vault: {
    required: ['userId', 'ownerId', 'action', 'truth', 'createdAt'],
    allowed: new Set([
      'userId', 'ownerId', 'action', 'truth', 'category', 'sourceRef',
      'childrenImpact', 'evidenceUrl', 'biffUsed', 'isLocked', 'entryType',
      'theirVersion', 'myReality', 'bodySignals', 'shieldWhat', 'shieldFeeling',
      'shieldBoundary', 'pinned', 'journalEntryId', 'sourceMood', 'weaverTags', 'createdAt',
    ]),
  },
  journal: {
    required: ['userId', 'ownerId', 'mood', 'text', 'createdAt'],
    allowed: new Set([
      'userId', 'ownerId', 'mood', 'text', 'category', 'tags',
      'attachment', 'attachments', 'createdAt',
    ]),
  },
  children_logs: {
    required: ['userId', 'ownerId', 'childAlias', 'action', 'createdAt'],
    allowed: new Set([
      'userId', 'ownerId', 'childAlias', 'observation', 'truth', 'action', 'category',
      'childrenImpact', 'authorRole', 'channel', 'visibility', 'contentType', 'signals',
      'bankId', 'mediaUrl', 'mediaCaption', 'sourceRef', 'createdAt',
    ]),
  },
} as const;

export type WormCollection = keyof typeof WORM_SCHEMA;

export class WormValidationError extends Error {
  constructor(
    public collection: string,
    public reason: string,
    public data?: Record<string, unknown>,
  ) {
    super(`WORM Validation [${collection}]: ${reason}`);
    this.name = 'WormValidationError';
  }
}

export function validateWormPayload(
  collection: WormCollection,
  data: Record<string, unknown>,
  context: string,
): void {
  const schema = WORM_SCHEMA[collection];
  if (!schema) throw new WormValidationError(collection, `Unknown collection (${context})`);

  for (const forbidden of ['updatedAt', 'deletedAt', 'modifiedAt']) {
    if (forbidden in data) {
      throw new WormValidationError(collection, `Forbidden field "${forbidden}"`);
    }
  }

  for (const required of schema.required) {
    if (!(required in data)) {
      throw new WormValidationError(collection, `Missing required: ${required}`);
    }
  }

  for (const key of Object.keys(data)) {
    if (!schema.allowed.has(key)) {
      throw new WormValidationError(collection, `Unexpected field "${key}"`);
    }
  }
}

export function assertWormPayload(
  collection: WormCollection,
  data: Record<string, unknown>,
  context: string,
): asserts data is Record<string, unknown> {
  validateWormPayload(collection, data, context);
}
