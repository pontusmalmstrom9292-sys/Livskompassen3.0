import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export interface ForalderTryggCardProps {
  barnportenLevel: number;
}

export function ForalderTryggCard({ barnportenLevel }: ForalderTryggCardProps) {
  const navigate = useNavigate();
  const isUnlocked = barnportenLevel >= 2;

  if (isUnlocked) {
    return (
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-5 shadow-indigo-glow transition-all">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-obsidian-indigo/20 text-obsidian-indigo">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-text">Förälder Trygg</h3>
            <p className="text-xs text-text-muted">Tre spetsar för en stabil vardag</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/barnporten/foralder-trygg')}
          className="mt-2 flex items-center justify-between rounded-xl bg-surface-3 px-4 py-2 text-sm font-medium text-obsidian-indigo transition-colors hover:bg-surface-3/80"
        >
          <span>Åtkomst</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative mt-6 flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-surface-2/50 p-5 transition-all">
      {/* Blur Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-2/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-text-muted">
            <Lock className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-text-muted">
            Låst: Mer innehåll låses upp när barnet utvecklas
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 opacity-30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text-muted">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-medium text-text">Förälder Trygg</h3>
          <p className="text-xs text-text-muted">Tre spetsar för en stabil vardag</p>
        </div>
      </div>
      <div className="mt-2 h-9 rounded-xl bg-surface-3/30 opacity-30"></div>
    </div>
  );
}
