const VALIDATION_COPY = [
  'Du är en kapabel och ansvarsfull pappa — även när kroppen är trött.',
  'Kognitiv trötthet efter långvarig stress är en biologisk reaktion, inte ett personligt misslyckande.',
  'Ett steg i taget räcker. Du behöver inte försvara din verklighet mot varje bete.',
] as const;

function pickCopy(): string {
  const day = new Date().getDate();
  return VALIDATION_COPY[day % VALIDATION_COPY.length];
}

/** F-06 — lågaffektiv validering, statisk rotation per dag. */
export function ValidationReminder() {
  return (
    <aside
      className="validation-reminder glass-card p-4 border-l-2 border-accent/30"
      aria-label="Påminnelse"
    >
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Påminnelse</p>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{pickCopy()}</p>
    </aside>
  );
}
