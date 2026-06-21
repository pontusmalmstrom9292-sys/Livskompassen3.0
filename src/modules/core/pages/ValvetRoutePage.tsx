import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { ModuleShell } from '../layout/ModuleShell';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '../navigation/navTruth';
import { useMinWidthSm } from '../hooks/useMinWidthSm';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import {
  LEGACY_INBOX_VAULT_TAB,
  parseVaultTab,
  type VaultTab,
} from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import {
  canonicalValvRoute,
  parseValvInputModeFromSearch,
  resolveValvInputModeFromVaultTab,
  vaultTabForValvInputMode,
  type ValvInputMode,
} from '@/features/lifeJournal/evidence/vault/supermodule/valvInputModes';

/** Route-silo för `/valvet` — all säkerhetslogik sker i VaultPage. */
export function ValvetRoutePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const desktopHubLock = useMinWidthSm();
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

  useEffect(() => {
    const valvModeRaw = searchParams.get('valvMode');
    const samlaView = searchParams.get('samlaView');
    const tabRaw = searchParams.get('vaultTab');
    const parsedTab = parseVaultTab(
      tabRaw === LEGACY_INBOX_VAULT_TAB ? null : tabRaw,
    );
    const parsedMode = parseValvInputModeFromSearch(valvModeRaw, samlaView, tabRaw);
    const { vaultTab: canonTab, valvMode: canonMode } = canonicalValvRoute(parsedTab, parsedMode);

    const needsSync =
      samlaView != null ||
      tabRaw === LEGACY_INBOX_VAULT_TAB ||
      valvModeRaw !== canonMode ||
      tabRaw !== canonTab;

    if (!needsSync) return;

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('vaultTab', canonTab);
        params.set('valvMode', canonMode);
        params.delete('samlaView');
        return params;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);

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
    <HubErrorBoundary
      title="Valvet kunde inte laddas"
      glow="blue"
      backTo={NAV_PATHS.HJARTAT}
      backLabel="Till Hjärtat"
      logTag="ValvetRoutePage"
    >
      <ModuleShell
        eyebrow="Valv"
        title="Sanningsarkiv"
        lead="Bevis, mönster och kunskap — PIN-skyddat."
        depth={false}
        lockViewport={desktopHubLock}
        fitViewport={desktopHubLock}
        cognitiveStrip={false}
        className={clsx(
          'valvet-route-page',
          desktopHubLock && 'valvet-route-page--desktop',
        )}
      >
        <main className="animate-fade-in">
          <VaultPage
            initialVaultTab={vaultTab}
            initialValvMode={valvMode}
            onVaultTabChange={handleVaultTabChange}
            onValvModeChange={handleValvModeChange}
          />
        </main>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
