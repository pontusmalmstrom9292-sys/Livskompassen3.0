import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useStore } from '../store';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { FIRESTORE_COLLECTIONS, type EvolutionHubDoc } from '../types/firestore';

/**
 * Lyssnar på evolution_hub/{userId} och uppdaterar det globala evolution-storet.
 * Denna körs i AppShell när användaren är inloggad.
 */
export function useEvolutionSync(): void {
  const user = useStore((s) => s.user);
  const setDoc = useEvolutionStore((s) => s.setDoc);
  const setError = useEvolutionStore((s) => s.setError);

  useEffect(() => {
    if (!user?.uid) {
      setDoc(null);
      return;
    }

    const ref = doc(db, FIRESTORE_COLLECTIONS.evolution_hub, user.uid);
    
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setDoc(snap.data() as EvolutionHubDoc);
        } else {
          // Inget hub-dokument än — användaren har default nivå
          setDoc(null);
        }
      },
      (error) => {
        console.error('[EvolutionSync] onSnapshot error:', error);
        setError('Kunde inte läsa evolution_hub');
      }
    );

    return () => unsub();
  }, [user?.uid, setDoc, setError]);
}
