import { clsx } from 'clsx';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useCapacityScore } from '../store/useCapacityGate';
import { useStore } from '../store';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function HjartatHero() {
  const capacityScore = useCapacityScore();
  const user = useStore((s) => s.user);
  const [stepDone, setStepDone] = useState(false);

  const isLowCapacity = capacityScore > 0 && capacityScore < 50;
  const userName = user?.displayName?.split(' ')[0] || 'Pontus';

  const greeting = 'God morgon ' + userName;
  const capacityMessage = isLowCapacity
    ? 'Idag verkar vara en låg-energidag.'
    : 'Idag verkar vara en stabil dag.';

  return (
    <div className="hjartat-hero space-y-6 pt-4 pb-12">
      {/* Hälsning */}
      <div className="px-1">
        <h1 className="text-3xl font-display text-text-strong font-bold tracking-tight">
          {greeting}
        </h1>
        <p className="text-text-dim mt-2 text-lg">{capacityMessage}</p>
      </div>

      {/* Dagens fokus */}
      <div className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-text-dim px-1 font-semibold">
          Dagens fokus
        </h2>
        <BentoCard glow="gold" className="py-4">
          <p className="text-accent text-lg">Lämning 08:15</p>
        </BentoCard>
      </div>

      {/* Nästa lilla steg */}
      {!stepDone && (
        <div className="space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-text-dim px-1 font-semibold">
            Nästa lilla steg
          </h2>
          <BentoCard glow="blue" className="py-4 flex flex-row items-center justify-between gap-4 border-accent/40">
            <p className="text-text-strong text-lg flex-1">Lägg fram barnens kläder</p>
            <button 
              onClick={() => setStepDone(true)}
              className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent px-6 py-3 rounded-lg font-semibold transition-colors shrink-0"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <CheckCircle2 className="w-5 h-5" />
              Gör nu
            </button>
          </BentoCard>
        </div>
      )}

      {/* Sammanfattningar */}
      <div className="space-y-4 pt-4 border-t border-border/30">
        <div className="px-1">
          <h3 className="font-display font-semibold text-accent text-sm uppercase tracking-wider mb-1">
            Familjen
          </h3>
          <p className="text-text-dim">Leo har fotboll idag</p>
        </div>

        <div className="px-1">
          <h3 className="font-display font-semibold text-accent text-sm uppercase tracking-wider mb-1">
            Vardagen
          </h3>
          <p className="text-text-dim">2 saker väntar</p>
        </div>
      </div>
    </div>
  );
}
