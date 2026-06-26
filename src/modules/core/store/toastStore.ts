import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  isGhostMode: boolean;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleGhostMode: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  isGhostMode: false,
  addToast: (toastInput) => {
    const state = get();
    // In Ghost Mode, only show error and warning toasts
    if (state.isGhostMode && (toastInput.type === 'info' || toastInput.type === 'success')) {
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toastInput, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (newToast.duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration || 3000);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  toggleGhostMode: () =>
    set((state) => ({
      isGhostMode: !state.isGhostMode,
    })),
}));

// Helper object for simple usage outside and inside components
export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'success', duration });
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'error', duration });
  },
  warning: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'warning', duration });
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'info', duration });
  },
};
