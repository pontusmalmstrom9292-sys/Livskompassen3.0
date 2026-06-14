import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { useStore } from '@/core/store';

export type PlaneringInkastDelegateProps = {
  onSaved?: () => void;
};

/**
 * Fas 9C — G10 smart inkast för planering.
 * Tunn omslag runt CaptureSuperModule variant planering (sourceModule planering_inkorg).
 */
export function PlaneringInkastDelegate({ onSaved }: PlaneringInkastDelegateProps) {
  const user = useStore((s) => s.user);

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att använda smart inkast med granskning.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Smart inkast
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Klistra in text, mejl eller anteckning. Granska alltid i kön innan något sparas som
          uppgift eller arkivpost.
        </p>
      </header>

      <CaptureSuperModule variant="planering" compact onSaved={onSaved} />
    </div>
  );
}
