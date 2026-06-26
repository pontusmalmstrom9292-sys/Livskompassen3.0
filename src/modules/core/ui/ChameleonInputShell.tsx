import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useChameleonMorph } from '@/core/hooks/useChameleonMorph';

type Props<T> = {
  mode: T;
  children: (displayedMode: T) => ReactNode;
  className?: string;
  viewportClassName?: string;
};

/**
 * Delad Chameleon-morph-container (promoted från Design Freeport).
 * Byter delegate in-place med 350 ms fade — ingen sidladdning.
 */
export function ChameleonInputShell<T>({
  mode,
  children,
  className,
  viewportClassName,
}: Props<T>) {
  const { displayed, fading, morphMs } = useChameleonMorph(mode);

  return (
    <div className={clsx('chameleon-input-shell', className)}>
      <div
        className={clsx(
          'chameleon-input-shell__viewport calm-scroll-island transition-all duration-300 ease-in-out',
          fading ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0',
          viewportClassName,
        )}
        style={{ transitionDuration: `${morphMs}ms` }}
      >
        {children(displayed)}
      </div>
    </div>
  );
}
