import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function DailySummaryWidget() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-4 animate-in fade-in slide-in-from-top-2">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 p-1 text-text-dim hover:text-text transition-colors"
        aria-label="Stäng sammanfattning"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="mt-0.5 rounded-full bg-accent/20 p-1.5 text-accent">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text">Dagens Sammanfattning</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Bra jobbat idag. Du har stämplat ut i tid från arbetet, loggat din sömn och hanterat 
            två inkommande händelser med Grey Rock. Kognitiv belastning är låg.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="btn-pill--accent text-[11px] px-3 py-1">Visa detaljer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
