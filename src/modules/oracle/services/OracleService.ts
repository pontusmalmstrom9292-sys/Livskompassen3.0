import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import type { OracleDataPoint } from '../OracleStore';
import {
  USER_DAILY_FOCUS_COLLECTION,
  getLocalIsoDate,
  hasAnyFocusPoint,
  normalizeFocusPoints,
  parseLegacyIntention,
} from '../../morning/lib/focusPoints';

type FocusByDate = Map<string, string[]>;

function focusLabelFromPoints(points: string[]): string {
  const valid = points.filter((p) => p && typeof p === 'string' && p.trim() !== '');
  if (valid.length === 0) return 'Tom kompass';
  return valid.join(' | ');
}

async function loadCanonicalFocus(userId: string, sevenDaysAgoIso: string): Promise<FocusByDate> {
  const map: FocusByDate = new Map();
  const todayIso = getLocalIsoDate();

  const historyRef = collection(db, USER_DAILY_FOCUS_COLLECTION, userId, 'history');
  const historyQuery = query(
    historyRef,
    where('date', '>=', sevenDaysAgoIso),
    orderBy('date', 'asc'),
  );
  const historySnap = await getDocs(historyQuery);
  historySnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const date =
      typeof data.date === 'string' && data.date.trim() ? data.date.trim() : docSnap.id;
    map.set(date, normalizeFocusPoints(data.focusPoints));
  });

  const rootSnap = await getDoc(doc(db, USER_DAILY_FOCUS_COLLECTION, userId));
  if (rootSnap.exists()) {
    const points = normalizeFocusPoints(rootSnap.data().focusPoints);
    if (hasAnyFocusPoint(points)) {
      map.set(todayIso, points);
    }
  }

  return map;
}

async function loadLegacyFocusFallback(
  userId: string,
  sevenDaysAgoIso: string,
  kanonMap: FocusByDate,
): Promise<FocusByDate> {
  const merged = new Map(kanonMap);
  const intentionsRef = collection(db, 'daily_intentions');
  const legacyQuery = query(
    intentionsRef,
    where('ownerId', '==', userId),
    where('date', '>=', sevenDaysAgoIso),
    orderBy('date', 'asc'),
  );
  const legacySnap = await getDocs(legacyQuery);
  legacySnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const date = typeof data.date === 'string' ? data.date : '';
    if (!date || merged.has(date)) return;
    if (typeof data.intention !== 'string') return;
    const points = parseLegacyIntention(data.intention);
    if (hasAnyFocusPoint(points)) {
      merged.set(date, points);
    }
  });
  return merged;
}

export class OracleService {
  static async getHybridOracleData(userId: string): Promise<OracleDataPoint[]> {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgoIso = sevenDaysAgo.toISOString().split('T')[0];

    const kanonFocus = await loadCanonicalFocus(userId, sevenDaysAgoIso);
    const focusMap = await loadLegacyFocusFallback(userId, sevenDaysAgoIso, kanonFocus);

    const insightsRef = collection(db, 'insight_summaries');
    const qInsights = query(
      insightsRef,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'asc'),
    );

    const mabraRef = collection(db, 'mabra_sessions');
    const qMabra = query(
      mabraRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'asc'),
    );

    const [insightsSnap, mabraSnap] = await Promise.all([getDocs(qInsights), getDocs(qMabra)]);

    const insightsMap = new Map<string, Record<string, unknown>>();
    insightsSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      let dateObj = new Date();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        dateObj = data.createdAt.toDate();
      } else if (data.createdAt) {
        dateObj = new Date(data.createdAt as string);
      }
      const insightDateStr = dateObj.toISOString().split('T')[0];
      insightsMap.set(insightDateStr, data);
    });

    const mabraMap = new Map<string, Record<string, unknown>[]>();
    mabraSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      let dateObj = new Date();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        dateObj = data.createdAt.toDate();
      } else if (data.createdAt) {
        dateObj = new Date(data.createdAt as string);
      }
      if (dateObj >= sevenDaysAgo) {
        const mabraDateStr = dateObj.toISOString().split('T')[0];
        const existing = mabraMap.get(mabraDateStr) || [];
        existing.push(data);
        mabraMap.set(mabraDateStr, existing);
      }
    });

    const results: OracleDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const displayDateStr = targetDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });

      const focusPoints = focusMap.get(targetDateStr);
      const hasFocus = focusPoints !== undefined && hasAnyFocusPoint(focusPoints);
      const insightData = insightsMap.get(targetDateStr);
      const mabraData = mabraMap.get(targetDateStr) || [];

      let label = 'Ingen data';
      if (hasFocus && focusPoints) {
        label = focusLabelFromPoints(focusPoints);
      }

      let stressLevel = hasFocus ? 40 + Math.random() * 20 : 70;
      let capacity = hasFocus ? 70 + Math.random() * 20 : 30;
      let actionableAdvice: string | undefined;
      let weeklySummary: string | undefined;
      let detectedPatterns: OracleDataPoint['detectedPatterns'];

      if (insightData) {
        if (
          insightData.detectedPatterns &&
          Array.isArray(insightData.detectedPatterns) &&
          insightData.detectedPatterns.length > 0
        ) {
          const firstPattern = insightData.detectedPatterns[0] as { confidence?: number; pattern?: string };
          if (typeof firstPattern.confidence === 'number') {
            stressLevel = Math.round(firstPattern.confidence * 100);
            capacity = Math.max(0, 100 - stressLevel + Math.round(Math.random() * 20));
          }
          detectedPatterns = insightData.detectedPatterns as OracleDataPoint['detectedPatterns'];
        }
        if (typeof insightData.weeklySummary === 'string') {
          weeklySummary = insightData.weeklySummary;
        }
        if (typeof insightData.actionableAdvice === 'string') {
          actionableAdvice = insightData.actionableAdvice;
        }

        if (!hasFocus && (weeklySummary || (detectedPatterns && detectedPatterns.length > 0))) {
          const labelText = weeklySummary || detectedPatterns?.[0]?.pattern || '';
          label = labelText.length > 40 ? `${labelText.substring(0, 40)}...` : labelText;
        }
      }

      const mabraSessionsCount = mabraData.length;
      const mabraSessionTypes = mabraData.map((s) => String(s.exerciseType || 'MåBra-Övning'));

      results.push({
        date: displayDateStr,
        isoDate: targetDateStr,
        stressLevel: Math.round(stressLevel),
        capacity: Math.round(capacity),
        label: label.length > 50 ? `${label.substring(0, 50)}...` : label,
        actionableAdvice,
        weeklySummary,
        detectedPatterns,
        mabraSessionsCount,
        mabraSessionTypes,
      });
    }

    return results;
  }
}
