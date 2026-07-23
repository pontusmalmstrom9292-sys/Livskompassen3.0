import { BarChart3 } from 'lucide-react';
import { ButtonLink } from '@/design-system';
import { vaultDrawerPath } from '@/core/navigation/navTruth';

/** Efter logg eller vid mönster-nyckelord — länk till Mönster (ingen auto-analys). */
export function VaultPatternHandoff({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`journal-handoff ${className}`.trim()}
      role="note"
      aria-label="Förslag om mönsteranalys"
    >
      <div className="journal-handoff__header">
        <BarChart3 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="journal-handoff__title">Leta mönster i bevisen?</p>
      </div>
      <p className="journal-handoff__body">
        När du har flera poster kan Mönster-fliken visa upprepningar över tid. Inget körs automatiskt.
      </p>
      <ButtonLink to={vaultDrawerPath('monster')} variant="ghost" className="journal-handoff__cta min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
        Öppna Mönster →
      </ButtonLink>
    </aside>
  );
}
