import { ArrowRight, Briefcase, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EKONOMI_TID_LEAD } from '@/modules/features/dailyLife/wellbeing/economy/ekonomiCopy';

export type EkonomiArbetslivBroDelegateProps = {
  userId: string;
};

const ARBETSLIV_LINKS = [
  {
    to: '/arbetsliv?tab=stampla',
    label: 'Stämpelklocka',
    hint: 'Stämpla in och ut — tid och flex.',
    icon: Clock,
  },
  {
    to: '/arbetsliv?tab=logg',
    label: 'Ekonomilogg',
    hint: 'Fasta räkningar och ledger — hanteras i Arbetsliv, inte här.',
    icon: Briefcase,
  },
] as const;

/**
 * Fas 8E — Navigation only. Ingen write till time_entries eller economy_ledger.
 */
export function EkonomiArbetslivBroDelegate({ userId }: EkonomiArbetslivBroDelegateProps) {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Arbete &amp; logg
        </p>
        <p className="text-xs leading-relaxed text-text-muted">{EKONOMI_TID_LEAD}</p>
      </header>

      {!userId ? (
        <p className="text-sm text-text-dim">Logga in för att öppna Arbetsliv.</p>
      ) : (
        <ul className="space-y-3" aria-label="Länkar till Arbetsliv">
          {ARBETSLIV_LINKS.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.to}>
                <Link
                  to={entry.to}
                  className="group flex items-start gap-3 rounded-xl border border-border/30 bg-surface-3/30 px-4 py-3 transition-colors hover:border-accent/30 hover:bg-surface-3/50"
                >
                  <span className="mt-0.5 rounded-lg border border-accent/20 bg-accent/10 p-2 text-accent">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm text-text">
                      {entry.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 block text-xs text-text-dim">{entry.hint}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[10px] leading-relaxed text-text-dim">
        Vardagsekonomi (transaktioner, kuvert, impuls) stannar i denna hub. Stämpel och ledger
        tillhör Arbetsliv-zonen.
      </p>
    </div>
  );
}
