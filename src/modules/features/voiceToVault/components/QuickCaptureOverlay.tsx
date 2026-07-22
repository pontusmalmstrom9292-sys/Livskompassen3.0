import { X } from 'lucide-react';
import { Sheet } from '@/design-system/components/Sheet';
import { useQuickCaptureStore } from '../store/useQuickCaptureStore';
import { QuickCapturePanel } from './QuickCapturePanel';

/**
 * Voice-to-Vault capture — DS Sheet (Escape, focus trap, portal).
 * Refine-only: same panel content, no flow change.
 */
export function QuickCaptureOverlay() {
  const { isOpen, close } = useQuickCaptureStore();

  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="Voice-to-Vault"
      ariaLabel="Voice-to-Vault"
      placement="center"
      className="z-[100]"
      panelClassName="relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/30 bg-surface-2 p-6 shadow-2xl"
      headerAction={
        <button
          type="button"
          onClick={close}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 motion-reduce:transition-none"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      }
    >
      <QuickCapturePanel onDone={close} />
    </Sheet>
  );
}
