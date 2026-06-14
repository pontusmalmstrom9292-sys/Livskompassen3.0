import { Lock, ShieldAlert, X, Settings } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { useVaultStore } from '@/core/store/useVaultStore';
import { hasVaultGate } from '@/core/auth/sessionService';
import { ensureVaultSessionReady, endVaultSession } from '@/core/security/vaultSessionLifecycle';

import { VaultValvBreadcrumb } from './VaultValvBreadcrumb';
import { VaultErrorBoundary } from './VaultErrorBoundary';
import { VaultLockedGate } from '@/core/components/VaultLockedGate';
import { ValvInputSuperModule } from '../supermodule/ValvInputSuperModule';
import {
  type ValvInputMode,
  resolveValvInputModeFromVaultTab,
  valvInputModeDef,
  valvModeMatchesVaultTab,
  vaultTabForValvInputMode,
} from '../supermodule/valvInputModes';
import { resolveValvZone, type VaultTab } from '../utils/vaultTabs';

export type { VaultTab, MainVaultTab, ValvZone } from '../utils/vaultTabs';
export { parseVaultTab } from '../utils/vaultTabs';

type VaultPageProps = {
  embedded?: boolean;
  onClose?: () => void;
  initialVaultTab?: VaultTab;
  initialValvMode?: ValvInputMode;
  onVaultTabChange?: (tab: VaultTab) => void;
  onValvModeChange?: (mode: ValvInputMode) => void;
};

export function VaultPage(props: VaultPageProps) {
  return (
    <VaultErrorBoundary>
      <VaultPageInner {...props} />
    </VaultErrorBoundary>
  );
}

function VaultPageInner({
  embedded = false,
  onClose,
  initialVaultTab = 'logga',
  initialValvMode = 'spara',
  onVaultTabChange,
  onValvModeChange,
}: VaultPageProps) {
  const navigate = useNavigate();
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const user = useStore((s) => s.user);
  const { loadFirstLogsPage, logs, hasMore: logsHasMore, loadingMore, loadMoreLogs } = useVaultStore();

  const [vaultTab, setVaultTabState] = useState<VaultTab>(initialVaultTab);
  const [valvMode, setValvModeState] = useState<ValvInputMode>(initialValvMode);
  const [highlightLogId, setHighlightLogId] = useState<string | null>(null);
  const [sessionSyncError, setSessionSyncError] = useState<string | null>(null);
  const gateOk = hasVaultGate();
  const valvZone = resolveValvZone(vaultTab);

  const setVaultTab = useCallback(
    (next: VaultTab) => {
      setVaultTabState(next);
      onVaultTabChange?.(next);
      setValvModeState((currentMode) => {
        if (currentMode === 'granska') return currentMode;
        const derived = resolveValvInputModeFromVaultTab(next);
        if (derived !== currentMode) {
          onValvModeChange?.(derived);
          return derived;
        }
        return currentMode;
      });
    },
    [onVaultTabChange, onValvModeChange],
  );

  const setValvMode = useCallback(
    (mode: ValvInputMode) => {
      setValvModeState(mode);
      onValvModeChange?.(mode);
      const nextTab = vaultTabForValvInputMode(mode, vaultTab);
      if (nextTab !== vaultTab) {
        setVaultTabState(nextTab);
        onVaultTabChange?.(nextTab);
      }
    },
    [onValvModeChange, onVaultTabChange, vaultTab],
  );

  useEffect(() => {
    setVaultTabState(initialVaultTab);

    let nextMode = initialValvMode;
    if (!valvModeMatchesVaultTab(initialValvMode, initialVaultTab)) {
      nextMode = resolveValvInputModeFromVaultTab(initialVaultTab);
    }
    setValvModeState(nextMode);

    if (nextMode !== initialValvMode) {
      onValvModeChange?.(nextMode);
    }
    const syncedTab = vaultTabForValvInputMode(nextMode, initialVaultTab);
    if (syncedTab !== initialVaultTab) {
      setVaultTabState(syncedTab);
      onVaultTabChange?.(syncedTab);
    }
  }, [initialVaultTab, initialValvMode, onValvModeChange, onVaultTabChange]);

  const handleCitationClick = (docId: string) => {
    setHighlightLogId(docId);
    setValvMode('spara');
    setVaultTab('logga');
  };

  const handleBevisConfirmed = async (docId: string) => {
    setHighlightLogId(docId);
    setValvMode('spara');
    setVaultTab('logga');
    if (user) {
      try {
        await loadFirstLogsPage(user.uid);
      } catch {
        /* best-effort refresh */
      }
    }
  };

  useEffect(() => {
    if (!gateOk) {
      setVaultUnlocked(false);
    }
  }, [gateOk, setVaultUnlocked]);

  useEffect(() => {
    if (!gateOk || !user) return;
    setVaultUnlocked(true);
    setSessionSyncError(null);
    void ensureVaultSessionReady().then((ok) => {
      if (!ok) {
        setSessionSyncError('Valv-session kunde inte synkas. Försök låsa upp igen via Fyren.');
      }
    });
  }, [gateOk, user, setVaultUnlocked]);

  useEffect(() => {
    if (gateOk && user) {
      void loadFirstLogsPage(user.uid);
    }
  }, [gateOk, user, loadFirstLogsPage]);

  useEffect(() => {
    if (!highlightLogId || logs.some((l) => l.id === highlightLogId)) return;
    if (!logsHasMore || loadingMore) return;
    if (user) {
      void loadMoreLogs(user.uid);
    }
  }, [highlightLogId, logs, logsHasMore, loadingMore, loadMoreLogs, user]);

  const handleCloseToLayer1 = () => {
    setVaultTab('logga');
    void endVaultSession().finally(() => {
      if (embedded && onClose) {
        onClose();
      } else {
        navigate(NAV_PATHS.HJARTAT);
      }
    });
  };

  if (!gateOk) {
    return (
      <BentoCard
        title={embedded ? 'Valv · Baksida' : VAULT_UI_NAME}
        description="Skyddad zon — biometri krävs"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <VaultLockedGate variant="card" />
      </BentoCard>
    );
  }

  if (!user) {
    return (
      <BentoCard title={VAULT_UI_NAME} icon={<Lock className="h-4 w-4" />}>
        <p className="text-sm text-text-dim">Ansluter till valvet…</p>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2 px-1">
        <VaultValvBreadcrumb zone={valvZone} vaultTab={vaultTab} />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/valvet/installningar')}
            className="btn-pill--ghost flex items-center gap-1"
            title="Valv-inställningar"
          >
            <Settings className="h-3 w-3" /> Inställningar
          </button>
          <button
            type="button"
            onClick={handleCloseToLayer1}
            className="btn-pill--ghost flex items-center gap-1"
            title="Stäng valv — tillbaka till vardag"
          >
            <X className="h-3 w-3" /> Stäng
          </button>
        </div>
      </div>

      {sessionSyncError ? (
        <p className="rounded-xl border border-accent/30 bg-surface-2/80 px-3 py-2 text-xs text-text-muted">
          {sessionSyncError}
        </p>
      ) : null}

      <p className="px-1 text-sm text-text-muted">{valvInputModeDef(valvMode).description}</p>

      <ValvInputSuperModule
        activeMode={valvMode}
        onModeChange={setValvMode}
        vaultTab={vaultTab}
        userId={user.uid}
        gateOk={gateOk}
        highlightLogId={highlightLogId}
        onBevisConfirmed={handleBevisConfirmed}
        onCitationClick={handleCitationClick}
        onVaultTabChange={setVaultTab}
      />
    </div>
  );
}
