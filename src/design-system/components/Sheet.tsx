import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
};

/**
 * Sheet — bottom sheet on mobile, centered panel on sm+.
 * Escape dismiss, backdrop click, token glass panel.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  className,
  panelClassName,
}: SheetProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn('ds-overlay ds-overlay--sheet', className)}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn('ds-sheet-panel ds-card glow-bottom-gold outline-none', panelClassName)}
      >
        <h2
          id={titleId}
          className="font-[family-name:var(--ds-font-display)] text-[length:var(--ds-font-size-lg)] text-accent"
        >
          {title}
        </h2>
        {description ? (
          <p id={descId} className="mt-1 text-[length:var(--ds-font-size-xs)] text-text-dim">
            {description}
          </p>
        ) : null}
        <div className="mt-[var(--ds-space-4)]">{children}</div>
      </div>
    </div>
  );
}

export type SheetFooterProps = {
  children: ReactNode;
  className?: string;
};

export function SheetFooter({ children, className }: SheetFooterProps) {
  return (
    <div className={cn('mt-[var(--ds-space-5)] flex flex-wrap gap-[var(--ds-space-2)]', className)}>
      {children}
    </div>
  );
}
