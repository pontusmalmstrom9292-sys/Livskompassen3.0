import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
};

/** Minimal layout för hemskärms-genvägar — ingen dock. */
export function WidgetShell({ title, lead, children }: Props) {
  return (
    <div className="widget-shell relative min-h-screen bg-bg text-text">
      <header className="widget-shell__header">
        <Link to="/" className="widget-shell__brand" aria-label="Öppna Livskompassen">
          <Compass className="h-4 w-4 text-accent" strokeWidth={1.65} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim">Widget</span>
        </Link>
        <h1 className="widget-shell__title">{title}</h1>
        {lead ? <p className="widget-shell__lead">{lead}</p> : null}
      </header>
      <main className="widget-shell__main">{children}</main>
    </div>
  );
}
