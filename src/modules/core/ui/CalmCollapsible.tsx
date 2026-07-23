import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

type CalmCollapsibleProps = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  glow?: 'gold' | 'blue' | 'green';
  variant?: 'card' | 'transparent';
  /** Om true (default) unmountas children när komponenten stängs. Om false döljs de med CSS. */
  unmountOnHide?: boolean;
  children: ReactNode;
};

/** Progressive disclosure — ett block i taget, Obsidian Calm. */
export function CalmCollapsible({
  title,
  meta,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  glow,
  variant = 'transparent',
  unmountOnHide = true,
  children,
}: CalmCollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const bodyId = useId();
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <section
      className={clsx(
        'calm-collapsible',
        open && 'calm-collapsible--open',
        variant === 'card' && 'calm-card',
        glow === 'gold' && 'glow-bottom-gold',
        (glow === 'blue' || glow === 'green') && 'glow-bottom-gold',
      )}
    >
      <button
        type="button"
        className="calm-collapsible__trigger min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={toggle}
      >
        <span className="calm-collapsible__title">{title}</span>
        {meta ? <span className="calm-collapsible__meta">{meta}</span> : null}
        <ChevronDown className="calm-collapsible__chevron" aria-hidden />
      </button>
      {unmountOnHide ? (
        open ? (
          <div id={bodyId} className="calm-collapsible__body">{children}</div>
        ) : null
      ) : (
        <div id={bodyId} className={clsx('calm-collapsible__body', !open && 'hidden')}>
          {children}
        </div>
      )}
    </section>
  );
}
