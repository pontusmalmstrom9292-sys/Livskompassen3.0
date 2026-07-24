import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/design-system';

export interface ForalderTryggCardProps {
  barnportenLevel: number;
}

export function ForalderTryggCard({ barnportenLevel }: ForalderTryggCardProps) {
  const navigate = useNavigate();
  const isUnlocked = barnportenLevel >= 2;

  if (isUnlocked) {
    return (
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface-2 p-5 shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_12%,transparent)] transition-[box-shadow,border-color] duration-200">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-obsidian-indigo/20 text-obsidian-indigo"
            aria-hidden
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="text-base font-medium text-text">Förälder Trygg</h3>
            <p className="text-xs text-text-muted">Tre spetsar för en stabil vardag</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/barnporten/foralder-trygg')}
          className="mt-1 inline-flex min-h-[var(--ds-touch-target,2.75rem)] items-center justify-between rounded-xl bg-surface-3 px-4 py-2 text-sm font-medium text-obsidian-indigo transition-colors hover:bg-surface-3/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
        >
          <span>Åtkomst</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="group mt-6 grid overflow-hidden rounded-2xl border border-border/50 bg-surface-2/50 transition-[border-color] duration-200"
      aria-label="Förälder Trygg är låst"
    >
      {/* Content Layer */}
      <div className="col-start-1 row-start-1 flex flex-col gap-3 p-5 opacity-30" aria-hidden>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text-muted">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-medium text-text">Förälder Trygg</h3>
            <p className="text-xs text-text-muted">Tre spetsar för en stabil vardag</p>
          </div>
        </div>
        <div className="mt-2 h-11 rounded-xl bg-surface-3/30" />
      </div>

      {/* Blur Overlay Layer */}
      <div className="col-start-1 row-start-1 z-10 flex items-center justify-center bg-surface-2/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-3 text-text-muted">
            <Lock className="h-5 w-5" aria-hidden />
          </div>
          <span className="text-xs font-medium text-text-muted">
            Låst: Mer innehåll låses upp när barnet utvecklas
          </span>
        </div>
      </div>
    </div>
  );
}
