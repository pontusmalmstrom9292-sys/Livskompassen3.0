import { create } from 'zustand';
import { OracleService } from '../../services/OracleService';

export interface Pattern {
  pattern: string;
  confidence: number;
}

export interface OracleDataPoint {
  date: string;
  isoDate: string;
  stressLevel: number;
  capacity: number;
  label?: string;
  actionableAdvice?: string;
  weeklySummary?: string;
  detectedPatterns?: Pattern[];
  mabraSessionsCount?: number;
  mabraSessionTypes?: string[];
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
      const dataPoints = await OracleService.getHybridOracleData(ownerId);
      
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
      { 
        date: '1 Jun', 
        isoDate: '2026-06-01',
        stressLevel: 80, 
        capacity: 40, 
        label: 'Hög stress, lågt fokus',
        actionableAdvice: 'Överväg 4-7-8 andning och att delegera uppgifter.',
        weeklySummary: 'En tuff vecka med mycket hög kognitiv belastning.',
        detectedPatterns: [{ pattern: 'Högt tempo, dålig sömn', confidence: 0.8 }],
        mabraSessionsCount: 0,
        mabraSessionTypes: []
      },
      { date: '2 Jun', isoDate: '2026-06-02', stressLevel: 75, capacity: 45, mabraSessionsCount: 1, mabraSessionTypes: ['4-7-8 Andning'] },
      { date: '3 Jun', isoDate: '2026-06-03', stressLevel: 60, capacity: 50, mabraSessionsCount: 0, mabraSessionTypes: [] },
      { date: '4 Jun', isoDate: '2026-06-04', stressLevel: 55, capacity: 60, mabraSessionsCount: 2, mabraSessionTypes: ['Vagusnervåterställning', 'Akutlandning'] },
      { 
        date: '5 Jun', 
        isoDate: '2026-06-05',
        stressLevel: 40, 
        capacity: 70, 
        label: 'Bra återhämtning',
        actionableAdvice: 'Bibehåll nuvarande rutiner, de fungerar bra.',
        weeklySummary: 'Återhämtningen går framåt.',
        detectedPatterns: [{ pattern: 'Regelbunden sömn ger resultat', confidence: 0.9 }],
        mabraSessionsCount: 1,
        mabraSessionTypes: ['Reframing']
      },
      { date: '6 Jun', isoDate: '2026-06-06', stressLevel: 35, capacity: 80, mabraSessionsCount: 0, mabraSessionTypes: [] },
      { date: '7 Jun', isoDate: '2026-06-07', stressLevel: 45, capacity: 75, mabraSessionsCount: 1, mabraSessionTypes: ['4-7-8 Andning'] },
    ];
    set({ dataPoints: mockData, isLoading: false, error: null });
  }
}));
