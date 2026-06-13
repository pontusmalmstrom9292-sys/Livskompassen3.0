import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../modules/core/firebase/firestore';
import type { OracleDataPoint } from '../modules/oracle/OracleStore';

export class OracleService {
  static async getHybridOracleData(userId: string): Promise<OracleDataPoint[]> {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // YYYY-MM-DD
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    // Fetch daily intentions
    const intentionsRef = collection(db, 'daily_intentions');
    const qIntentions = query(
      intentionsRef,
      where('ownerId', '==', userId),
      where('date', '>=', dateStr),
      orderBy('date', 'asc')
    );

    // Fetch insight summaries
    const insightsRef = collection(db, 'insight_summaries');
    const qInsights = query(
      insightsRef,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'asc') // Could filter by date but createdAt is timestamp
    );

    const [intentionsSnap, insightsSnap] = await Promise.all([
      getDocs(qIntentions),
      getDocs(qInsights)
    ]);
    
    // Map intentions by date
    const intentionsMap = new Map<string, any>();
    intentionsSnap.docs.forEach(doc => {
      const data = doc.data();
      intentionsMap.set(data.date, data);
    });

    // Map insights by date (YYYY-MM-DD)
    const insightsMap = new Map<string, any>();
    insightsSnap.docs.forEach(doc => {
      const data = doc.data();
      let dateObj = new Date();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        dateObj = data.createdAt.toDate();
      } else if (data.createdAt) {
        dateObj = new Date(data.createdAt);
      }
      const insightDateStr = dateObj.toISOString().split('T')[0];
      insightsMap.set(insightDateStr, data);
    });

    // Fill the last 7 days
    const results: OracleDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const displayDateStr = targetDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });

      const intentionData = intentionsMap.get(targetDateStr);
      const insightData = insightsMap.get(targetDateStr);
      
      let label = 'Ingen data';
      
      if (intentionData && intentionData.intention) {
        try {
          const parsed = JSON.parse(intentionData.intention);
          if (Array.isArray(parsed)) {
            const validIntentions = parsed.filter(p => p && typeof p === 'string' && p.trim() !== '');
            if (validIntentions.length > 0) {
              label = validIntentions.join(' | ');
            } else {
              label = 'Tom kompass';
            }
          } else {
             label = String(intentionData.intention);
          }
        } catch {
          label = intentionData.intention;
        }
      }

      const hasIntention = !!intentionData;
      let stressLevel = hasIntention ? 40 + Math.random() * 20 : 70; 
      let capacity = hasIntention ? 70 + Math.random() * 20 : 30;
      let actionableAdvice = undefined;
      let weeklySummary = undefined;
      let detectedPatterns = undefined;

      // Override with insight data if available
      if (insightData) {
        if (insightData.detectedPatterns && Array.isArray(insightData.detectedPatterns) && insightData.detectedPatterns.length > 0) {
           const firstPattern = insightData.detectedPatterns[0];
           if (typeof firstPattern.confidence === 'number') {
             stressLevel = Math.round(firstPattern.confidence * 100);
             capacity = Math.max(0, 100 - stressLevel + Math.round(Math.random() * 20)); 
           }
           detectedPatterns = insightData.detectedPatterns;
        }
        if (insightData.weeklySummary) {
          weeklySummary = insightData.weeklySummary;
        }
        if (insightData.actionableAdvice) {
          actionableAdvice = insightData.actionableAdvice;
        }
        
        // Enhance label with insight if it was empty
        if (!hasIntention && (weeklySummary || (detectedPatterns && detectedPatterns.length > 0))) {
            const labelText = weeklySummary || detectedPatterns[0]?.pattern || '';
            label = labelText.length > 40 ? labelText.substring(0, 40) + '...' : labelText;
        }
      }

      results.push({
        date: displayDateStr,
        isoDate: targetDateStr,
        stressLevel: Math.round(stressLevel),
        capacity: Math.round(capacity),
        label: label.length > 50 ? label.substring(0, 50) + '...' : label,
        actionableAdvice,
        weeklySummary,
        detectedPatterns
      });
    }

    return results;
  }
}
