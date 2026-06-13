import { Lock, ShieldAlert, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar } from '@/core/ui/TabBar';
import {
  getVaultZoneTabBarItems,
} from '@/core/navigation/tabRegistry';
import { useStore } from '@/core/store';
import { useVaultStore } from '@/core/store/useVaultStore';
import { hasVaultGate } from '@/core/auth/sessionService';
import { ensureVaultSessionReady, endVaultSession } from '@/core/security/vaultSessionLifecycle';

import { VaultValvBreadcrumb } from './VaultValvBreadcrumb';
import { ValvSuperModule } from './ValvSuperModule';
import { VaultErrorBoundary } from './VaultErrorBoundary';
import { VaultLockedGate } from '@/core/components/VaultLockedGate';

import {
  KUNSKAP_VAULT_TAB,
  VIT_VAULT_TAB,
  type ValvZone,
  type VaultTab,
  resolveValvZone,
  VALV_ZONE_INGRESS,
} from '../utils/vaultTabs';
import { ValvZoneModulValjare } from './ValvZoneModulValjare';
import { hasSeenValvZoneModulValjare } from '../utils/valvZoneModulValjareStorage';

export type { VaultTab, MainVaultTab, ValvZone } from '../utils/vaultTabs';
export { parseVaultTab } from '../utils/vaultTabs';

type VaultPageProps = {
  embedded?: boolean;
  onClose?: () => void;
  initialVaultTab?: VaultTab;
  onVaultTabChange?: (tab: VaultTab) => void;
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
  onVaultTabChange,
}: VaultPageProps) {
  const navigate = useNavigate();
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const user = useStore((s) => s.user);
  const { loadFirstLogsPage, logs, hasMore: logsHasMore, loadingMore, loadMoreLogs } = useVaultStore();
  
  const [vaultTab, setVaultTabState] = useState<VaultTab>(initialVaultTab);
  const [highlightLogId, setHighlightLogId] = useState<string | null>(null);
  const [showZonePicker, setShowZonePicker] = useState(() => !hasSeenValvZoneModulValjare());
  const [sessionSyncError, setSessionSyncError] = useState<string | null>(null);
  const gateOk = hasVaultGate();
  const valvZone = resolveValvZone(vaultTab);

  const setVaultTab = (next: VaultTab) => {
    setVaultTabState(next);
    onVaultTabChange?.(next);
  };

  useEffect(() => {
    setVaultTabState(initialVaultTab);
  }, [initialVaultTab]);

  const handleCitationClick = (docId: string) => {
    setHighlightLogId(docId);
    setVaultTab('logga');
  };

  const handleBevisConfirmed = async (docId: string) => {
    setHighlightLogId(docId);
    setVaultTab('logga');
    if (user) {
      try {
        await loadFirstLogsPage(user.uid);
      } catch {
        /* best-effort refresh */
      }
    }
  };

  const handleValvZoneChange = (zone: ValvZone) => {
    if (zone === 'samla') setVaultTab('logga');
    else if (zone === 'analysera') setVaultTab('monster');
    else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
    else if (zone === 'vit') setVaultTab(VIT_VAULT_TAB);
    else if (zone === 'exportera') setVaultTab('dossier');
    else setVaultTab('hamn_analys');
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

  if (showZonePicker) {
    return (
      <div className="space-y-4">
        <BentoCard title={embedded ? 'Valv · Baksida' : VAULT_UI_NAME} icon={<Lock className="h-4 w-4" />}>
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className="text-xs text-text-dim">PIN upplåst — välj zon</p>
            <button
              type="button"
              onClick={handleCloseToLayer1}
              className="btn-pill--ghost shrink-0 flex items-center gap-1"
              title="Stäng valv — tillbaka till vardag"
            >
              <X className="h-3 w-3" /> Stäng
            </button>
          </div>
          <ValvZoneModulValjare
            onSelect={(zone) => {
              handleValvZoneChange(zone);
              setShowZonePicker(false);
            }}
            onSkip={() => {
              handleValvZoneChange('samla');
              setShowZonePicker(false);
            }}
          />
        </BentoCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard title={embedded ? 'Valv · Baksida' : VAULT_UI_NAME} icon={<Lock className="h-4 w-4" />}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <VaultValvBreadcrumb zone={valvZone} vaultTab={vaultTab} />
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setShowZonePicker(true)}
              className="btn-pill--ghost text-xs"
              title="Visa zonväljare igen"
            >
              Byt zon
            </button>
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
        {/* Zon-TabBar — underflikar per zon via get*VaultTabBarItems (samma ordning som getMainVaultTabBarItems / drawer). */}
        <TabBar<ValvZone>
          size="compact"
          tabs={getVaultZoneTabBarItems()}
          active={valvZone}
          onChange={handleValvZoneChange}
        />
        <p className="mb-3 mt-2 text-sm text-text-muted" key={valvZone}>
          {VALV_ZONE_INGRESS[valvZone]}
        </p>
        {sessionSyncError ? (
          <p className="mb-3 rounded-xl border border-accent/30 bg-surface-2/80 px-3 py-2 text-xs text-text-muted">
            {sessionSyncError}
          </p>
        ) : null}
      </BentoCard>

      <ValvSuperModule
        variant={valvZone}
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
