import { BookOpen } from 'lucide-react';
import { VALV_KUNSKAP_SILO_HINT } from '../constants/valvEvidenceCopy';

type KunskapsbankHeaderProps = {
  compact?: boolean;
};

/** Kunskapsbank-zon — egen del av Valv (U1 Kunskap-silo, PIN). */
export function KunskapsbankHeader({ compact = false }: KunskapsbankHeaderProps) {
  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <p className="font-display text-sm text-accent">Kunskapsbanken</p>
          <span className="text-[10px] text-text-dim">· Fakta och minne</span>
        </div>
        <p className="px-1 text-[10px] leading-relaxed text-text-dim">{VALV_KUNSKAP_SILO_HINT}</p>
      </div>
    );
  }

  return (
    <div className="elongated-module elongated-module--gold mb-1 flex items-start gap-3 p-4">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-display text-base text-accent">Kunskapsbanken</p>
        <p className="mt-1 text-xs text-text-muted">
          Fakta och minne bakom PIN — separat från bevisvalvet. Ställ en fråga först; öppna
          filarkiv eller Tidshjul vid behov.
        </p>
      </div>
    </div>
  );
}
