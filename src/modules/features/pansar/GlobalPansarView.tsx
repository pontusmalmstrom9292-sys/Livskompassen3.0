import React, { useState } from 'react';
import { usePansarStore } from '@/modules/core/store/usePansarStore';
import { Wind, Lock, Send, ShieldCheck } from 'lucide-react';

export const GlobalPansarView: React.FC = () => {
  const { deactivate } = usePansarStore();
  const [pin, setPin] = useState('');
  const [inkastText, setInkastText] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Enkel mockup för upplåsning
    if (pin.length >= 4) {
      deactivate();
    }
  };

  const handleSaveInkast = () => {
    if (!inkastText.trim()) return;
    console.log('Sparar inkast från Pansarläge:', inkastText);
    setInkastText('');
    // Här anropar vi inboxPersist senare i Fas 2
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Kognitiv dumpning (Inkast) */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <ShieldCheck size={20} className="text-indigo-400" />
          <h2 className="text-sm font-medium">Säker kognitiv dumpning</h2>
        </div>
        
        <textarea
          value={inkastText}
          onChange={(e) => setInkastText(e.target.value)}
          placeholder="Töm hjärnan här. Inget behöver vara perfekt..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
        />
        
        <button
          onClick={handleSaveInkast}
          disabled={!inkastText.trim()}
          className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 border border-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
          <span>Spara till Inkast</span>
        </button>
      </div>

      {/* Mikrosteg (Andning) */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-12 text-center">
        <Wind size={32} className="mx-auto text-emerald-400 mb-4" />
        <h3 className="text-emerald-400 font-medium mb-2">4-7-8 Andning</h3>
        <p className="text-sm text-slate-400 mb-4">
          Andas in 4 sekunder. Håll i 7. Andas ut långsamt i 8 sekunder.
        </p>
        <button className="px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm">
          Starta visualisering (demo)
        </button>
      </div>

      {/* Lås upp-gate */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center">
        <form onSubmit={handleUnlock} className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-full border border-slate-800">
          <Lock size={16} className="text-slate-500 ml-2" />
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN..."
            maxLength={4}
            className="w-24 bg-transparent border-none text-center text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
          />
        </form>
      </div>

    </div>
  );
};
