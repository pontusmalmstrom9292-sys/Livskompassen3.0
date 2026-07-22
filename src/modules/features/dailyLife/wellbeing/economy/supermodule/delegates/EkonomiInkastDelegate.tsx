import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';

export type EkonomiInkastDelegateProps = {
  userId: string;
};

/**
 * Fas 8E — Ekonomisk inkorg (HITL).
 * CaptureSuperModule variant `ekonomi` → granskning före `transactions` / impulskö.
 */
export function EkonomiInkastDelegate({ userId }: EkonomiInkastDelegateProps) {
  const hasUser = Boolean(userId);

  if (!hasUser) {
    return (
      <p className="text-sm text-text-muted">Logga in för att använda ekonomi-inkast med granskning.</p>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Inkast
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Klistra in kvitto, belopp eller anteckning. Granska alltid innan något sparas i
          vardagsekonomin.
        </p>
      </header>

      <CaptureSuperModule variant="ekonomi" compact />
    </div>
  );
}
