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
    } catch (err: any) {
      setSystemError(err.message || 'Kunde inte spara.');
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
      <div className="fixed inset-0 z-[9999] bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-center">
          <LockOpen size={32} className="mx-auto text-indigo-400 mb-2" />
          <h2 className="text-lg font-medium text-slate-200">Lås upp appen</h2>
          <p className="text-sm text-slate-400 mb-4">Biometrisk verifiering krävs för att avbryta pansarläget.</p>
          
          <Button type="button" onClick={handleUnlock} disabled={isUnlocking} variant="accent" className="--accent w-full flex items-center justify-center gap-2">
            {isUnlocking ? <Loader2 size={16} className="animate-spin" /> : <LockOpen size={16} />}
            <span>{isUnlocking ? 'Verifierar...' : 'Verifiera med biometri'}</span>
          </Button>

          {unlockError && <p className="text-xs text-rose-400">{unlockError}</p>}
          
          <Button type="button" onClick={() => setShowUnlockGate(false)} disabled={isUnlocking} variant="ghost" className="mt-2 --ghost text-xs w-full">
            Avbryt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 text-slate-200 flex flex-col items-center p-6 overflow-y-auto pt-safe pb-safe-offset-4">
      
      {/* Kognitiv dumpning (Inkast) */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <h2 className="text-sm font-medium">Säker kognitiv dumpning</h2>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
            Nivå {pansarLevel}
          </span>
        </div>
        
        <textarea
          value={inkastText}
          onChange={(e) => setInkastText(e.target.value)}
          placeholder="Töm hjärnan här. Inget behöver vara perfekt..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
        />
        
        <button
          onClick={handleSaveInkast}
          disabled={!inkastText.trim() || isSaving}
          className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 border border-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          <span>{saveSuccess ? 'Sparat till valvet' : 'Spara till Inkast'}</span>
        </button>
      </div>

      {/* Mikrosteg (Andning) */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col items-center">
        <div className="mb-6">
          <CalmBreathingCircle size="md" />
        </div>
        <div className="w-full">
          <ParalysPanel onDone={() => {}} embedded simplified={pansarLevel >= 2} />
        </div>
      </div>

      {/* Lås upp-gate */}
      <div className="mt-auto pt-8 pb-4">
        <button 
          onClick={() => setShowUnlockGate(true)} 
          className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400"
        >
          <LockOpen size={16} />
          <span className="text-xs uppercase tracking-widest">Lås upp appen</span>
        </button>
      </div>

    </div>
  );
};
