import { create } from 'zustand';

export interface MorningIntention {
  id: string;
  text: string;
  completed: boolean;
}

export interface MorningState {
  dailyIntent: string;
  intentions: MorningIntention[];
  isLoading: boolean;
  error: string | null;
  setDailyIntent: (intent: string) => void;
  addIntention: (text: string) => void;
  toggleIntention: (id: string) => void;
  removeIntention: (id: string) => void;
  fetchMorningData: (ownerId: string) => Promise<void>;
}

export const useMorningStore = create<MorningState>((set) => ({
  dailyIntent: '',
  intentions: [],
  isLoading: false,
  error: null,

  setDailyIntent: (intent) => set({ dailyIntent: intent }),

  addIntention: (text) => set((state) => ({
    intentions: [...state.intentions, { id: crypto.randomUUID(), text, completed: false }]
  })),

  toggleIntention: (id) => set((state) => ({
    intentions: state.intentions.map(i => i.id === id ? { ...i, completed: !i.completed } : i)
  })),

  removeIntention: (id) => set((state) => ({
    intentions: state.intentions.filter(i => i.id !== id)
  })),

  fetchMorningData: async (_ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Future integration with Firestore, for now we simulate loading local data
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set({ 
        isLoading: false,
        intentions: [
          { id: crypto.randomUUID(), text: 'Skriv i journalen', completed: false },
          { id: crypto.randomUUID(), text: 'Drick 2 glas vatten', completed: true },
          { id: crypto.randomUUID(), text: '5 minuter meditation', completed: false }
        ],
        dailyIntent: 'Håll fokus på en sak i taget och andas'
      });
    } catch (err) {
      console.error('Error fetching morning data:', err);
      set({ error: (err as Error).message, isLoading: false });
    }
  }
}));
