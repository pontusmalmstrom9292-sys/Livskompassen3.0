import type { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import './hjartat.css';

type Props = {
  children: ReactNode;
  className?: string;
  /** Visa zon-pill "HJÄRTAT" under hub-header */
  showZonePill?: boolean;
};

/**
 * Obsidian Calm Bento — visuellt skal för Hjärtat (gold/lavender silo).
 * Bakgrund: radiell gradient + svag bok-ikon (ingen logik).
 */
export function HjartatBentoShell({
  children,
  className,
  showZonePill = true,
}: Props) {
  return (
    <div className={clsx('hjartat-bento-shell', className)}>
      <BookOpen className="hjartat-bg-watermark" strokeWidth={0.75} aria-hidden />
      <div className="hjartat-bento-shell__content">
        {showZonePill ? (
          <div className="hjartat-zone-strip" aria-hidden>
            <span className="hjartat-zone-pill">Hjärtat</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
