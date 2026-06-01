import { Shield } from 'lucide-react';

/** D16 — Pansaret-rubrik (Mönster-flik). */
export function PansaretHeader() {
  return (
    <div className="elongated-module elongated-module--gold mb-4 flex items-start gap-3 p-4">
      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-display text-base text-accent">Det Digitala Pansaret</p>
        <p className="mt-1 text-xs text-text-muted">
          Frekvens och mönster från dina låsta poster — deterministiskt, inte gissning.
        </p>
      </div>
    </div>
  );
}
