import { Link } from 'react-router-dom';
import { Compass, EyeOff } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { WidgetShellProvider, useWidgetShellContext } from '../context/widgetShellContext';
import { useWidgetPanicHide } from '../hooks/useWidgetPanicHide';

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
};

function WidgetShellFrame({ title, lead, children }: Props) {
  const [panicBlur, setPanicBlur] = useState(false);
  const shellCtx = useWidgetShellContext();
  const panicHide = useWidgetPanicHide(() => {
    shellCtx?.runClear();
  });

  const handlePanic = () => {
    setPanicBlur(true);
    window.setTimeout(() => {
      panicHide();
    }, 400);
  };

  return (
    <>
      <div
        className={`widget-shell relative min-h-screen bg-bg text-text ${panicBlur ? 'widget-shell--panic' : ''}`}
      >
        <header className="widget-shell__header">
          <div className="flex items-start justify-between gap-3">
            <Link to="/" className="widget-shell__brand" aria-label="Öppna Livskompassen">
              <Compass className="h-4 w-4 text-accent" strokeWidth={1.65} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim">Widget</span>
            </Link>
            <button
              type="button"
              onClick={handlePanic}
              className="btn-pill--ghost inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em]"
              aria-label="Dölj nu — neutral hem"
            >
              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Dölj nu
            </button>
          </div>
          <h1 className="widget-shell__title">{title}</h1>
          {lead ? <p className="widget-shell__lead">{lead}</p> : null}
        </header>
        <main className="widget-shell__main">{children}</main>
      </div>
      {panicBlur ? <div className="widget-panic-blur-overlay" aria-hidden /> : null}
    </>
  );
}

/** Minimal layout för hemskärms-genvägar — PV1b panik dölj + rensa vid stäng. */
export function WidgetShell(props: Props) {
  return (
    <WidgetShellProvider>
      <WidgetShellFrame {...props} />
    </WidgetShellProvider>
  );
}
