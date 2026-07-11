import { useEffect } from 'react';

let scrollLockDepth = 0;
let previousOverflow: string | null = null;

function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  scrollLockDepth += 1;
  if (scrollLockDepth === 1) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}

function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  scrollLockDepth = Math.max(0, scrollLockDepth - 1);
  if (scrollLockDepth === 0) {
    document.body.style.overflow = previousOverflow ?? '';
    previousOverflow = null;
  }
}

/** Stack-safe body scroll lock for overlays (Modal, Sheet, Resurser). */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [active]);
}
