import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
import { textStyles } from '@/design-system';

/**
 * Fas 15 I3 — minimal inkast via G10 (ingen dublett av BarnfokusFraganPanel).
 * sourceModule `familjen` → heuristik barnen → children_logs efter HITL.
 */
export function FamiljenInkastDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const user = shell.user;

  if (!user) {
    return (
      <p className="p-4 text-center text-sm text-text-muted">
        Logga in för att använda inkast med granskning.
      </p>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <header className="mb-4 space-y-1">
        <p className={textStyles.eyebrow}>Inkast & granskningskö</p>
        <p className="text-xs text-text-muted">
          Mata in barnobservation snabbt. AI föreslår silo — du granskar alltid innan spar i
          barnloggar. Ingen auto-promote till Valv.
        </p>
      </header>

      <CaptureSuperModule variant="familjen" compact onSaved={onSaved} />
    </div>
  );
}
