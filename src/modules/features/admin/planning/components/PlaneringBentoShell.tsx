import type { ReactNode } from 'react';
import { Compass } from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
  children: ReactNode;
  className?: string;
  /** Visa zon-pill "PLANERING" under hub-header */
  showZonePill?: boolean;
};

/**
 * Obsidian Calm Bento — visuellt skal för Planeringshubben.
 * Bakgrund: radiell gradient + svag kompassros (ingen logik).
 */
export function PlaneringBentoShell({
  children,
  className,
  showZonePill = true,
}: Props) {
  return (
    <div className={clsx('planering-bento-shell', className)}>
      <Compass
        className="planering-bg-compass-rose"
        strokeWidth={0.75}
        aria-hidden
      />
      <div className="planering-bento-shell__content">
        {showZonePill ? (
          <div className="planering-zone-strip" aria-hidden>
            <span className="planering-zone-pill">Planering</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
