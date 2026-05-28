import { useState } from 'react';
import { KunskapPage } from '../../kompis/components/KunskapPage';
import { FamiljenKunskapHubTab } from '../../../family/children/components/familjen/FamiljenKunskapHubTab';
import { useFamiljenShell } from '../../../family/children/hooks/useFamiljenShell';
import { BentoCard } from '../../../core/ui/BentoCard';
import { KunskapsbankHeader } from '../../vault/components/KunskapsbankHeader';

/** Samlad Kunskapsbank bakom Valv-PIN — Kunskapsvalv + Familjen-upload (U1 silos oförändrade). */
export function VaultKunskapsbankPanel() {
  const shell = useFamiljenShell();
  const [focusKampsparId, setFocusKampsparId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <KunskapsbankHeader />

      <KunskapPage
        embedded
        focusKampsparId={focusKampsparId}
        onFocusKampsparConsumed={() => setFocusKampsparId(null)}
      />

      {shell.user ? (
        <BentoCard title="Familjen — kunskap & upload" description="Scoped sökning per barn">
          <FamiljenKunskapHubTab
            activeChild={shell.activeChild}
            onKampsparCitationClick={setFocusKampsparId}
          />
        </BentoCard>
      ) : null}
    </div>
  );
}
