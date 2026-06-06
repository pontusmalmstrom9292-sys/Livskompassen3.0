import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HubPageShell } from '../layout/HubPageShell';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import { parseVaultTab, type VaultTab } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';

/** Route-silo för `/valvet` — all säkerhetslogik sker i VaultPage. */
export function ValvetRoutePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const vaultTab: VaultTab = useMemo(() => {
    return parseVaultTab(searchParams.get('vaultTab'));
  }, [searchParams]);

  const handleVaultTabChange = (next: VaultTab) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('vaultTab', next);
        if (next !== 'logga') {
          params.delete('samlaView');
        }
        return params;
      },
      { replace: true },
    );
  };

  return (
    <HubPageShell
      eyebrow="ZON 4 — Verklighetsvalvet"
      title="Sanningsarkivet"
      lead="Här samlas fakta, mönster och bevis — strukturerat och låst."
      lockViewport
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Valvet"
          hint="Biometri krävs. Använd zonflikarna för att navigera i arkivet."
        />
        <main className="mt-2 animate-fade-in">
          <VaultPage initialVaultTab={vaultTab} onVaultTabChange={handleVaultTabChange} />
        </main>
      </div>
    </HubPageShell>
  );
}
