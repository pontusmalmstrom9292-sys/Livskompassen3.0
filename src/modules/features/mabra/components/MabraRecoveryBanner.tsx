import { LifeBuoy, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { textStyles } from '@/design-system';
import { useStore } from '@/core/store';
import { useDrogfrihetCounter } from '@/features/dailyLife/drogfrihet/hooks/useDrogfrihetCounter';
import { RecoveryUrgeSosModule } from './RecoveryUrgeSosModule';

/** Statisk bank — ingen LLM/RAG (Kat 8, M3.0). */
const RECOVERY_BANNER_QUOTES = [
  'Varje dag är en seger.',
  'Du bygger din framtid idag.',
  'Styrka är att välja sig själv.',
  'Ett steg i taget räcker.',
  'Du behöver inte bevisa något för någon annan.',
] as const;

function pickQuote(dayCount: number): string {
  const index = dayCount % RECOVERY_BANNER_QUOTES.length;
  return RECOVERY_BANNER_QUOTES[index] ?? RECOVERY_BANNER_QUOTES[0];
}

/** Kat 8 — diskret motivationsbanner på /mabra (Obsidian Calm). */
export function MabraRecoveryBanner() {
  const uid = useStore((s) => s.user?.uid);
  const counter = useDrogfrihetCounter(uid);
  const [sosOpen, setSosOpen] = useState(false);

  const quote = useMemo(
    () => (counter.dayCount > 0 ? pickQuote(counter.dayCount) : ''),
    [counter.dayCount],
  );

  if (!counter.started || counter.dayCount <= 0) {
    return null;
  }

  const dayLabel = counter.dayCount === 1 ? 'dag' : 'dagar';

  return (
    <>
    <section
      aria-label="Drogfrihet — dagräknare"
      className="relative overflow-hidden rounded-2xl border-[0.5px] border-border bg-gradient-to-br from-surface-2 via-surface to-surface-2 p-4 sm:p-5"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/[0.06] blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className={`flex items-center gap-2 ${textStyles.eyebrow}`}>
            <Sparkles className="h-3 w-3 shrink-0 text-accent/80" strokeWidth={1.5} aria-hidden />
            Återhämtning
          </p>
          <p className="font-display text-base leading-snug text-text sm:text-lg text-wrap-pretty">{quote}</p>
          {counter.startDateKey ? (
            <p className="text-[11px] text-text-dim">Sedan {counter.startDateKey}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end sm:text-right">
          <button
            type="button"
            onClick={() => setSosOpen(true)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-[0.5px] border-border/70 bg-surface-3/40 px-3 text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:border-accent/35 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            aria-label="Öppna akut stöd — andning och jordning"
          >
            <LifeBuoy className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} aria-hidden />
            Hjälp
          </button>
          <div>
            <p className={textStyles.eyebrow}>
              Drogfrihet
            </p>
            <p className="mt-1 font-display text-3xl tabular-nums leading-none text-accent sm:text-4xl">
              {counter.dayCount}
              <span className="ml-2 text-sm font-sans font-normal text-text-muted">{dayLabel}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
    {sosOpen ? <RecoveryUrgeSosModule uid={uid} onClose={() => setSosOpen(false)} /> : null}
    </>
  );
}
