import { create } from 'zustand';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../core/firebase/firestore';
import { RiskAnalysisService } from '../oracle/services/RiskAnalysisService';
import { CompassService } from './services/CompassService';
import {
  USER_DAILY_FOCUS_COLLECTION,
  getLocalIsoDate,
  hasAnyFocusPoint,
  normalizeFocusPoints,
  parseLegacyIntention,
} from './lib/focusPoints';

interface MorningCompassState {
  threeFocusPoints: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  latestInsight: any | null;
  isLoadingInsight: boolean;
  handledProtocolDate?: string;
  yesterdayWasHighRisk: boolean;
  isLowEnergyProtocolActive: boolean;
  setLowEnergyProtocolActive: (active: boolean) => void;
  setFocusPoint: (index: number, value: string) => void;
  clearFocusPoints: (ownerId?: string) => Promise<void>;
  fetchFocusPoints: (ownerId: string) => Promise<void>;
  /** Kanonisk skrivväg — `user_daily_focus` (+ daglig `history/`). */
  saveFocus: (ownerId: string) => Promise<void>;
  /** @deprecated Använd `saveFocus`. Behålls tills migrering bekräftad. */
  saveFocusPoints: (ownerId: string) => Promise<void>;
  fetchLatestInsight: (ownerId: string) => Promise<void>;
  submitProtocolFeedback: (ownerId: string, protocol: string, action: 'accepted' | 'rejected' | 'adjusted', notes?: string) => Promise<void>;
}

export const useMorningCompassStore = create<MorningCompassState>((set, get) => ({
  threeFocusPoints: ['', '', ''],
  isLoading: false,
  isSaving: false,
  error: null,
  latestInsight: null,
  isLoadingInsight: false,
  handledProtocolDate: undefined,
  yesterdayWasHighRisk: false,
  isLowEnergyProtocolActive: false,

  setLowEnergyProtocolActive: (active) => set({ isLowEnergyProtocolActive: active }),

  fetchLatestInsight: async (ownerId: string) => {
    set({ isLoadingInsight: true, error: null });
    try {
      const insightsRef = collection(db, 'insight_summaries');
      const q = query(
        insightsRef,
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        set({ latestInsight: snap.docs[0].data() });
      } else {
        set({ latestInsight: null });
      }
      set({ isLoadingInsight: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoadingInsight: false });
    }
  },

  setFocusPoint: (index, value) =>
    set((state) => {
      const newPoints = [...state.threeFocusPoints];
      newPoints[index] = value;
      return { threeFocusPoints: newPoints };
    }),

  clearFocusPoints: async (ownerId?: string) => {
    set({ threeFocusPoints: ['', '', ''] });
    if (ownerId) {
      await get().saveFocus(ownerId);
    }
  },

  fetchFocusPoints: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
      const [snap, highRisk] = await Promise.all([
        getDoc(docRef),
        RiskAnalysisService.getYesterdayRiskStatus(ownerId),
      ]);

      set({ yesterdayWasHighRisk: highRisk });

      let points = ['', '', ''];
      let handledProtocolDate: string | undefined;

      if (snap.exists()) {
        const data = snap.data();
        points = normalizeFocusPoints(data.focusPoints);
        if (typeof data.handledProtocolDate === 'string') {
          handledProtocolDate = data.handledProtocolDate;
        }
      }

      // Legacy-reserv: läs `daily_intentions` endast om kanonisk sink är tom.
      if (!hasAnyFocusPoint(points)) {
        const intentions = await CompassService.getDailyIntentions(ownerId);
        if (intentions.length > 0 && typeof intentions[0].intention === 'string') {
          points = parseLegacyIntention(intentions[0].intention);
          if (hasAnyFocusPoint(points)) {
            set({ threeFocusPoints: points, handledProtocolDate });
            await get().saveFocus(ownerId);
            set({ isLoading: false });
            return;
          }
        }
      }

      set({
        threeFocusPoints: points,
        ...(handledProtocolDate ? { handledProtocolDate } : {}),
      });
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  saveFocus: async (ownerId: string) => {
    set({ isSaving: true, error: null });
    try {
      const { threeFocusPoints, handledProtocolDate } = get();
      const docRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
      const isoDate = getLocalIsoDate();
      const historyDocRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId, 'history', isoDate);

      await Promise.all([
        setDoc(
          docRef,
          {
            ownerId,
            userId: ownerId,
            focusPoints: threeFocusPoints,
            updatedAt: serverTimestamp(),
            ...(handledProtocolDate ? { handledProtocolDate } : {}),
          },
          { merge: true },
        ),
        setDoc(
          historyDocRef,
          {
            ownerId,
            userId: ownerId,
            focusPoints: threeFocusPoints,
            date: isoDate,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);

      set({ isSaving: false });
    } catch (err) {
      set({ error: (err as Error).message, isSaving: false });
    }
  },

  saveFocusPoints: async (ownerId: string) => {
    await get().saveFocus(ownerId);
  },

  submitProtocolFeedback: async (ownerId: string, protocol: string, action: 'accepted' | 'rejected' | 'adjusted', notes?: string) => {
    try {
      const isoDate = getLocalIsoDate();
      set({ handledProtocolDate: isoDate });
      const focusDocRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
      await setDoc(focusDocRef, { handledProtocolDate: isoDate }, { merge: true });

      // Save feedback as insight
      const insightsRef = doc(collection(db, 'user_insights'));
      let feedbackText = `Användaren gav feedback på föreslaget protokoll (${protocol}): ${action}.`;
      if (notes) {
        feedbackText += ` Anledning/Justering: ${notes}`;
      }

      await setDoc(insightsRef, {
        id: insightsRef.id,
        ownerId,
        text: feedbackText,
        category: 'ProtocolFeedback',
        createdAt: serverTimestamp()
      });

    } catch (err) {
      console.error('Failed to submit protocol feedback', err);
    }
  }
}));
