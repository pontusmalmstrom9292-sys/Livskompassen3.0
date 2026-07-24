/**
 * ZenModeTrigger.tsx
 * Flytande knapp (bottom-right) som öppnar ZenModeOverlay.
 * Monteras i AppShell.
 */
import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { ZenModeOverlay } from './ZenModeOverlay';

export function ZenModeTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id="zen-mode-trigger"
        onClick={() => setOpen(true)}
        className="
          fixed bottom-20 right-4 z-[9000]
          flex items-center gap-1.5
          rounded-full border border-white/10
          bg-surface-elevated/80 backdrop-blur-sm
          px-3 py-2 text-[11px] text-text-muted
          shadow-lg hover:border-accent/30 hover:text-text
          transition-all duration-200
          min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40
        "
        title="Töm Huvudet – distraktionsfritt läge"
        aria-label="Öppna Töm Huvudet-läge"
      >
        <BrainCircuit size={14} className="text-accent/60" />
        <span className="hidden sm:inline">Töm Huvudet</span>
      </button>

      <ZenModeOverlay isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
