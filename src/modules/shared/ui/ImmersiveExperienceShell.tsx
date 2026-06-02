import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type Props = {
  title?: string;
  onExit: () => void;
  /** Optional theme token, e.g. `J-mabra-lavendel` — maps to `data-theme-id`. */
  themeId?: string;
  children: ReactNode;
};

/**
 * Fullscreen portal shell — hides app chrome (dock/drawer) for focused experiences.
 * Zero Footprint: parent clears state via `onExit`.
 */
export function ImmersiveExperienceShell({ title, onExit, themeId, children }: Props) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onExit]);

  return createPortal(
    <div
      className="fixed inset-0 z-[240] flex flex-col bg-gradient-to-b from-[#020617] to-[#0f172a]"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Upplevelse'}
      data-theme-id={themeId}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {title ? <h2 className="text-sm font-medium text-text">{title}</h2> : <span aria-hidden />}
        <button
          type="button"
          onClick={onExit}
          className="btn-pill--ghost inline-flex items-center gap-1.5 text-xs"
        >
          <X className="h-4 w-4" aria-hidden />
          Avsluta
        </button>
      </header>
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        {children}
      </div>
    </div>,
    document.body,
  );
}
