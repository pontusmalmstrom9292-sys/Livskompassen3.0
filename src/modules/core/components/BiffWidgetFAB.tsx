import { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';
import { BiffPublicPanel } from '@/features/family/safeHarbor/components/BiffPublicPanel';

export function BiffWidgetFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Stäng om man klickar utanför (valfritt, men bra UX)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-4 z-50 flex flex-col items-end pointer-events-none">
      {/* Drawer / Popover */}
      {isOpen && (
        <div
          ref={panelRef}
          className="pointer-events-auto mb-4 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-accent/20 bg-surface/95 p-4 shadow-xl backdrop-blur-md animate-fade-in sm:w-[360px]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent" />
              Brusfiltret
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-text-muted hover:bg-surface-3 transition-colors"
              aria-label="Stäng brusfiltret"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            <BiffPublicPanel />
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95',
          isOpen ? 'bg-surface-3 text-text-muted' : 'bg-accent text-surface-deep shadow-accent/20'
        )}
        aria-label="Öppna Brusfiltret"
        title="Brusfiltret"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
      </button>
    </div>
  );
}
