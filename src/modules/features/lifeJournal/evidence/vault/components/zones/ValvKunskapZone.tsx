import { useEffect, useState } from 'react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { getKunskapVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultAktorskartaPanel } from '../../../knowledge/components/VaultAktorskartaPanel';
import { VaultKanonDocsPanel } from '../../../knowledge/components/VaultKanonDocsPanel';
import { VaultKunskapsbankPanel } from '../../../knowledge/components/VaultKunskapsbankPanel';
import {
  AKTORSKARTA_VAULT_TAB,
  DOCS_VAULT_TAB,
  KUNSKAP_VAULT_TAB,
  type KunskapVaultTab,
} from '../../utils/vaultTabs';

export type ValvKunskapZoneProps = {
  tab: KunskapVaultTab;
  onTabChange: (tab: KunskapVaultTab) => void;
};

const KUNSKAP_SECTIONS = getKunskapVaultTabBarItems();

function KunskapSectionPanel({ tab }: { tab: KunskapVaultTab }) {
  if (tab === AKTORSKARTA_VAULT_TAB) return <VaultAktorskartaPanel />;
  if (tab === DOCS_VAULT_TAB) return <VaultKanonDocsPanel />;
  return <VaultKunskapsbankPanel />;
}

/** Locked UX — en scroll, tre sektioner (CalmCollapsible) istället för TabBar. */
export function ValvKunskapZone({ tab, onTabChange }: ValvKunskapZoneProps) {
  const [openSections, setOpenSections] = useState<Record<KunskapVaultTab, boolean>>({
    [KUNSKAP_VAULT_TAB]: tab === KUNSKAP_VAULT_TAB,
    [AKTORSKARTA_VAULT_TAB]: tab === AKTORSKARTA_VAULT_TAB,
    [DOCS_VAULT_TAB]: tab === DOCS_VAULT_TAB,
  });

  useEffect(() => {
    setOpenSections((prev) => ({ ...prev, [tab]: true }));
  }, [tab]);

  const handleSectionOpen = (sectionId: KunskapVaultTab, open: boolean) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: open }));
    if (open) onTabChange(sectionId);
  };

  return (
    <HubErrorBoundary
      title="Kunskap kunde inte laddas"
      glow="blue"
      logTag="ValvKunskapZone"
    >
      <div className="space-y-3">
        {KUNSKAP_SECTIONS.map((section) => (
          <CalmCollapsible
            key={section.id}
            title={section.label}
            open={openSections[section.id]}
            onOpenChange={(open) => handleSectionOpen(section.id, open)}
            glow="blue"
            unmountOnHide={section.id !== KUNSKAP_VAULT_TAB}
          >
            <KunskapSectionPanel tab={section.id} />
          </CalmCollapsible>
        ))}
      </div>
    </HubErrorBoundary>
  );
}
