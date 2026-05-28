import { BookOpen } from 'lucide-react';

/** Kunskapsbank-zon — egen del av Valv (U1 Kunskap-silo, PIN). */
export function KunskapsbankHeader() {
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
