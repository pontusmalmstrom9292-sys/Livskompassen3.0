import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { RESURSER_NAV_ROWS } from './resurserNavConfig';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Fullskärms modulmeny — hybrid-nav Resurser (prod). */
export function ResurserOverlay({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESURSER_NAV_ROWS;
    return RESURSER_NAV_ROWS.filter(
      (r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
    );
  }, [query]);

  const handlePick = useCallback(
    (path: string) => {
      onClose();
      setQuery('');
      navigate(path);
    },
    [navigate, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="resurser-overlay fixed inset-0 z-[120] flex flex-col animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Resurser"
    >
      <div className="resurser-overlay__backdrop absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={onClose} aria-hidden />
      <div className="resurser-overlay__panel relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col px-4 pb-[calc(var(--app-dock-clearance,5.5rem)+env(safe-area-inset-bottom,0px))] pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
        <header className="resurser-overlay__header mb-4 flex items-center justify-between">
          <h2 className="font-display-serif text-lg uppercase tracking-[0.2em] text-accent">Resurser</h2>
          <button
            type="button"
            className="resurser-overlay__close flex h-11 w-11 items-center justify-center rounded-full border border-border/30 text-text-muted"
            aria-label="Stäng resurser"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        <label className="resurser-overlay__search mb-4 flex min-h-[44px] items-center gap-2 rounded-2xl border border-border/30 bg-surface-2/80 px-4">
          <Search className="h-4 w-4 shrink-0 text-text-dim" strokeWidth={1.5} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök i resurser"
            className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
        </label>

        <ul className="resurser-overlay__list calm-scroll-island flex-1 space-y-1 overflow-y-auto">
          {filtered.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  className={clsx(
                    'resurser-overlay__row flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left',
                    'border border-transparent hover:border-border/30 hover:bg-surface-2/60',
                  )}
                  onClick={() => handlePick(row.path)}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/20 bg-surface-3/80">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text">{row.label}</span>
                    <span className="block text-xs text-text-dim">{row.sub}</span>
                  </span>
                  <span className="text-text-dim" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
