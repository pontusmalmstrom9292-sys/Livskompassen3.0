import { ButtonLink } from '@/design-system';
import { BookOpen } from 'lucide-react';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { HAMN_TAKTIK_LEXIKON_LEAD } from '../hamnCopy';
import type { HamnTaktikSignal } from '../lib/hamnTaktikWire';

type Props = {
  signal?: HamnTaktikSignal | null;
  className?: string;
};

/** Bro till Kunskapsbank (PIN) — metod/referens, inte BIFF-coaching. */
export function HamnTaktikLexikonBro({ signal, className = '' }: Props) {
  return (
    <div
      className={[
        'rounded-xl border border-border/30 bg-surface-2/50 px-3 py-2.5 text-xs text-text-muted',
        className,
      ].join(' ')}
    >
      {signal ? (
        <p className="text-text-muted">
          <span className="text-accent/90">{signal.label}</span> — {signal.hint}
        </p>
      ) : (
        <p className="text-text-muted">{HAMN_TAKTIK_LEXIKON_LEAD}</p>
      )}
      <ButtonLink
        to={vaultDrawerPath('kunskapsbank')}
        variant="ghost"
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 px-2 text-[11px]"
      >
        <BookOpen className="h-3.5 w-3.5 text-accent/80" aria-hidden />
        Taktik-lexikon (Valv · PIN)
      </ButtonLink>
    </div>
  );
}
