import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

type HandoffBoxProps = {
  className?: string;
};

/** Lugn handoff Lager 1 → Reality Vault (ingen röd varningsbanner). */
export function HandoffBox({ className = '' }: HandoffBoxProps) {
  return (
    <aside
      className={`journal-handoff ${className}`.trim()}
      role="note"
      aria-label="Rekommendation om formellt bevis"
    >
      <div className="journal-handoff__header">
        <Shield className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="journal-handoff__title">Spara som formellt bevis?</p>
      </div>
      <p className="journal-handoff__body">
        Om du dokumenterar en händelse för att använda som bevis eller stöd i en juridisk process,
        rekommenderar vi att du använder Reality Vault. Där sparas filer med metadata och struktureras
        för myndighetskontakt.
      </p>
      <Link to="/dagbok?tab=bevis" className="journal-handoff__cta btn-pill--ghost">
        Öppna Reality Vault →
      </Link>
    </aside>
  );
}
