import { CircleDot } from 'lucide-react';

export type EkonomiMikrostegDelegateProps = {
  userId: string;
};

const MIKROSTEG_EXAMPLES = [
  {
    id: 'kvitto',
    title: 'Spara ett kvitto',
    hint: 'Ett papper eller en skärmdump — inget mer just nu.',
  },
  {
    id: 'utgift',
    title: 'Logga en utgift',
    hint: 'Ett belopp och en kort etikett räcker. Växla till Snabbsaldo när du är redo.',
  },
  {
    id: 'paus',
    title: 'Pausa innan köp',
    hint: 'Skriv ner vad du tänker köpa. Vänta tills imorgon innan du bestämmer.',
  },
] as const;

/**
 * Nivå 1 — statiska mikrosteg. Ingen WORM, ingen gamification, inga streaks.
 * Kognitiv avlastning: ett förslag i taget, låg visuell arousal.
 */
export function EkonomiMikrostegDelegate({ userId }: EkonomiMikrostegDelegateProps) {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Ett steg
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Välj ett litet steg under fem minuter. Du behöver inte göra alla — bara ett.
        </p>
      </header>

      {!userId ? (
        <p className="text-sm text-text-muted">Logga in för att fortsätta med ekonomi.</p>
      ) : (
        <ul className="space-y-3" aria-label="Exempel på ekonomiska mikrosteg">
          {MIKROSTEG_EXAMPLES.map((step, index) => (
            <li
              key={step.id}
              className="rounded-xl border border-border/30 bg-surface-3/30 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent"
                  aria-hidden
                >
                  <CircleDot className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">
                    Förslag {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-text">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">{step.hint}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-[10px] uppercase tracking-wider text-text-muted">
        Inga poäng · inga streaks · bara struktur
      </p>
    </div>
  );
}
