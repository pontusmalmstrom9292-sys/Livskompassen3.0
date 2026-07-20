import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { trapTabKey } from '@/design-system/utils/trapTabKey';
import { useQuickCaptureStore } from '../store/useQuickCaptureStore';
import { QuickCapturePanel } from './QuickCapturePanel';

export function QuickCaptureOverlay() {
  const { isOpen, close } = useQuickCaptureStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      trapTabKey(e, panelRef.current);
    };

    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Voice-to-Vault"
            tabIndex={-1}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/30 bg-surface-2 p-6 shadow-2xl outline-none"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display-serif text-xl text-accent">Voice-to-Vault</h2>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
                aria-label="Stäng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <QuickCapturePanel onDone={close} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
