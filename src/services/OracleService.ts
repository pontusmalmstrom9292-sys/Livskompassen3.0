import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../modules/core/firebase/firestore';
import { OracleDataPoint } from '../modules/oracle/OracleStore';

export class OracleService {
  static async getWeeklyIntentions(userId: string): Promise<OracleDataPoint[]> {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // We filter by date string since we saved date as YYYY-MM-DD
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const ref = collection(db, 'daily_intentions');
    const q = query(
      ref,
      where('ownerId', '==', userId),
      where('date', '>=', dateStr),
      orderBy('date', 'asc')
    );

    const snap = await getDocs(q);
    
    // Create a map of fetched days
    const dataMap = new Map<string, any>();
    snap.docs.forEach(doc => {
      const data = doc.data();
      dataMap.set(data.date, data);
    });

    // Fill the last 7 days, including missing days
    const results: OracleDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const displayDateStr = targetDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });

      const docData = dataMap.get(targetDateStr);
      let label = 'Ingen data';
      
      if (docData && docData.intention) {
        try {
          const parsed = JSON.parse(docData.intention);
          if (Array.isArray(parsed)) {
            // Join valid intentions
            const validIntentions = parsed.filter(p => p && typeof p === 'string' && p.trim() !== '');
            if (validIntentions.length > 0) {
              label = validIntentions.join(' | ');
            } else {
              label = 'Tom kompass';
            }
          } else {
             label = String(docData.intention);
          }
        } catch {
          // If not valid JSON, use as raw string
          label = docData.intention;
        }
      }

      // Simulate stress and capacity since we only fetch intentions right now.
      // If there is data, we assume capacity is good and stress is low.
      const hasData = !!docData;
      const stressLevel = hasData ? 40 + Math.random() * 20 : 70; 
      const capacity = hasData ? 70 + Math.random() * 20 : 30;

      results.push({
        date: displayDateStr,
        stressLevel: Math.round(stressLevel),
        capacity: Math.round(capacity),
        label: label.length > 50 ? label.substring(0, 50) + '...' : label
      });
    }

    return results;
  }
}
