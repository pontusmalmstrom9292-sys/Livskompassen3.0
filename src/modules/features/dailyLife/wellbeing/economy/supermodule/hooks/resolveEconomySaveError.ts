import { FirebaseError } from 'firebase/app';
import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';

/** Shared user-facing error copy for Ekonomi write hooks. */
export function resolveEconomySaveError(err: unknown, fallback: string): string {
  if (err instanceof OfflineWriteBlockedError) {
    return err.message;
  }
  if (err instanceof FirebaseError && err.code === 'permission-denied') {
    return 'Behörighet saknas — logga in igen.';
  }
  return fallback;
}
