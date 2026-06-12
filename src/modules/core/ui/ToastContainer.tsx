import React from 'react';
import { useToastStore } from '../store/toastStore';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-3 px-4 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-md">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};
