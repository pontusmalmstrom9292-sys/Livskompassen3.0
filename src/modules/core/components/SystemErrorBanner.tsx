import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';

/** Visar globala fel (t.ex. Fyren/Valv nekad) — store.system.error skrevs tidigare utan UI. */
export function SystemErrorBanner() {
  const error = useStore((s) => s.system.error);
  const setError = useStore((s) => s.setError);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 12_000);
    return () => window.clearTimeout(timer);
  }, [error, setError]);

  if (!error) return null;

  return (
    <div
      className="system-error-banner pointer-events-auto fixed inset-x-4 top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-[80] mx-auto max-w-lg rounded-xl border border-danger/30 bg-surface-2/95 px-4 py-3 shadow-lg backdrop-blur-xl"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 text-sm text-text">{error}</p>
        <button
          type="button"
          className="shrink-0 text-text-dim hover:text-text"
          aria-label="Stäng felmeddelande"
          onClick={() => setError(null)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
