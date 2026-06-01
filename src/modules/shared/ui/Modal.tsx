import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export type ModalProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
};

export function Modal({ children, className, title, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <section
        className={clsx('glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <header className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-accent">{title}</h2>
            {onClose ? (
              <button type="button" className="btn-pill--ghost text-xs" onClick={onClose}>
                Stäng
              </button>
            ) : null}
          </header>
        ) : null}
        {children}
      </section>
    </div>
  );
}
