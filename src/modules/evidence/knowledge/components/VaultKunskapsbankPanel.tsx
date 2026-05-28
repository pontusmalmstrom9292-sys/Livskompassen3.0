import { KunskapPage } from '../../../kompis/components/KunskapPage';
import { FamiljenKunskapHubTab } from '../../../family/children/components/familjen/FamiljenKunskapHubTab';
import { useFamiljenShell } from '../../../family/children/hooks/useFamiljenShell';
import { BentoCard } from '../../../core/ui/BentoCard';
import { BookOpen } from 'lucide-react';

/** Samlad Kunskapsbank bakom Valv-PIN — Kunskapsvalv + Familjen-upload (U1 silos oförändrade). */
export function VaultKunskapsbankPanel() {
  const shell = useFamiljenShell();

  return (
    <div className="space-y-4">
      <BentoCard
        title="Kunskapsbank"
        description="Kunskapsvalvet och uppladdning — bakom Valv-PIN"
        icon={<BookOpen className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          Tidshjul, RAG och filer. Kunskap och bevis är separata silos — ingen cross-RAG.
        </p>
      </BentoCard>

      <KunskapPage embedded />

      {shell.user ? (
        <BentoCard title="Familjen — kunskap & upload" description="Scoped sökning per barn">
          <FamiljenKunskapHubTab activeChild={shell.activeChild} />
        </BentoCard>
      ) : null}
    </div>
  );
}
