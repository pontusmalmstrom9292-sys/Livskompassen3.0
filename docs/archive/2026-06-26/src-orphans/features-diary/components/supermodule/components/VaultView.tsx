
import type { VaultEntry } from '../types';

export const VaultView = ({ entry }: { entry: VaultEntry }) => {
  const isAnchorOrPinned = entry.isAnchor || entry.isPinned || entry.pinned;

  let dateString = 'OKÄNT DATUM';
  if (entry.createdAt) {
    if (typeof entry.createdAt === 'object' && 'seconds' in entry.createdAt) {
      dateString = new Date(entry.createdAt.seconds * 1000).toISOString().split('T')[0];
    } else {
      dateString = new Date(entry.createdAt as string | number).toISOString().split('T')[0];
    }
  }

  return (
    <div className="space-y-6 p-6 bg-surface-3 border border-border-strong rounded-xl relative overflow-hidden">
      {/* Dekorativ övre ram för "Vault"-känsla */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-50" />
      
      <div className="flex items-center justify-between pb-4 border-b border-border-muted">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 tabular-nums font-mono">
            {dateString}
          </p>
          <h2 className="text-xl font-bold tracking-wide text-text">{entry.action || 'Valv-inlägg'}</h2>
        </div>
        {isAnchorOrPinned && (
          <span className="text-xs bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-3 py-1.5 rounded-full font-medium tracking-wide shadow-[0_0_10px_rgba(212,175,55,0.1)]">
            📌 Sanningens Ankare
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-black/20 rounded-lg border-l-4 border-accent-gold border-y border-r border-border-muted">
          <p className="text-[10px] text-accent-gold uppercase tracking-[0.15em] mb-2 font-mono">Sanning (WORM)</p>
          <p className="text-text leading-relaxed">{entry.truth}</p>
        </div>

        {entry.theirVersion && (
          <div className="p-5 bg-black/20 rounded-lg border-l-4 border-red-500/70 border-y border-r border-border-muted opacity-80">
            <p className="text-[10px] text-red-400 uppercase tracking-[0.15em] mb-2 font-mono">Deras version</p>
            <p className="italic text-text-muted leading-relaxed">{entry.theirVersion}</p>
          </div>
        )}
      </div>

      {(entry.shieldBoundary || entry.shieldFeeling) && (
        <div className="p-5 bg-black/20 border border-border-muted rounded-lg space-y-4">
          {entry.shieldBoundary && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-1 font-mono">Gräns (Boundary)</p>
              <p className="text-text">{entry.shieldBoundary}</p>
            </div>
          )}
          {entry.shieldFeeling && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-1 font-mono">Känsla</p>
              <p className="text-text">{entry.shieldFeeling}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
