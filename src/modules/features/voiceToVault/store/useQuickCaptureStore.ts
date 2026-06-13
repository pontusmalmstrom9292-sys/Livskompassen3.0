import { create } from 'zustand';

interface QuickCaptureState {
  isOpen: boolean;
  isRecording: boolean;
  transcript: string;
  open: () => void;
  close: () => void;
  setRecording: (recording: boolean) => void;
  setTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;
  reset: () => void;
}

export const useQuickCaptureStore = create<QuickCaptureState>((set) => ({
  isOpen: false,
  isRecording: false,
  transcript: '',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, isRecording: false, transcript: '' }),
  setRecording: (recording) => set({ isRecording: recording }),
  setTranscript: (text) => set({ transcript: text }),
  appendTranscript: (text) =>
    set((state) => ({
      transcript: state.transcript ? `${state.transcript} ${text}` : text,
    })),
  reset: () => set({ transcript: '', isRecording: false }),
}));
