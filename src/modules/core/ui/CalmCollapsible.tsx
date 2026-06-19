import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

type CalmCollapsibleProps = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  glow?: 'gold' | 'blue' | 'green';
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
  children,
}: CalmCollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
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
        glow === 'gold' && 'glow-bottom-gold',
        glow === 'blue' && 'glow-bottom-blue',
        glow === 'green' && 'glow-bottom-green',
      )}
    >
      <button
        type="button"
        className="calm-collapsible__trigger"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="calm-collapsible__title">{title}</span>
        {meta ? <span className="calm-collapsible__meta">{meta}</span> : null}
        <ChevronDown className="calm-collapsible__chevron" aria-hidden />
      </button>
      {open ? <div className="calm-collapsible__body">{children}</div> : null}
    </section>
  );
}
