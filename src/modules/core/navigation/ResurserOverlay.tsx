import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Sheet } from '@/design-system/components/Sheet';
import { EmptyState } from '@/core/ui/EmptyState';
import { RESURSER_NAV_ROWS } from './resurserNavConfig';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Fullskärms modulmeny — hybrid-nav Resurser (prod). DS Sheet, samma UX som tidigare. */
export function ResurserOverlay({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESURSER_NAV_ROWS;
    return RESURSER_NAV_ROWS.filter(
      (r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
    );
  }, [query]);

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  const handlePick = useCallback(
    (path: string) => {
      handleClose();
      navigate(path);
    },
    [handleClose, navigate],
  );

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => searchRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="Resurser"
      placement="center"
      size="tall"
      className="resurser-overlay z-[120] animate-fade-in"
      panelClassName={clsx(
        'resurser-overlay__panel relative mx-auto flex h-full w-full max-w-2xl flex-col',
        'border border-border/25 bg-surface/85 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)] backdrop-blur-xl',
        'px-4 pb-[calc(var(--app-dock-clearance,5.5rem)+env(safe-area-inset-bottom,0px))]',
        'pt-[calc(4.5rem+env(safe-area-inset-top,0px))]',
      )}
      bodyClassName="flex min-h-0 flex-1 flex-col"
      headerAction={
        <button
          type="button"
          className="resurser-overlay__close flex h-11 w-11 items-center justify-center rounded-full border border-border/30 bg-surface-2/60 text-text-muted backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
          aria-label="Stäng resurser"
          onClick={handleClose}
        >
          <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      }
    >
      <label className="resurser-overlay__search mb-4 flex min-h-[44px] items-center gap-2 rounded-2xl border border-border/30 bg-surface-2/70 px-4 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--accent)_6%,transparent)] backdrop-blur-md">
          <Search className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.5} aria-hidden />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök i resurser"
          aria-label="Sök i resurser"
          className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none focus-visible:ring-0"
        />
      </label>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} träffar
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Inga träffar"
          message="Prova ett annat sökord. Esc stänger menyn."
        />
      ) : (
        <ul className="resurser-overlay__list calm-scroll-island min-h-0 flex-1 space-y-1 overflow-y-auto">
          {filtered.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  className={clsx(
                    'resurser-overlay__row flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left',
                    'border border-transparent hover:border-border/30 hover:bg-surface-2/60',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/40',
                  )}
                  onClick={() => handlePick(row.path)}
                >
                  <span className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-border/20 bg-surface-3/80">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text">{row.label}</span>
                    <span className="block text-xs text-text-muted">{row.sub}</span>
                  </span>
                  <span className="text-text-muted" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}
