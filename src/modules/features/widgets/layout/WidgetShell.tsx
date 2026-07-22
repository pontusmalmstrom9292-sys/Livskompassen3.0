import { type ReactNode } from 'react';
import { Compass, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { WidgetShellProvider, useWidgetShellContext } from '../context/widgetShellContext';
import { useWidgetPanicHide } from '../hooks/useWidgetPanicHide';
import { WidgetIconButton } from '../components/WidgetButton';
import './WidgetShell.css';

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
  /** Visa brand-länk till huvudapp — default false (fristående). */
  showAppLink?: boolean;
  /** Companion OS surface — softer shell chrome. */
  companion?: boolean;
  /** Valfri stäng-callback (t.ex. modal) — annars panik-dölj. */
  onClose?: () => void;
};

function WidgetShellFrame({
  title,
  lead,
  children,
  showAppLink = false,
  companion = false,
  onClose,
}: Props) {
  const [panicBlur, setPanicBlur] = useState(false);
  const shellCtx = useWidgetShellContext();
  const panicHide = useWidgetPanicHide(() => {
    shellCtx?.runClear();
  });

  const handlePanic = () => {
    if (onClose) {
      onClose();
      return;
    }
    setPanicBlur(true);
    window.setTimeout(() => {
      panicHide();
    }, 400);
  };

  return (
    <>
      <div
        className={[
          'widget-shell relative min-h-screen bg-bg text-text',
          companion && 'widget-shell--companion',
          panicBlur && 'widget-shell--panic',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <header className="widget-shell__header">
          <div className="flex items-start justify-between gap-3">
            {showAppLink || companion ? (
              <a href="/" className="widget-shell__brand" aria-label="Öppna Livskompassen">
                <Compass className="h-4 w-4 text-accent" strokeWidth={1.65} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {companion ? 'Companion' : 'Widget'}
                </span>
              </a>
            ) : (
              <span className="widget-shell__brand widget-shell__brand--static">
                <Compass className="h-4 w-4 text-accent" strokeWidth={1.65} aria-hidden />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Widget</span>
              </span>
            )}
            <WidgetIconButton
              label={onClose ? 'Stäng' : 'Dölj nu — neutral hem'}
              onClick={handlePanic}
              className="widget-shell__panic shrink-0"
            >
              {onClose ? (
                <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              ) : (
                <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              )}
            </WidgetIconButton>
          </div>
          <h1 className="widget-shell__title">{title}</h1>
          {lead ? <p className="widget-shell__lead">{lead}</p> : null}
        </header>
        <main className="widget-shell__main">
          <div className="widget-shell__surface">{children}</div>
        </main>
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
