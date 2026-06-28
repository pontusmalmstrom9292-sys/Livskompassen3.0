import { useEffect, useId, useRef, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export type ModuleHelpLine = {
  label: string;
  text: string;
};

type Props = {
  title: string;
  lines: readonly ModuleHelpLine[];
  action?: { label: string; to: string; search?: string };
  className?: string;
};

/** Liten ?-widget — kort hjälp om silo, sparning och exempel (öppnas vid behov). */
export function ModuleHelpHint({ title, lines, action, className }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={clsx('module-help-hint relative inline-flex shrink-0', className)}>
      <button
        type="button"
        className="module-help-hint__trigger flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-surface-2/60 text-text-muted transition-colors hover:border-accent/40 hover:bg-surface-3/50 hover:text-accent"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Hjälp: ${title}`}
        onClick={() => setOpen((value) => !value)}
      >
        <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={title}
          className="module-help-hint__panel absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border/40 bg-surface-2/95 p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="pr-2 text-xs font-semibold leading-snug text-accent">{title}</p>
            <button
              type="button"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-3/60 hover:text-text"
              aria-label="Stäng hjälp"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed text-text-muted">
            {lines.map((line) => (
              <li key={line.label}>
                <strong className="text-text">{line.label}:</strong> {line.text}
              </li>
            ))}
          </ul>
          {action ? (
            <Link
              to={{ pathname: action.to, search: action.search ?? '' }}
              className="ds-btn ds-btn--ghost mt-3 inline-flex text-xs"
              onClick={() => setOpen(false)}
            >
              {action.label} →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
