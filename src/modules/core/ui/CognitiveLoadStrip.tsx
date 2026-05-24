import { Brain } from 'lucide-react';

type Props = {
  label?: string;
  hint?: string;
};

/** D18 — kognitiv belastning (ett fält i taget). */
export function CognitiveLoadStrip({
  label = 'Ett steg i taget',
  hint = 'Fyll bara det som känns möjligt nu. Resten kan vänta.',
}: Props) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-dim"
      role="status"
    >
      <Brain className="h-3.5 w-3.5 shrink-0 text-accent/70" aria-hidden />
      <span>
        <span className="text-text-muted">{label}</span>
        {hint ? ` — ${hint}` : ''}
      </span>
    </div>
  );
}
