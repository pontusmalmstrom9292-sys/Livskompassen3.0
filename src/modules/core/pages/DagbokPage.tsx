import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Search, FileText, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { hasVaultGate } from '../auth/sessionService';

import { HubPageShell } from '../layout/HubPageShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import { parseVaultTab, type VaultTab } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import { DagbokPage as JournalDagbokPage } from '@/features/lifeJournal/diary/diary/components/DagbokPage';
import { SpeglingsSystem } from '@/features/lifeJournal/diary/mirror';

type ValvTabId = 'bevis' | 'monster' | 'dossier';

const VALV_OPTIONS: DropdownItem<ValvTabId>[] = [
  { id: 'bevis', label: 'Sök i Arkivet', icon: <Search className="h-4 w-4" /> },
  { id: 'monster', label: 'Mönster-analys', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'dossier', label: 'Dossier-export', icon: <FileText className="h-4 w-4" /> },
];

const VALID_VALV_TABS = new Set<ValvTabId>(VALV_OPTIONS.map((t) => t.id));

const VALV_TAB_TO_VAULT: Record<ValvTabId, VaultTab> = {
  bevis: 'sok',
  monster: 'monster',
  dossier: 'dossier',
};

function resolveValvTabId(raw: string | null): ValvTabId {
  if (raw && VALID_VALV_TABS.has(raw as ValvTabId)) return raw as ValvTabId;
  return 'bevis';
}

type HjartatLayerTab = 'reflektion' | 'speglar' | ValvTabId;

function resolveLayerTab(raw: string | null): HjartatLayerTab {
  if (raw === 'reflektion' || raw === 'speglar') return raw;
  return resolveValvTabId(raw);
}

export function DagbokPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const gateOk = hasVaultGate() || isVaultUnlocked;

  const layerTab = resolveLayerTab(searchParams.get('tab'));
  const activeValvTab = layerTab === 'reflektion' || layerTab === 'speglar' ? 'bevis' : layerTab;

  const vaultTab: VaultTab = useMemo(() => {
    const fromUrl = searchParams.get('vaultTab');
    if (fromUrl) return parseVaultTab(fromUrl);
    return VALV_TAB_TO_VAULT[activeValvTab];
  }, [searchParams, activeValvTab]);

  const handleValvTabChange = (id: ValvTabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', id);
        next.delete('vaultTab');
        return next;
      },
      { replace: true },
    );
  };

  const handleVaultTabChange = (next: VaultTab) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('tab', 'bevis');
        params.set('vaultTab', next);
        return params;
      },
      { replace: true },
    );
  };

  if (layerTab === 'reflektion') {
    return (
      <HubPageShell
        eyebrow="ZON 1 — Hjärtat"
        title="Dagbok"
        lead="Reflektion och daglig logg — utanför Valvet."
      >
        <div className="mx-auto max-w-5xl space-y-4 pb-12">
          <JournalDagbokPage embedded />
        </div>
      </HubPageShell>
    );
  }

  if (layerTab === 'speglar') {
    return (
      <HubPageShell
        eyebrow="ZON 1 — Hjärtat"
        title="Speglar"
        lead="Validering utan fix — känsla och fakta hålls isär."
      >
        <div className="mx-auto max-w-5xl space-y-4 pb-12">
          <SpeglingsSystem embedded />
        </div>
      </HubPageShell>
    );
  }

  if (!gateOk) {
    return (
      <div className="flex h-[min(70vh,32rem)] flex-col items-center justify-center p-6 text-center">
        <Shield className="mb-4 h-16 w-16 text-indigo-500/20" aria-hidden />
        <h2 className="font-display-serif text-xl text-text">Valvet är låst</h2>
        <p className="mt-2 max-w-sm text-sm text-text-muted">
          Håll Dagbok-ikonen i bottenmenyn i 3 sekunder (Fyren) och verifiera med fingeravtryck
          eller Face ID. Direktlänk räcker inte.
        </p>
        <p className="mt-4 text-xs text-text-dim">
          Dagbok utan Valv:{' '}
          <button
            type="button"
            className="text-accent underline-offset-2 hover:underline"
            onClick={() =>
              setSearchParams({ tab: 'reflektion' }, { replace: true })
            }
          >
            Öppna reflektion
          </button>
        </p>
      </div>
    );
  }

  return (
    <HubPageShell
      eyebrow="ZON 4 — Verklighetsvalvet"
      title="Sanningsarkivet"
      lead="Här vilar fakta, mönster och bevis. Inga känslor, bara den dokumenterade sanningen."
      lockViewport
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Valvet är öppet"
          hint="Systemet är nu i analytiskt läge. Använd rullgardinen för att navigera i bevisen."
        />

        <div className="py-2">
          <HubDropdownNav<ValvTabId>
            items={VALV_OPTIONS}
            activeId={activeValvTab}
            onChange={handleValvTabChange}
            glowColor="blue"
            ariaLabel="Välj vy i Verklighetsvalvet"
          />
        </div>

        <main className="mt-2 animate-fade-in">
          <VaultPage
            embedded
            initialVaultTab={vaultTab}
            onVaultTabChange={handleVaultTabChange}
          />
        </main>
      </div>
    </HubPageShell>
  );
}
