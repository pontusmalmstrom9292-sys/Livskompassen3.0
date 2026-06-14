import { create } from 'zustand';

export interface EmotionalMemoryState {
  memoryContent: string;
  updateContent: (content: string) => void;
  resetMemory: () => void;
}

export const useEmotionalMemoryStore = create<EmotionalMemoryState>((set) => ({
  memoryContent: '',
  updateContent: (content: string) => set({ memoryContent: content }),
  resetMemory: () => set({ memoryContent: '' }),
}));
