import type { ReactNode } from 'react';
import { Heart } from 'lucide-react';
import { clsx } from 'clsx';
import './familjen.css';

type Props = {
  children: ReactNode;
  className?: string;
  /** Visa zon-pill "FAMILJEN" under hub-header */
  showZonePill?: boolean;
};

/**
 * Obsidian Calm Bento — visuellt skal för Familjehubben (indigo silo).
 * Bakgrund: radiell gradient + svag hjärt-ikon (ingen logik).
 */
export function FamiljenBentoShell({
  children,
  className,
  showZonePill = true,
}: Props) {
  return (
    <div className={clsx('familjen-bento-shell', className)}>
      <Heart className="familjen-bg-rose" strokeWidth={0.75} aria-hidden />
      <div className="familjen-bento-shell__content">
        {showZonePill ? (
          <div className="familjen-zone-strip" aria-hidden>
            <span className="familjen-zone-pill">Familjen</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
