import { Sparkles } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';

export function MabraPage() {
  return (
    <div className="space-y-6">
      <BentoCard
        title="Måbra-sidan"
        icon={<Sparkles className="h-4 w-4" />}
        description="Proaktivt självarbete — KBT, värderingar, små vanor"
      >
        <p className="mb-4 text-sm text-text-muted">
          En trygg plats för dig — inte mot någon annan. Ett steg i taget.
        </p>
        <EmptyState message="Övningsbibliotek kommer här efter Mabra-SPEC. Kör prompten i docs/specs/ai-prompts-moduler-master.md och ladda upp spec till incoming/." />
      </BentoCard>
    </div>
  );
}
