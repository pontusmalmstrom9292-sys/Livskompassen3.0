import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { clsx } from 'clsx';
import './valv.css';

type Props = {
  children: ReactNode;
  className?: string;
  /** Visa zon-pill "VALV" under hub-header */
  showZonePill?: boolean;
};

/**
 * Obsidian Calm Bento — visuellt skal för Valv (indigo/gold forensic silo).
 * Bakgrund: radiell gradient + svag sköld-ikon (ingen logik).
 */
export function ValvBentoShell({
  children,
  className,
  showZonePill = true,
}: Props) {
  return (
    <div className={clsx('valv-bento-shell', className)}>
      <Shield className="valv-bg-watermark" strokeWidth={0.75} aria-hidden />
      <div className="valv-bento-shell__content">
        {showZonePill ? (
          <div className="valv-zone-strip" aria-hidden>
            <span className="valv-zone-pill">Valv</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
