import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** Progressive disclosure på MåBra-hubben — färre synliga block (IA Våg 3). */
export function MabraHubCollapsible({ title, meta, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={clsx('mabra-hub-collapsible', open && 'mabra-hub-collapsible--open')}>
      <button
        type="button"
        className="mabra-hub-collapsible__trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mabra-hub-collapsible__title">{title}</span>
        {meta ? <span className="mabra-hub-collapsible__meta">{meta}</span> : null}
        <ChevronDown className="mabra-hub-collapsible__chevron" aria-hidden />
      </button>
      {open ? <div className="mabra-hub-collapsible__body">{children}</div> : null}
    </section>
  );
}
