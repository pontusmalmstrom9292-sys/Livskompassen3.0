import type { ReactNode } from 'react';
import { Compass } from 'lucide-react';
import { clsx } from 'clsx';
import './vardagen.css';

type Props = {
  children: ReactNode;
  className?: string;
  showZonePill?: boolean;
};

/** Obsidian Calm Bento — visuellt skal för Vardagen (emerald silo). */
export function VardagenBentoShell({
  children,
  className,
  showZonePill = true,
}: Props) {
  return (
    <div className={clsx('vardagen-bento-shell', className)}>
      <Compass className="vardagen-bg-watermark" strokeWidth={0.75} aria-hidden />
      <div className="vardagen-bento-shell__content">
        {showZonePill ? (
          <div className="vardagen-zone-strip" aria-hidden>
            <span className="vardagen-zone-pill">Vardagen</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
