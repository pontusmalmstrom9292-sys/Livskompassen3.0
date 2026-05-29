import { BookOpen } from 'lucide-react';

type KunskapsbankHeaderProps = {
  compact?: boolean;
};

/** Kunskapsbank-zon — egen del av Valv (U1 Kunskap-silo, PIN). */
export function KunskapsbankHeader({ compact = false }: KunskapsbankHeaderProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="font-display text-sm text-accent">Kunskapsbanken</p>
        <span className="text-[10px] text-text-dim">· Minne · U1 silo</span>
      </div>
    );
  }

  return (
    <div className="elongated-module elongated-module--gold mb-4 flex items-start gap-3 p-4">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-display text-base text-accent">Kunskapsbanken</p>
        <p className="mt-1 text-xs text-text-muted">
          Tidshjul, RAG och uppladdning — separat från Pansaret. Ingen cross-RAG till bevisvalvet.
        </p>
      </div>
    </div>
  );
}
