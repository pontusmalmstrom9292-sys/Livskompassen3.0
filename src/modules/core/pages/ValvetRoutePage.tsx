import { lazy, Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { ModuleShell } from '../layout/ModuleShell';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '../navigation/navTruth';
import { useMinWidthSm } from '../hooks/useMinWidthSm';
import {
  LEGACY_INBOX_VAULT_TAB,
  type VaultTab,
} from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import {
  canonicalValvRoute,
  resolveValvInputModeFromVaultTab,
  vaultTabForValvInputMode,
  type ValvInputMode,
} from '@/features/lifeJournal/evidence/vault/supermodule/valvInputModes';

const VaultPage = lazy(() =>
  import('@/features/lifeJournal/evidence/vault/components/VaultPage').then((m) => ({
    default: m.VaultPage,
  })),
);

/** Route-silo för `/valvet` — all säkerhetslogik sker i VaultPage. */
export function ValvetRoutePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const desktopHubLock = useMinWidthSm();
  
  const valvModeRaw = searchParams.get('valvMode');
  const vaultTabRaw = searchParams.get('vaultTab');
  const samlaViewRaw = searchParams.get('samlaView');

  const { vaultTab: canonTab, valvMode: canonMode } = useMemo(() => {
    return canonicalValvRoute(valvModeRaw, vaultTabRaw, samlaViewRaw);
  }, [valvModeRaw, vaultTabRaw, samlaViewRaw]);

  useEffect(() => {
    const needsSync =
      samlaViewRaw != null ||
      vaultTabRaw === LEGACY_INBOX_VAULT_TAB ||
      valvModeRaw !== canonMode ||
      vaultTabRaw !== canonTab;

    if (!needsSync) return;

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('valvMode', canonMode);
        params.set('vaultTab', canonTab);
        params.delete('samlaView');
        return params;
      },
      { replace: true },
    );
  }, [valvModeRaw, vaultTabRaw, samlaViewRaw, canonMode, canonTab, setSearchParams]);

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
        params.set('vaultTab', vaultTabForValvInputMode(mode, canonTab));
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
        lockViewport
        fitViewport
        cognitiveStrip={false}
        className={clsx(
          'valvet-route-page',
          desktopHubLock && 'valvet-route-page--desktop',
        )}
      >
        <main className="animate-fade-in">
          <Suspense fallback={<div className="p-4 text-center text-sm text-text-muted">Laddar valv...</div>}>
            <VaultPage
              vaultTab={canonTab}
              valvMode={canonMode}
              onVaultTabChange={handleVaultTabChange}
              onValvModeChange={handleValvModeChange}
            />
          </Suspense>
        </main>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
