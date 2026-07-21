import { BentoCard } from '@/shared/ui/BentoCard';
import { PauseCircle } from 'lucide-react';
import { textStyles } from '@/design-system';

/** Visas när barn-PWA är pausad — ingen QR, ingen enhetskoppling. */
export function BarnportenPausedPanel() {
  return (
    <BentoCard glow="blue" className="!p-5">
      <div className="flex items-start gap-3">
        <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-text-dim" aria-hidden />
        <div>
          <p className={textStyles.eyebrow}>Barnporten pausad</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Barn-PWA rullas inte ut just nu. Använd{' '}
            <strong className="font-normal text-text">Familjen → Barnfokus och Livslogg</strong>{' '}
            för observationer — samma WORM-logg, ingen extra kostnad.
          </p>
          <p className="mt-2 text-xs text-text-dim">
            Tekniken finns kvar i appen om ni vill aktivera senare (QR + surfplatta).
          </p>
        </div>
      </div>
    </BentoCard>
  );
}
