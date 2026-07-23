import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button, Modal } from '@/design-system';
import {
  immersiveModalOverlayClass,
  immersiveModalPanelClass,
} from '@/modules/core/ui/zenModeOverlayClasses';

type Props = {
  title?: string;
  onExit: () => void;
  /** Optional theme token, e.g. `J-mabra-lavendel` — maps to `data-theme-id`. */
  themeId?: string;
  children: ReactNode;
};

/**
 * Fullscreen immersive shell — hides app chrome (dock/drawer) for focused experiences.
 * Uses DS Modal for Escape dismiss + focus trap. Zero Footprint: parent clears state via `onExit`.
 */
export function ImmersiveExperienceShell({ title, onExit, themeId, children }: Props) {
  return (
    <Modal
      open
      onClose={onExit}
      hideHeader
      ariaLabel={title ?? 'Upplevelse'}
      className={immersiveModalOverlayClass}
      panelClassName={immersiveModalPanelClass}
    >
      <div
        className="flex h-full min-h-[100dvh] flex-col bg-gradient-to-b from-bg to-surface-3"
        data-theme-id={themeId}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          {title ? <h2 className="text-sm font-medium text-text">{title}</h2> : <span aria-hidden />}
          <Button type="button" onClick={onExit} variant="ghost" className="--ghost inline-flex min-h-11 items-center gap-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            <X className="h-4 w-4" aria-hidden />
            Avsluta
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          {children}
        </div>
      </div>
    </Modal>
  );
}
