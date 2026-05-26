import { useEffect, useState } from 'react';
import { Loader2, WifiOff } from 'lucide-react';
import {
  subscribeFirestoreSyncPhase,
  type FirestoreSyncPhase,
} from '../firebase/firestoreNetworkStatus';

/** Diskret offline / synkar-indikator — påverkar inte locked UX-flöden. */
export function FirestoreNetworkChip() {
  const [phase, setPhase] = useState<FirestoreSyncPhase>('idle');

  useEffect(() => subscribeFirestoreSyncPhase(setPhase), []);

  if (phase === 'idle') return null;

  const isOffline = phase === 'offline';

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[225] max-w-[min(100vw-2rem,24rem)] -translate-x-1/2 rounded-full border border-border bg-bg/95 px-3 py-1.5 text-center text-[11px] leading-snug text-text-muted shadow-lg backdrop-blur-sm"
      style={{ top: 'calc(4.25rem + env(safe-area-inset-top, 0px))' }}
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {isOffline ? (
          <WifiOff className="h-3 w-3 shrink-0 text-accent/90" aria-hidden />
        ) : (
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-accent/90" aria-hidden />
        )}
        {isOffline
          ? 'Offline — dagbok, planering och ekonomi sparas lokalt; Valv kräver nät'
          : 'Synkar ändringar…'}
      </span>
    </div>
  );
}
