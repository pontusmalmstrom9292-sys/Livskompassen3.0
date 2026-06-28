/**
 * ZenModeOverlay.tsx
 * Distraktionsfritt "Töm Huvudet"-läge (Fas 3).
 * - Tar hela skärmen, döljer all nav.
 * - Enbart textarea + Spara & Stäng.
 * - Zero Footprint: sparar via submitInkastLite utan att exponera silo-detaljer.
 * - Rör INTE Firestore-regler, WORM eller säkerhetssilor.
 */
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain } from 'lucide-react';
import { submitInkastLite } from '@/modules/inkast/api/inkastService';
import { useStore } from '@/core/store';

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[10000] flex flex-col bg-[#0c0d10]"
          role="dialog"
          aria-modal="true"
          aria-label="Töm Huvudet – distraktionsfritt läge"
        >
          {/* Header – minimal */}
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div className="flex items-center gap-2 text-text-muted">
              <Brain size={16} className="text-accent/50" />
              <span className="text-xs tracking-widest uppercase text-text-dim">Töm Huvudet</span>
            </div>
            <button
              type="button"
              onClick={handleDiscard}
              className="rounded-full p-1.5 text-text-dim hover:text-text transition-colors"
              aria-label="Stäng utan att spara"
              title="Stäng utan att spara"
            >
              <X size={16} />
            </button>
          </div>

          {/* Hjärtat av Zen Mode */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
            <p className="mb-4 text-xs text-text-dim/60 tracking-wide">
              Skriv allt som är i vägen. Inget kategoriseras, inget visas för andra.
            </p>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv fritt…"
              className="
                w-full max-w-lg flex-1
                min-h-[280px] resize-none rounded-2xl
                border border-white/5 bg-white/[0.03]
                px-5 py-4 text-base text-text leading-relaxed
                placeholder:text-text-dim/30
                focus:border-accent/20 focus:outline-none
                transition-colors
              "
              disabled={saving}
            />

            {/* Teckenräknare */}
            <p className="mt-1.5 self-end text-[11px] text-text-dim/40 max-w-lg w-full text-right pr-1">
              {text.length} tecken
            </p>

            {/* Bekräftelse / Fel */}
            <AnimatePresence>
              {saved && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm text-emerald-300/80"
                >
                  ✓ Sparat och stänger…
                </motion.p>
              )}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm text-rose-300/80"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Åtgärder */}
            <div className="mt-5 flex gap-3 max-w-lg w-full justify-end">
              <button
                type="button"
                onClick={handleDiscard}
                className="ds-btn ds-btn--ghost text-sm"
                disabled={saving}
              >
                Kasta & Stäng
              </button>
              <button
                type="button"
                onClick={() => void handleSaveAndClose()}
                className="ds-btn ds-btn--accent text-sm"
                disabled={saving || text.trim().length < MIN_LENGTH}
              >
                {saving ? 'Sparar…' : 'Spara & Stäng'}
              </button>
            </div>

            {/* Zero Footprint-notering */}
            <p className="mt-4 text-[10px] text-text-dim/30 max-w-lg w-full text-center">
              Zero Footprint · Ingenting sparas lokalt · Krypteras i transit
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
