import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DiaryState {
  diaryDraft: string;
  setDiaryDraft: (text: string) => void;
  clearDiaryDraft: () => void;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set) => ({
      diaryDraft: '',
      setDiaryDraft: (text: string) => set({ diaryDraft: text }),
      clearDiaryDraft: () => set({ diaryDraft: '' }),
    }),
    {
      name: 'livskompassen-diary-draft',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
