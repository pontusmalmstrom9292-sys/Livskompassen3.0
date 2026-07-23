import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { ButtonLink } from '@/design-system';

export type ModuleHelpLine = {
  label: string;
  text: string;
};

type PanelPlacement = 'below' | 'above';

type PanelPosition = {
  top: number;
  left: number;
  width: number;
  placement: PanelPlacement;
};

type Props = {
  title: string;
  lines: readonly ModuleHelpLine[];
  action?: { label: string; to: string; search?: string };
  className?: string;
};

const PANEL_GAP_PX = 8;
const PANEL_WIDTH_PX = 320;

function canUseDomPortal(): boolean {
  return typeof document !== 'undefined' && Boolean(document.body);
}

/** Liten ?-widget — kort hjälp om silo, sparning och exempel (öppnas vid behov). */
export function ModuleHelpHint({ title, lines, action, className }: Props) {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<PanelPosition | null>(null);
  const panelId = useId();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || !open) return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const panelHeight = panelRef.current?.offsetHeight ?? 180;
    const spaceBelow = viewportHeight - rect.bottom - PANEL_GAP_PX;
    const placement: PanelPlacement =
      spaceBelow >= Math.min(panelHeight, 160) ? 'below' : 'above';
    const top =
      placement === 'below'
        ? rect.bottom + PANEL_GAP_PX
        : Math.max(PANEL_GAP_PX, rect.top - panelHeight - PANEL_GAP_PX);

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const maxWidth = viewportWidth - PANEL_GAP_PX * 2;
    const width = Math.min(PANEL_WIDTH_PX, maxWidth);
    const preferredLeft = rect.right - width;
    const left = Math.min(
      Math.max(PANEL_GAP_PX, preferredLeft),
      window.innerWidth - width - PANEL_GAP_PX,
    );

    setPanelPos({ top, left, width, placement });
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const raf = requestAnimationFrame(updatePanelPosition);
    return () => cancelAnimationFrame(raf);
  }, [open, updatePanelPosition, lines.length, action?.label]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePanelPosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', onScrollOrResize);
      vv.addEventListener('scroll', onScrollOrResize);
    }
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
      vv?.removeEventListener('resize', onScrollOrResize);
      vv?.removeEventListener('scroll', onScrollOrResize);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) {
      setPanelPos(null);
      return;
    }
    closeRef.current?.focus();
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const panelNode = (
    <div
      ref={panelRef}
      id={panelId}
      role="region"
      aria-labelledby={titleId}
      tabIndex={-1}
      style={
        panelPos
          ? {
              position: 'fixed',
              top: panelPos.top,
              left: panelPos.left,
              width: panelPos.width,
              zIndex: 'var(--ds-z-overlay)',
            }
          : { position: 'fixed', visibility: 'hidden', pointerEvents: 'none' }
      }
      className={clsx(
        'module-help-hint__panel rounded-xl border border-border/40 bg-surface-2/95 p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md outline-none transition-all duration-200',
        panelPos?.placement === 'above' ? 'origin-bottom' : 'origin-top',
        open && panelPos ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p id={titleId} className="pr-2 text-xs font-semibold leading-snug text-accent">
          {title}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="module-help-hint__close flex min-h-[var(--ds-touch-target,2.75rem)] min-w-[var(--ds-touch-target,2.75rem)] shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-3/60 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
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
        <ButtonLink
          to={{ pathname: action.to, search: action.search ?? '' }}
          variant="ghost"
          className="--ghost mt-3 inline-flex min-h-[var(--ds-touch-target,2.75rem)] text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => setOpen(false)}
        >
          {action.label} →
        </ButtonLink>
      ) : null}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={clsx(
        'module-help-hint relative inline-flex shrink-0',
        open && 'module-help-hint--open',
        className,
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        className="module-help-hint__trigger flex min-h-[var(--ds-touch-target)] min-w-[var(--ds-touch-target)] items-center justify-center rounded-full border border-border/40 bg-surface-2/60 text-text-muted transition-colors hover:border-accent/40 hover:bg-surface-3/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Hjälp: ${title}`}
        onClick={() => setOpen((value) => !value)}
      >
        <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>

      {open && canUseDomPortal() ? createPortal(panelNode, document.body) : null}
    </div>
  );
}
