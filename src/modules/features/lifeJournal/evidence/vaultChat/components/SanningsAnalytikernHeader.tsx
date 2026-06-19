import { Search } from 'lucide-react';

/** Valv Sök — agentidentitet för Sannings-Analytikern (P1). */
export function SanningsAnalytikernHeader() {
  return (
    <div className="calm-card glow-bottom-blue flex items-center gap-3 rounded-2xl border border-border p-4">
      <div className="rounded-2xl border border-accent-secondary/25 bg-accent-secondary/15 p-3">
        <Search className="h-5 w-5 text-accent-secondary" aria-hidden />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
          Sannings-Analytikern
        </p>
        <h2 className="font-display text-lg text-text">Sök i Valvet</h2>
        <p className="mt-1 text-xs text-text-dim">
          Klinisk bevisföring mot gaslighting — teori utan WORM-stöd markeras tydligt.
        </p>
      </div>
    </div>
  );
}
