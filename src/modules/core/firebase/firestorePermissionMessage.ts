import { FirebaseError } from 'firebase/app';
import { SENSITIVE_SILO_LOGIN_MESSAGE } from '../auth/requireEmailAuth';

/** Mappar Firestore permission-denied till begripligt svenska för WORM/sensitive-silor. */
export function resolveFirestorePermissionMessage(err: unknown): string | null {
  if (err instanceof FirebaseError && err.code === 'permission-denied') {
    return SENSITIVE_SILO_LOGIN_MESSAGE;
  }
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (/missing or insufficient permissions/i.test(msg)) {
    return SENSITIVE_SILO_LOGIN_MESSAGE;
  }
  return null;
}
