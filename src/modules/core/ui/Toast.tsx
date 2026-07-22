import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type Toast as ToastType } from '../store/toastStore';

interface ToastProps {
  toast: ToastType;
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-danger" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  info: <Info className="w-5 h-5 text-accent-secondary" />,
};

const bgBorderMap = {
  success: 'border-success/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]',
  error: 'border-danger/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  warning: 'border-warning/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  info: 'border-accent/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]',
};

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div
      className={`
        flex items-center gap-3 p-4 min-w-[300px] max-w-md w-full
        bg-surface/80 backdrop-blur-md rounded-xl border
        ${bgBorderMap[toast.type]}
        transform transition-all duration-300 ease-out
        animate-in fade-in slide-in-from-top-4
      `}
      role="alert"
    >
      <div className="flex-shrink-0">{iconMap[toast.type]}</div>
      
      <p className="flex-1 text-sm font-medium text-text">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="inline-flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-md p-1 text-text-muted transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        aria-label="Stäng"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
};
