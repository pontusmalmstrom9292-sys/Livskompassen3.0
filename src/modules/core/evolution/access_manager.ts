import { useState, useEffect } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useStore } from '../store';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

/**
 * Firestore document shape for access_tokens_economy/{uid}.
 * Written exclusively by Admin SDK (orkester_wiring).
 */
export interface AccessTokenEconomyDoc {
  userId: string;
  ownerId: string;
  granted: boolean;
  reason: string;
  scoreAtGrant: number;
  updatedAt: Timestamp | string;
  grantedAt?: Timestamp | string;
}

export interface EconomyAccessState {
  isEconomyAdvancedUnlocked: boolean;
  updatedAt: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Realtime listener for the economy access token document.
 * Returns whether advanced economy features are unlocked and last update time.
 */
export function useEconomyAccess(): EconomyAccessState {
  const user = useStore((s) => s.user);
  const [state, setState] = useState<EconomyAccessState>({
    isEconomyAdvancedUnlocked: false,
    updatedAt: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!user?.uid) {
      setState({ isEconomyAdvancedUnlocked: false, updatedAt: null, isLoading: false, error: null });
      return;
    }

    const ref = doc(db, FIRESTORE_COLLECTIONS.access_tokens_economy, user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AccessTokenEconomyDoc;
          const updatedAt = data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : typeof data.updatedAt === 'string'
              ? data.updatedAt
              : null;

          setState({
            isEconomyAdvancedUnlocked: data.granted === true,
            updatedAt,
            isLoading: false,
            error: null,
          });
        } else {
          setState({ isEconomyAdvancedUnlocked: false, updatedAt: null, isLoading: false, error: null });
        }
      },
      (error) => {
        console.error('[useEconomyAccess] onSnapshot error:', error);
        setState((prev) => ({ ...prev, isLoading: false, error: 'Kunde inte läsa access token' }));
      },
    );

    return () => unsub();
  }, [user?.uid]);

  return state;
}
