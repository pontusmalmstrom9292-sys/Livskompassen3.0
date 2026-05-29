import { Lock, ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { PinGate } from '../../../core/ui/PinGate';
import { TabBar } from '../../../core/ui/TabBar';
import {
  getAnalyseraVaultTabBarItems,
  getForensicVaultTabBarItems,
  getKunskapVaultTabBarItems,
  getSamlaVaultTabBarItems,
  getVaultZoneTabBarItems,
} from '../../../core/navigation/tabRegistry';
import { useStore } from '../../../core/store';
import { hasVaultGate, clearVaultGate } from '../../../core/auth/sessionService';
import { saveVaultLog, getVaultLogs } from '../../../core/firebase/firestore';
import { OfflineWriteBlockedError } from '../../../core/firebase/offlineWritePolicy';
import type { VaultLog } from '../../../core/types/firestore';
import { VaultLogList } from './VaultLogList';
import { VaultSamlaHub } from './VaultSamlaHub';
import { ValvChatPanel } from '../../../evidence/vaultChat';
import { DossierPage } from '../dossier';
import { VaultMonsterPanel } from './VaultMonsterPanel';
import { VaultOrkesterPanel } from './VaultOrkesterPanel';
import { PansaretHeader } from './PansaretHeader';
import { VaultKunskapsbankPanel } from '../../knowledge/components/VaultKunskapsbankPanel';
import { VaultAktorskartaPanel } from '../../knowledge/components/VaultAktorskartaPanel';
import { VaultForensicPanel } from './VaultForensicPanel';
import { VaultValvBreadcrumb } from './VaultValvBreadcrumb';
import type { VaultLogInput } from '../types/vaultEntry';
import {
  KUNSKAP_VAULT_TAB,
  type AnalyseraVaultTab,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type SamlaVaultTab,
  type ValvZone,
  type VaultTab,
  isAnalyseraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isSamlaVaultTab,
  resolveValvZone,
} from '../utils/vaultTabs';

import { hasPinConfigured, setupPin, verifyPin } from '../../../core/security/vaultPin';

export type { VaultTab, MainVaultTab, ValvZone } from '../utils/vaultTabs';
export { parseVaultTab } from '../utils/vaultTabs';

type VaultPageProps = {
  embedded?: boolean;
  onClose?: () => void;
  initialVaultTab?: VaultTab;
  onVaultTabChange?: (tab: VaultTab) => void;
};

export function VaultPage({
  embedded = false,
  onClose,
  initialVaultTab = 'logga',
  onVaultTabChange,
}: VaultPageProps) {
  const navigate = useNavigate();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const user = useStore((s) => s.user);
  const [pin, setPin] = useState('');
  const [isSetup, setIsSetup] = useState(!hasPinConfigured());
  const [confirmPin, setConfirmPin] = useState('');
  const [logs, setLogs] = useState<(VaultLog & { id: string })[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultTab, setVaultTabState] = useState<VaultTab>(initialVaultTab);
  const [highlightLogId, setHighlightLogId] = useState<string | null>(null);
  const gateOk = hasVaultGate();
  const valvZone = resolveValvZone(vaultTab);
  const samlaTab: SamlaVaultTab = isSamlaVaultTab(vaultTab) ? vaultTab : 'logga';
  const analyseraTab: AnalyseraVaultTab = isAnalyseraVaultTab(vaultTab) ? vaultTab : 'monster';
  const kunskapTab: KunskapVaultTab = isKunskapVaultTab(vaultTab) ? vaultTab : KUNSKAP_VAULT_TAB;
  const forensicTab: ForensicVaultTab = isForensicVaultTab(vaultTab) ? vaultTab : 'hamn_analys';

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
        const updated = await getVaultLogs(user.uid);
        setLogs(updated);
      } catch {
        /* list refresh best-effort */
      }
    }
  };

  const handleValvZoneChange = (zone: ValvZone) => {
    if (zone === 'samla') setVaultTab('logga');
    else if (zone === 'analysera') setVaultTab('monster');
    else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
    else if (zone === 'exportera') setVaultTab('dossier');
    else setVaultTab('hamn_analys');
  };

  useEffect(() => {
    if (!isVaultUnlocked) {
      setVaultTabState('logga');
    }
  }, [isVaultUnlocked]);

  useEffect(() => {
    if (isVaultUnlocked && user) {
      setLogsLoading(true);
      getVaultLogs(user.uid)
        .then(setLogs)
        .catch(() => setError('Kunde inte hämta loggar.'))
        .finally(() => setLogsLoading(false));
    }
  }, [isVaultUnlocked, user]);

  const handleUnlock = () => {
    if (!user) {
      setError('Väntar på inloggning — försök igen om ett ögonblick.');
      return;
    }
    if (isSetup) {
      if (pin.length < 4) {
        setError('PIN måste vara minst 4 tecken.');
        return;
      }
      if (pin !== confirmPin) {
        setError('PIN matchar inte.');
        return;
      }
      setupPin(pin);
      setIsSetup(false);
      setVaultUnlocked(true);
      setPin('');
      setConfirmPin('');
      setError(null);
      return;
    }
    if (verifyPin(pin)) {
      setVaultUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const handleSaveLog = async (input: VaultLogInput) => {
    if (!user) {
      setError('Inte inloggad.');
      throw new Error('vault-save-failed');
    }
    setSaving(true);
    setError(null);
    try {
      await saveVaultLog(user.uid, input);
      try {
        const updated = await getVaultLogs(user.uid);
        setLogs(updated);
      } catch {
        /* save lyckades — lista uppdateras vid nästa laddning */
      }
    } catch (err) {
      setError(
        err instanceof OfflineWriteBlockedError
          ? err.message
          : 'Kunde inte spara till valvet.',
      );
      throw new Error('vault-save-failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseToLayer1 = () => {
    setVaultTab('logga');
    setVaultUnlocked(false);
    clearVaultGate();
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/dagbok');
    }
  };

  if (!embedded && !gateOk) {
    return (
      <BentoCard
        title="Verklighetsvalvet"
        description="Sacred Feature — long-press krävs"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <p className="text-sm text-text-dim">
          Håll Dagbok-ikonen i bottenmenyn i 3 sekunder (Fyren) för dold åtkomst till bevisvalvet.
          Kort tryck räcker inte.
        </p>
      </BentoCard>
    );
  }

  if (!isVaultUnlocked) {
    return (
      <BentoCard
        title={embedded ? 'Valv · Baksida' : 'Verklighetsvalvet'}
        description="Ange PIN"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <PinGate
          description={
            isSetup
              ? 'Skapa din PIN (sparas lokalt, aldrig hårdkodad).'
              : 'Ange PIN för att låsa upp Valv-baksidan.'
          }
          pin={pin}
          confirmPin={confirmPin}
          setupMode={isSetup}
          error={error}
          onPinChange={setPin}
          onConfirmPinChange={setConfirmPin}
          onSubmit={handleUnlock}
        />
      </BentoCard>
    );
  }

  if (!user) {
    return (
      <BentoCard title="Verklighetsvalvet" icon={<Lock className="h-4 w-4" />}>
        <p className="text-sm text-text-dim">Ansluter till valvet…</p>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard title={embedded ? 'Valv · Baksida' : 'Verklighetsvalvet'} icon={<Lock className="h-4 w-4" />}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <VaultValvBreadcrumb zone={valvZone} vaultTab={vaultTab} />
          <button
            type="button"
            onClick={handleCloseToLayer1}
            className="btn-pill--ghost shrink-0 flex items-center gap-1"
            title="Stäng valv — tillbaka till vardag"
          >
            <X className="h-3 w-3" /> Stäng
          </button>
        </div>
        <p className="mb-3 text-sm text-text-muted">
          Lager 2 — samla bevis, analysera mönster, kunskap och export. Välj zon, sedan flik.
        </p>
        <TabBar<ValvZone>
          size="compact"
          tabs={getVaultZoneTabBarItems()}
          active={valvZone}
          onChange={handleValvZoneChange}
        />
        {valvZone === 'samla' && (
          <div className="mt-3">
            <TabBar<SamlaVaultTab>
              size="compact"
              tabs={getSamlaVaultTabBarItems()}
              active={samlaTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'analysera' && (
          <div className="mt-3">
            <TabBar<AnalyseraVaultTab>
              size="compact"
              tabs={getAnalyseraVaultTabBarItems()}
              active={analyseraTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'forensik' && (
          <div className="mt-3">
            <TabBar<ForensicVaultTab>
              size="compact"
              tabs={getForensicVaultTabBarItems()}
              active={forensicTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'kunskap' && (
          <div className="mt-3">
            <TabBar<KunskapVaultTab>
              size="compact"
              tabs={getKunskapVaultTabBarItems()}
              active={kunskapTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
      </BentoCard>

      {valvZone === 'forensik' && <VaultForensicPanel tab={forensicTab} />}

      {valvZone === 'samla' && vaultTab === 'logga' && (
        <>
          <VaultSamlaHub
            userId={user.uid}
            saving={saving}
            saveError={error}
            onSave={handleSaveLog}
            onBevisConfirmed={(docId) => void handleBevisConfirmed(docId)}
          />
          <VaultLogList logs={logs} loading={logsLoading} highlightLogId={highlightLogId} />
        </>
      )}

      {valvZone === 'samla' && vaultTab === 'sok' && (
        <ValvChatPanel
          active={isVaultUnlocked && vaultTab === 'sok'}
          onCitationClick={handleCitationClick}
        />
      )}

      {valvZone === 'analysera' && vaultTab === 'monster' && (
        <>
          <PansaretHeader />
          <VaultMonsterPanel logs={logs} />
        </>
      )}

      {valvZone === 'analysera' && vaultTab === 'orkester' && <VaultOrkesterPanel logs={logs} />}

      {valvZone === 'exportera' && vaultTab === 'dossier' && <DossierPage embedded />}

      {valvZone === 'kunskap' && kunskapTab === KUNSKAP_VAULT_TAB && <VaultKunskapsbankPanel />}
      {valvZone === 'kunskap' && kunskapTab === 'aktorskarta' && <VaultAktorskartaPanel />}
    </div>
  );
}
