import { Lock, ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { PinGate } from '../../../core/ui/PinGate';
import { TabBar } from '../../../core/ui/TabBar';
import {
  getForensicVaultTabBarItems,
  getPansaretVaultTabBarItems,
  getVaultZoneTabBarItems,
} from '../../../core/navigation/tabRegistry';
import { useStore } from '../../../core/store';
import { hasVaultGate, clearVaultGate } from '../../../core/auth/sessionService';
import { saveVaultLog, getVaultLogs } from '../../../core/firebase/firestore';
import type { VaultLog } from '../../../core/types/firestore';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultLogList } from './VaultLogList';
import { ValvChatPanel } from '../../../evidence/vaultChat';
import { DossierPage } from '../dossier';
import { VaultMonsterPanel } from './VaultMonsterPanel';
import { VaultOrkesterPanel } from './VaultOrkesterPanel';
import { PansaretHeader } from './PansaretHeader';
import { VaultKunskapsbankPanel } from '../../knowledge/components/VaultKunskapsbankPanel';
import { VaultForensicPanel } from './VaultForensicPanel';
import { VaultValvBreadcrumb } from './VaultValvBreadcrumb';
import type { VaultLogInput } from '../types/vaultEntry';
import {
  KUNSKAP_VAULT_TAB,
  type ForensicVaultTab,
  type PansaretVaultTab,
  type ValvZone,
  type VaultTab,
  isForensicVaultTab,
  isPansaretVaultTab,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultTab, setVaultTabState] = useState<VaultTab>(initialVaultTab);
  const [highlightLogId, setHighlightLogId] = useState<string | null>(null);
  const gateOk = hasVaultGate();
  const valvZone = resolveValvZone(vaultTab);
  const pansaretTab: PansaretVaultTab = isPansaretVaultTab(vaultTab) ? vaultTab : 'logga';
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

  const handleValvZoneChange = (zone: ValvZone) => {
    if (zone === 'pansaret') setVaultTab('logga');
    else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
    else setVaultTab('hamn_analys');
  };

  useEffect(() => {
    if (!isVaultUnlocked) {
      setVaultTabState('logga');
    }
  }, [isVaultUnlocked]);

  useEffect(() => {
    if (isVaultUnlocked && user) {
      setLoading(true);
      getVaultLogs(user.uid)
        .then(setLogs)
        .catch(() => setError('Kunde inte hämta loggar.'))
        .finally(() => setLoading(false));
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
      throw new Error('Inte inloggad');
    }
    setLoading(true);
    setError(null);
    try {
      await saveVaultLog(user.uid, input);
      const updated = await getVaultLogs(user.uid);
      setLogs(updated);
    } catch {
      setError('Kunde inte spara till valvet.');
      throw new Error('vault-save-failed');
    } finally {
      setLoading(false);
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
          Lager 2 — WORM-bevis, Kunskapsbank och forensik. Välj zon, sedan flik.
        </p>
        <TabBar<ValvZone>
          size="compact"
          tabs={getVaultZoneTabBarItems()}
          active={valvZone}
          onChange={handleValvZoneChange}
        />
        {valvZone === 'pansaret' && (
          <div className="mt-3">
            <TabBar<PansaretVaultTab>
              size="compact"
              tabs={getPansaretVaultTabBarItems()}
              active={pansaretTab}
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
      </BentoCard>

      {valvZone === 'forensik' && <VaultForensicPanel tab={forensicTab} />}

      {valvZone === 'pansaret' && vaultTab === 'logga' && (
        <>
          <BentoCard title="Ny post" description="Append-only bevis">
            <VaultEntryForm userId={user.uid} saving={loading} onSave={handleSaveLog} />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </BentoCard>
          <VaultLogList logs={logs} loading={loading} highlightLogId={highlightLogId} />
        </>
      )}

      {valvZone === 'pansaret' && vaultTab === 'sok' && (
        <ValvChatPanel
          active={isVaultUnlocked && vaultTab === 'sok'}
          onCitationClick={handleCitationClick}
        />
      )}

      {valvZone === 'pansaret' && vaultTab === 'monster' && (
        <>
          <PansaretHeader />
          <VaultMonsterPanel logs={logs} />
        </>
      )}

      {valvZone === 'pansaret' && vaultTab === 'orkester' && <VaultOrkesterPanel logs={logs} />}

      {valvZone === 'pansaret' && vaultTab === 'dossier' && <DossierPage embedded />}

      {valvZone === 'kunskap' && <VaultKunskapsbankPanel />}
    </div>
  );
}
