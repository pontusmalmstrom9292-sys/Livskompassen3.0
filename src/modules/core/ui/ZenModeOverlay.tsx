/**
 * ZenModeOverlay.tsx
 * Distraktionsfritt "Töm Huvudet"-läge (Fas 3).
 * - Tar hela skärmen, döljer all nav.
 * - Enbart textarea + Spara & Stäng.
 * - Zero Footprint: sparar via submitInkastLite utan att exponera silo-detaljer.
 * - Rör INTE Firestore-regler, WORM eller säkerhetssilor.
 * - Escape + focus trap via DS Modal.
 */
import { useCallback, useRef, useState, type RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain } from 'lucide-react';
import { submitInkastLite } from '@/modules/inkast/api/inkastService';
import { useStore } from '@/core/store';
import { Button, Modal, TextArea } from '@/design-system';
import {
  immersiveModalOverlayClass,
  immersiveModalPanelClass,
} from './zenModeOverlayClasses';

type ZenModeOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MIN_LENGTH = 3;

export function ZenModeOverlay({ isOpen, onClose }: ZenModeOverlayProps) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useStore((s) => s.user?.uid);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialFocusRef = textareaRef as RefObject<HTMLElement>;

  const handleSaveAndClose = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < MIN_LENGTH || !userId) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await submitInkastLite({ text: trimmed, fileName: 'tom-huvudet.txt', sourceModule: 'zen_mode' });
      setSaved(true);
      setText('');
      // Kort bekräftelse, sedan stäng
      window.setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  }, [text, userId, onClose]);

  const handleDiscard = useCallback(() => {
    setText('');
    setError(null);
    setSaved(false);
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={isOpen}
      onClose={handleDiscard}
      hideHeader
      ariaLabel="Töm Huvudet – distraktionsfritt läge"
      className={immersiveModalOverlayClass}
      panelClassName={immersiveModalPanelClass}
      initialFocusRef={initialFocusRef}
    >
      <div className="flex h-full min-h-[100dvh] flex-col bg-bg">
        {/* Header – minimal */}
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <div className="flex items-center gap-2 text-text-muted">
            <Brain size={16} className="text-accent/50" aria-hidden />
            <span className="text-xs uppercase tracking-widest text-text-muted">Töm Huvudet</span>
          </div>
          <button
            type="button"
            onClick={handleDiscard}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border/20 bg-white/[0.03] text-text-muted backdrop-blur-sm transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
            aria-label="Stäng utan att spara"
            title="Stäng utan att spara"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        {/* Hjärtat av Zen Mode */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
          <p className="mb-4 text-xs tracking-wide text-text-muted/60">
            Skriv allt som är i vägen. Inget kategoriseras, inget visas för andra.
          </p>
          <TextArea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!saving && text.trim().length >= MIN_LENGTH) {
                  void handleSaveAndClose();
                }
              }
            }}
            placeholder="Skriv fritt…"
            className="
                w-full max-w-lg flex-1
                min-h-[280px] resize-none rounded-2xl
                border border-white/10 bg-white/[0.04]
                px-5 py-4 text-base text-text leading-relaxed
                shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--accent)_8%,transparent)]
                backdrop-blur-md
                placeholder:text-text-muted/30
                focus:border-accent/25 focus:outline-none
                transition-colors
              "
            disabled={saving}
          />

          {/* Teckenräknare */}
          <p className="mt-1.5 w-full max-w-lg self-end pr-1 text-right text-[11px] text-text-muted/40">
            {text.length} tecken · ⌘/Ctrl+Enter sparar
          </p>

          {/* Bekräftelse / Fel */}
          <AnimatePresence>
            {saved && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-success/80"
                role="status"
              >
                ✓ Sparat och stänger…
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-accent-light"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Åtgärder */}
          <div className="mt-5 flex w-full max-w-lg justify-end gap-3">
            <Button
              type="button"
              onClick={handleDiscard}
              variant="ghost"
              className="min-h-[var(--ds-touch-target,2.75rem)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              disabled={saving}
            >
              Kasta & Stäng
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveAndClose()}
              variant="accent"
              className="min-h-[var(--ds-touch-target,2.75rem)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              disabled={saving || text.trim().length < MIN_LENGTH}
            >
              {saving ? 'Sparar…' : 'Spara & Stäng'}
            </Button>
          </div>

          {/* Zero Footprint-notering */}
          <p className="mt-4 w-full max-w-lg text-center text-[10px] text-text-muted/30">
            Zero Footprint · Ingenting sparas lokalt · Krypteras i transit · Esc stänger
          </p>
        </div>
      </div>
    </Modal>
  );
}
