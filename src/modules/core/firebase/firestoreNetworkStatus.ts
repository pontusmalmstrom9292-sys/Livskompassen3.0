import { waitForPendingWrites } from 'firebase/firestore';
import { db } from './firestore';

export type FirestoreSyncPhase = 'idle' | 'offline' | 'syncing';

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/** True when the SDK still has local writes waiting for the server. */
export async function hasPendingFirestoreWrites(): Promise<boolean> {
  if (isOffline()) return false;
  let pending = true;
  await Promise.race([
    waitForPendingWrites(db).then(() => {
      pending = false;
    }),
    new Promise<void>((resolve) => {
      setTimeout(resolve, 120);
    }),
  ]);
  return pending;
}

export function subscribeFirestoreSyncPhase(onPhase: (phase: FirestoreSyncPhase) => void): () => void {
  let cancelled = false;

  const refresh = async () => {
    if (cancelled) return;
    if (isOffline()) {
      onPhase('offline');
      return;
    }
    const pending = await hasPendingFirestoreWrites();
    if (cancelled) return;
    onPhase(pending ? 'syncing' : 'idle');
  };

  const onOnline = () => void refresh();
  const onOffline = () => onPhase('offline');

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  const pollId = setInterval(() => void refresh(), 2500);
  void refresh();

  return () => {
    cancelled = true;
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
    clearInterval(pollId);
  };
}
