import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useStore } from '../store';
import { useEvolutionStore } from '../store/useEvolutionStore';
import {
  ADAPTATION_LAYER_FLAG,
  ADAPTATION_SEMANTIC_FLAG,
  useAdaptationStore,
} from '../store/useAdaptationStore';
import { syncAdaptationPrefsToLedger } from '../firebase/adaptationLedgerFirestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { AdaptationPrefsDoc } from '../types/adaptation';
import { prefsLedgerFingerprint } from '../../../../shared/adaptation/adaptationLedgerSync';

function normalizeAdaptationPrefs(uid: string, data: Record<string, unknown>): AdaptationPrefsDoc {
  return {
    userId: String(data.userId ?? uid),
    ownerId: String(data.ownerId ?? uid),
    coachTone:
      data.coachTone === 'minimal' || data.coachTone === 'detailed'
        ? data.coachTone
        : 'standard',
    uiDensity:
      data.uiDensity === 'paralys' || data.uiDensity === 'full'
        ? data.uiDensity
        : 'normal',
    routingDefaults:
      data.routingDefaults && typeof data.routingDefaults === 'object'
        ? (data.routingDefaults as Record<string, string>)
        : {},
    dismissedHints: Array.isArray(data.dismissedHints)
      ? data.dismissedHints.map(String).slice(0, 64)
      : [],
    inferredSignals:
      data.inferredSignals && typeof data.inferredSignals === 'object'
        ? (data.inferredSignals as Record<string, number | string | boolean>)
        : {},
    updatedAt:
      typeof data.updatedAt === 'string'
        ? data.updatedAt
        : undefined,
  };
}

/**
 * Lyssnar på adaptation_prefs/{userId} när adaptation_layer_v1 är aktiv.
 * Körs i AppShell efter evolution_hub-sync.
 */
export function useAdaptationSync(): void {
  const user = useStore((s) => s.user);
  const layerEnabled = useEvolutionStore((s) => s.hasFeature(ADAPTATION_LAYER_FLAG));
  const semanticEnabled = useEvolutionStore((s) => s.hasFeature(ADAPTATION_SEMANTIC_FLAG));
  const setLayerEnabled = useAdaptationStore((s) => s.setLayerEnabled);
  const setSemanticEnabled = useAdaptationStore((s) => s.setSemanticEnabled);
  const setSemanticSummary = useAdaptationStore((s) => s.setSemanticSummary);
  const setPrefs = useAdaptationStore((s) => s.setPrefs);
  const setLoading = useAdaptationStore((s) => s.setLoading);
  const setError = useAdaptationStore((s) => s.setError);
  const reset = useAdaptationStore((s) => s.reset);

  useEffect(() => {
    setLayerEnabled(layerEnabled);
  }, [layerEnabled, setLayerEnabled]);

  useEffect(() => {
    setSemanticEnabled(semanticEnabled);
  }, [semanticEnabled, setSemanticEnabled]);

  useEffect(() => {
    if (!user?.uid || !layerEnabled) {
      reset();
      return;
    }

    setLoading(true);
    setError(null);

    const ref = doc(db, FIRESTORE_COLLECTIONS.adaptation_prefs, user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const prev = useAdaptationStore.getState().prefs;

        if (snap.exists()) {
          const next = normalizeAdaptationPrefs(user.uid, snap.data() as Record<string, unknown>);
          setPrefs(next);

          if (prev && prefsLedgerFingerprint(prev) !== prefsLedgerFingerprint(next)) {
            void syncAdaptationPrefsToLedger(user.uid, prev, next).catch((err) => {
              console.warn('[AdaptationSync] adaptation_ledger dual-write:', err);
            });
          }
        } else {
          setPrefs(null);
        }
      },
      (error) => {
        console.error('[AdaptationSync] onSnapshot error:', error);
        setError('Kunde inte läsa adaptation_prefs');
      },
    );

    return () => unsub();
  }, [user?.uid, layerEnabled, setPrefs, setLoading, setError, reset]);

  useEffect(() => {
    if (!user?.uid || !layerEnabled || !semanticEnabled) {
      setSemanticSummary(null);
      return;
    }

    const ref = doc(db, FIRESTORE_COLLECTIONS.adaptation_semantic_profile, user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setSemanticSummary(null);
          return;
        }
        const summary = (snap.data() as { summaryText?: unknown }).summaryText;
        setSemanticSummary(typeof summary === 'string' && summary.trim() ? summary.trim() : null);
      },
      (error) => {
        console.warn('[AdaptationSync] semantic profile:', error);
        setSemanticSummary(null);
      },
    );

    return () => unsub();
  }, [user?.uid, layerEnabled, semanticEnabled, setSemanticSummary]);
}
