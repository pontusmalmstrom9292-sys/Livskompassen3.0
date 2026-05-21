import { FileText, Lock, Search, ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '../../core/ui/BentoCard';
import { PinGate } from '../../core/ui/PinGate';
import { TabBar } from '../../core/ui/TabBar';
import { useStore } from '../../core/store';
import { hasVaultGate, clearVaultGate } from '../../core/auth/sessionService';
import { saveVaultLog, getVaultLogs } from '../../core/firebase/firestore';
import type { VaultLog } from '../../core/types/firestore';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultLogList } from './VaultLogList';
import { ValvChatPanel } from '../../valv_chatt';
import type { VaultLogInput } from '../types/vaultEntry';

const PIN_STORAGE_KEY = 'livskompassen_vault_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

function verifyPin(pin: string): boolean {
  const envPin = import.meta.env.VITE_VAULT_PIN as string | undefined;
  if (envPin && pin === envPin) return true;
  const stored = localStorage.getItem(PIN_STORAGE_KEY);
  if (!stored) return false;
  return stored === hashPin(pin);
}

function setupPin(pin: string) {
  localStorage.setItem(PIN_STORAGE_KEY, hashPin(pin));
}

function hasPinConfigured(): boolean {
  return Boolean(localStorage.getItem(PIN_STORAGE_KEY) || import.meta.env.VITE_VAULT_PIN);
}

export type VaultTab = 'logga' | 'sok';

const VAULT_TABS = [
  { id: 'logga' as const, label: 'Logga', icon: <FileText className="h-3 w-3" /> },
  { id: 'sok' as const, label: 'Sök', icon: <Search className="h-3 w-3" /> },
];

type VaultPageProps = {
  embedded?: boolean;
  onClose?: () => void;
};

export function VaultPage({ embedded = false, onClose }: VaultPageProps) {
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
  const [vaultTab, setVaultTab] = useState<VaultTab>('logga');
  const gateOk = hasVaultGate();

  useEffect(() => {
    if (!isVaultUnlocked) {
      setVaultTab('logga');
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
        title={embedded ? 'Bevis' : 'Verklighetsvalvet'}
        description="Ange PIN"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <PinGate
          description={
            isSetup
              ? 'Skapa din PIN (sparas lokalt, aldrig hårdkodad).'
              : 'Ange PIN för att låsa upp.'
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
      <BentoCard title={embedded ? 'Bevis' : 'Verklighetsvalvet'} icon={<Lock className="h-4 w-4" />}>
        <div className="mb-4 flex items-start justify-between gap-2">
          <p className="text-sm text-accent">
            Lager 2 — append-only (WORM). Ett fält i taget.
          </p>
          <button
            type="button"
            onClick={handleCloseToLayer1}
            className="btn-pill--ghost shrink-0 flex items-center gap-1"
            title="Stäng valv — tillbaka till dagbok"
          >
            <X className="h-3 w-3" /> Stäng
          </button>
        </div>
        <TabBar<VaultTab> tabs={VAULT_TABS} active={vaultTab} onChange={setVaultTab} />
      </BentoCard>

      {vaultTab === 'logga' && (
        <>
          <BentoCard title="Ny post" description="Append-only bevis">
            <VaultEntryForm userId={user.uid} saving={loading} onSave={handleSaveLog} />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </BentoCard>
          <VaultLogList logs={logs} loading={loading} />
        </>
      )}

      {vaultTab === 'sok' && (
        <ValvChatPanel active={isVaultUnlocked && vaultTab === 'sok'} />
      )}
    </div>
  );
}
