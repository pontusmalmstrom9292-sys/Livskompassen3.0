import React, { useState } from 'react';
import { usePansarStore } from '@/modules/core/store/usePansarStore';
import { ShieldCheck, Send, Loader2, LockOpen } from 'lucide-react';
import { submitInkastLite } from '@/modules/inkast/api/inkastService';
import { ParalysPanel } from '@/modules/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { CalmBreathingCircle } from '@/modules/capture/components/CalmBreathingCircle';
import { useStore } from '@/modules/core/store';
import { useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '@/modules/core/auth/valvFyrenGate';
import { Button } from '@/design-system';

export const GlobalPansarView: React.FC = () => {
  const { deactivate, pansarLevel } = usePansarStore();
  const setSystemError = useStore((s) => s.setError);
  const navigate = useNavigate();
  
  const [inkastText, setInkastText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [showUnlockGate, setShowUnlockGate] = useState(false);

  const handleSaveInkast = async () => {
    if (!inkastText.trim() || isSaving) return;
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await submitInkastLite({
        text: inkastText,
        sourceModule: 'pansarlage',
        manualTags: ['#pansarläge'],
      });
      setInkastText('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kunde inte spara.';
      setSystemError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setUnlockError(null);
    try {
      const success = await openValvViaFyren(navigate, {
        onDenied: (msg) => {
          setUnlockError(msg);
          setSystemError(msg);
        }
      });
      if (success) {
        deactivate();
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  if (showUnlockGate) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-bg p-6 text-text">
        <div className="calm-card flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border/40 bg-surface/95 p-6 text-center shadow-2xl">
          <LockOpen size={32} className="mx-auto mb-2 text-accent" aria-hidden />
          <h2 className="text-lg font-medium text-text">Lås upp appen</h2>
          <p className="mb-4 text-sm text-text-muted">
            Biometrisk verifiering krävs för att avbryta pansarläget.
          </p>
          
          <Button
            type="button"
            onClick={handleUnlock}
            disabled={isUnlocking}
            variant="accent"
            className="flex w-full min-h-11 items-center justify-center gap-2"
          >
            {isUnlocking ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <LockOpen size={16} aria-hidden />}
            <span>{isUnlocking ? 'Verifierar...' : 'Verifiera med biometri'}</span>
          </Button>

          {unlockError ? (
            <p className="text-xs text-danger" role="alert">
              {unlockError}
            </p>
          ) : null}
          
          <Button
            type="button"
            onClick={() => setShowUnlockGate(false)}
            disabled={isUnlocking}
            variant="ghost"
            className="mt-2 w-full min-h-11 text-xs"
          >
            Avbryt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center overflow-y-auto bg-bg p-6 pb-safe-offset-4 pt-safe text-text">
      
      <div className="calm-card mb-8 mt-8 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border/40 bg-surface/80 p-6 shadow-2xl">
        <div className="mb-2 flex items-center justify-between text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-text">Säker kognitiv dumpning</h2>
          </div>
          <span className="rounded bg-surface-3/60 px-2 py-1 text-[10px] uppercase tracking-widest text-text-muted">
            Nivå {pansarLevel}
          </span>
        </div>
        
        <textarea
          value={inkastText}
          onChange={(e) => setInkastText(e.target.value)}
          placeholder="Töm hjärnan här. Inget behöver vara perfekt..."
          aria-label="Kognitiv dumpning till Inkast"
          className="input-glass h-32 w-full resize-none rounded-xl p-4 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        />
        
        <button
          type="button"
          onClick={handleSaveInkast}
          disabled={!inkastText.trim() || isSaving}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/25 bg-accent/10 py-3 text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
          <span>{saveSuccess ? 'Sparat till valvet' : 'Spara till Inkast'}</span>
        </button>
        {saveSuccess ? (
          <p className="text-center text-xs text-success" role="status">
            Sparat. Fortsätt andas — Valvet tar emot det.
          </p>
        ) : null}
      </div>

      <div className="calm-card mb-8 flex w-full max-w-md flex-col items-center rounded-2xl border border-border/40 bg-surface/80 p-6 shadow-2xl">
        <div className="mb-6">
          <CalmBreathingCircle size="md" />
        </div>
        <div className="w-full">
          <ParalysPanel onDone={() => {}} embedded simplified={pansarLevel >= 2} />
        </div>
      </div>

      <div className="mt-auto pb-4 pt-8">
        <button 
          type="button"
          onClick={() => setShowUnlockGate(true)} 
          className="flex min-h-11 items-center gap-2 rounded-full border border-border/40 bg-surface/80 px-4 py-2 text-text-muted transition-colors hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        >
          <LockOpen size={16} aria-hidden />
          <span className="text-xs uppercase tracking-widest">Lås upp appen</span>
        </button>
      </div>

    </div>
  );
};
