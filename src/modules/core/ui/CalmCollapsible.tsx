import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

type CalmCollapsibleProps = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  glow?: 'gold' | 'blue' | 'green';
  children: ReactNode;
};

/** Progressive disclosure — ett block i taget, Obsidian Calm. */
export function CalmCollapsible({
  title,
  meta,
  defaultOpen = false,
  glow,
  children,
}: CalmCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

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
        onClick={() => setOpen((v) => !v)}
      >
        <span className="calm-collapsible__title">{title}</span>
        {meta ? <span className="calm-collapsible__meta">{meta}</span> : null}
        <ChevronDown className="calm-collapsible__chevron" aria-hidden />
      </button>
      {open ? <div className="calm-collapsible__body">{children}</div> : null}
    </section>
  );
}
