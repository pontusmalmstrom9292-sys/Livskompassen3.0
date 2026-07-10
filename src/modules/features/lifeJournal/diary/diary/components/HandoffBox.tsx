import { ButtonLink } from '@/design-system';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { Shield } from 'lucide-react';

const HANDOFF_PREFILL_MAX = 4000;

type HandoffBoxProps = {
  className?: string;
  /** Dagbok/Hamn-text som följer med till Valv-formuläret (Zero Footprint i state). */
  sourceText?: string;
};

/** Lugn handoff Lager 1 → Reality Vault (ingen röd varningsbanner). */
export function HandoffBox({ className = '', sourceText }: HandoffBoxProps) {
  const trimmed = sourceText?.trim().slice(0, HANDOFF_PREFILL_MAX);
  const valvTarget = {
    pathname: NAV_PATHS.VALVET,
    search: '?vaultTab=logga',
  };
  const valvState = trimmed ? { vaultHandoffText: trimmed } : undefined;

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
        motpart, familjerätt eller myndighet — spara den i {VAULT_UI_NAME.toLowerCase()}et. Där blir datum, text och
        bilagor strukturerade som bevis. Dagboken förblir privat och flyttas inte hit automatiskt.
      </p>
      <ButtonLink to={valvTarget} state={valvState} variant="ghost" className="journal-handoff__cta">
        Öppna {VAULT_UI_NAME} →
      </ButtonLink>
    </aside>
  );
}
