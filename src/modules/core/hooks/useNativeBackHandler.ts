import { useEffect } from 'react';
import { useStore } from '../store';
import { App } from '@capacitor/app';
import { isCapacitorNative } from '../platform/capacitorPlatform';

/**
 * Android Premium Enhancement — Handles physical back button to close
 * overlays (Menu, Sheets, Modals) before navigating back in history.
 */
export function useNativeBackHandler() {
  const isMenuOpen = useStore((s) => s.ui.isMenuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);

  useEffect(() => {
    if (!isCapacitorNative()) return;

    const unsub = App.addListener('backButton', (data) => {
      // 1. Close Menu first
      if (isMenuOpen) {
        setMenuOpen(false);
        return;
      }

      // 2. Check for open Sheets/Modals (simple DOM check for DS components)
      const hasOverlay = document.querySelector('.ds-overlay');
      if (hasOverlay) {
        // Find the close button and click it to trigger component onClose logic
        // This targets typical DS Sheet/Modal close actions or backdrops
        const closeBtn = document.querySelector('.ds-sheet-panel [aria-label="Stäng"], .ds-modal-panel [aria-label="Stäng"], .resurser-overlay__close');
        if (closeBtn instanceof HTMLElement) {
          closeBtn.click();
          return;
        }

        // Fallback: if no close button found but overlay exists, we might need a more aggressive onClose
        // But for now, DS components usually have close buttons or backdrop clicks.
      }

      // 3. Default behavior (Capacitor will handle navigation if we don't intercept)
      // If we are at root, we might want to exit, but let Capacitor default for now.
    });

    return () => {
      void unsub.then((h) => h.remove());
    };
  }, [isMenuOpen, setMenuOpen]);
}
