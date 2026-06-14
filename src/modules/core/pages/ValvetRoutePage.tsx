import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HubPageShell } from '../layout/HubPageShell';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import { parseVaultTab, type VaultTab } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import {
  parseValvInputModeFromSearch,
  resolveValvInputModeFromVaultTab,
  vaultTabForValvInputMode,
  type ValvInputMode,
} from '@/features/lifeJournal/evidence/vault/supermodule/valvInputModes';

/** Route-silo för `/valvet` — all säkerhetslogik sker i VaultPage. */
export function ValvetRoutePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const vaultTabRaw = searchParams.get('vaultTab');

  const vaultTab: VaultTab = useMemo(() => {
    return parseVaultTab(vaultTabRaw);
  }, [vaultTabRaw]);

  const valvMode: ValvInputMode = useMemo(() => {
    return parseValvInputModeFromSearch(
      searchParams.get('valvMode'),
      searchParams.get('samlaView'),
      vaultTabRaw,
    );
  }, [searchParams, vaultTabRaw]);

  const handleVaultTabChange = (next: VaultTab) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('vaultTab', next);
        params.set('valvMode', resolveValvInputModeFromVaultTab(next));
        params.delete('samlaView');
        return params;
      },
      { replace: true },
    );
  };

  const handleValvModeChange = (mode: ValvInputMode) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('valvMode', mode);
        params.set('vaultTab', vaultTabForValvInputMode(mode, vaultTab));
        params.delete('samlaView');
        return params;
      },
      { replace: true },
    );
  };

  return (
    <HubPageShell
      eyebrow="Arkiv"
      title="Sanningsarkivet"
      lead="Här samlas fakta, mönster och bevis — strukturerat och låst."
      lockViewport
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Valvet"
          hint="Biometri krävs. Välj ett läge i taget — Spara, Granska, Analysera …"
        />
        <main className="mt-2 animate-fade-in">
          <VaultPage
            initialVaultTab={vaultTab}
            initialValvMode={valvMode}
            onVaultTabChange={handleVaultTabChange}
            onValvModeChange={handleValvModeChange}
          />
        </main>
      </div>
    </HubPageShell>
  );
}
