import * as admin from 'firebase-admin';
import { HttpsError } from 'firebase-functions/v2/https';

const COLLECTION = '_rate_limits';
const DEFAULT_WINDOW_MS = 60_000;

const memoryBuckets = new Map<string, { count: number; windowStart: number }>();

export class RateLimitExceeded extends Error {
  readonly code = 'resource-exhausted' as const;

  constructor(message = 'För många förfrågningar. Vänta en stund.') {
    super(message);
    this.name = 'RateLimitExceeded';
  }
}

function assertMemoryRateLimit(key: string, maxCalls: number, windowMs: number): void {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now - bucket.windowStart >= windowMs) {
    memoryBuckets.set(key, { count: 1, windowStart: now });
    return;
  }
  if (bucket.count >= maxCalls) {
    throw new RateLimitExceeded();
  }
  bucket.count += 1;
}

/** Per-UID sliding window — Firestore i prod, in-memory i emulator. */
export async function assertRateLimit(
  uid: string,
  action: string,
  maxCalls: number,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<void> {
  const key = `${uid}:${action}`;

  if (process.env.FUNCTIONS_EMULATOR === 'true') {
    assertMemoryRateLimit(key, maxCalls, windowMs);
    return;
  }

  const db = admin.firestore();
  const docId = key.replace(/[/:]/g, '_').slice(0, 128);
  const ref = db.collection(COLLECTION).doc(docId);

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();

      if (!snap.exists) {
        tx.set(ref, { count: 1, windowStart: now, uid, action });
        return;
      }

      const data = snap.data()!;
      const windowStart = typeof data.windowStart === 'number' ? data.windowStart : 0;
      const count = typeof data.count === 'number' ? data.count : 0;

      if (now - windowStart >= windowMs) {
        tx.set(ref, { count: 1, windowStart: now, uid, action });
        return;
      }

      if (count >= maxCalls) {
        throw new RateLimitExceeded();
      }

      tx.update(ref, { count: count + 1 });
    });
  } catch (err) {
    if (err instanceof RateLimitExceeded) {
      throw new HttpsError('resource-exhausted', err.message);
    }
    throw err;
  }
}
