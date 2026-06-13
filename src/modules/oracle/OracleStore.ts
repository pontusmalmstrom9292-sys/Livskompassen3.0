import { create } from 'zustand';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';

export interface OracleDataPoint {
  date: string;
  stressLevel: number;
  capacity: number;
  label?: string;
}

export interface OracleState {
  dataPoints: OracleDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchOracleData: (ownerId: string) => Promise<void>;
  mockLoad: () => void;
}

export const useOracleStore = create<OracleState>((set) => ({
  dataPoints: [],
  isLoading: false,
  error: null,

  fetchOracleData: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'insight_summaries'),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'asc')
      );
      
      const snap = await getDocs(q);
      
      const dataPoints: OracleDataPoint[] = snap.docs.map(doc => {
        const data = doc.data();
        
        let dateObj = new Date();
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          dateObj = data.createdAt.toDate();
        } else if (data.createdAt) {
          dateObj = new Date(data.createdAt);
        }
        
        const dateStr = dateObj.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
        
        let stressLevel = 50; 
        let capacity = 50;
        
        if (data.detectedPatterns && Array.isArray(data.detectedPatterns) && data.detectedPatterns.length > 0) {
           const firstPattern = data.detectedPatterns[0];
           if (typeof firstPattern.confidence === 'number') {
             stressLevel = Math.round(firstPattern.confidence * 100);
             capacity = Math.max(0, 100 - stressLevel + Math.round(Math.random() * 20)); 
           }
        }
        
        const labelText = data.weeklySummary || (data.detectedPatterns && data.detectedPatterns[0]?.pattern) || '';
        const label = labelText.length > 40 ? labelText.substring(0, 40) + '...' : labelText;

        return {
          date: dateStr,
          stressLevel,
          capacity,
          label
        };
      });

      set({
        dataPoints,
        isLoading: false
      });
    } catch (err) {
      console.error('Error fetching oracle data:', err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  mockLoad: () => {
    const mockData: OracleDataPoint[] = [
      { date: '1 Jun', stressLevel: 80, capacity: 40, label: 'Hög stress, lågt fokus' },
      { date: '2 Jun', stressLevel: 75, capacity: 45 },
      { date: '3 Jun', stressLevel: 60, capacity: 50 },
      { date: '4 Jun', stressLevel: 55, capacity: 60 },
      { date: '5 Jun', stressLevel: 40, capacity: 70, label: 'Bra återhämtning' },
      { date: '6 Jun', stressLevel: 35, capacity: 80 },
      { date: '7 Jun', stressLevel: 45, capacity: 75 },
    ];
    set({ dataPoints: mockData, isLoading: false, error: null });
  }
}));
