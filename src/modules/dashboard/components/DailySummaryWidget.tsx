import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/design-system';

export function DailySummaryWidget() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="dashboard-card relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-4 animate-in fade-in slide-in-from-top-2 transition-[border-color,box-shadow] focus-within:border-accent/45 focus-within:ring-1 focus-within:ring-accent/25">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        aria-label="Stäng sammanfattning"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="mt-0.5 rounded-full bg-accent/20 p-1.5 text-accent">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display-serif text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Dagens Sammanfattning</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Bra jobbat idag. Du har stämplat ut i tid från arbetet, loggat din sömn och hanterat 
            två inkommande händelser med Grey Rock. Kognitiv belastning är låg.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="accent" size="sm">Visa detaljer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
