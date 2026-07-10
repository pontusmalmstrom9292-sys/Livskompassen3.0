import { Sparkles } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';

export function AutoKategoriseringStub() {
  return (
    <BentoCard 
      glow="blue" 
      title="Auto-Kategorisering (AI)"
      description="Livs-Arkivarien föreslår kuvert automatiskt"
      icon={<Sparkles className="h-4 w-4" />}
    >
      <div className="space-y-3">
        <p className="text-sm text-text-muted">
          Utgifter klassificeras automatiskt till rätt kuvert baserat på din historik.
          Ingen manuell sortering behövs för återkommande transaktioner.
        </p>
        
        <div className="rounded-xl border border-border/40 bg-surface-3/50 p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-text-dim">Ica Maxi (495 kr)</span>
            <span className="text-accent">→ Mat & Hushåll</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-dim">Netflix (109 kr)</span>
            <span className="text-accent">→ Nöjen</span>
          </div>
        </div>

        <Button
          disabled
          variant="ghost"
          className="w-full text-xs opacity-50 cursor-not-allowed"
        >
          Aktivera integration (Kommer snart)
        </Button>
      </div>
    </BentoCard>
  );
}
