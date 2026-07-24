import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import './mabra.css';

type Props = {
  children: ReactNode;
  className?: string;
  showZonePill?: boolean;
};

/** Obsidian Calm Bento — visuellt skal för Mabra-hubben (smaragd silo). */
export function MabraBentoShell({ children, className, showZonePill = true }: Props) {
  return (
    <div className={clsx('mabra-bento-shell', className)}>
      <Sparkles className="mabra-bg-watermark" strokeWidth={0.75} aria-hidden />
      <div className="mabra-bento-shell__content">
        {showZonePill ? (
          <div className="mabra-zone-strip" aria-hidden>
            <span className="mabra-zone-pill">Mabra</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
