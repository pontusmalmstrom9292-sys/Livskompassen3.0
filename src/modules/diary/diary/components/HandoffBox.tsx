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
        Om du dokumenterar en händelse som du kan behöva visa senare — t.ex. vid vårdnadskonflikt,
        motpart, familjerätt eller myndighet — spara den i Reality Vault. Där blir datum, text och
        bilagor strukturerade som bevis. Dagboken förblir privat och flyttas inte hit automatiskt.
      </p>
      <Link to="/dagbok?tab=bevis" className="journal-handoff__cta btn-pill--ghost">
        Öppna Reality Vault →
      </Link>
    </aside>
  );
}
