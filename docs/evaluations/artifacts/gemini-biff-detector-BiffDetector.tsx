/**
 * Gemini / extern mock — BIFF-Detektor (inkorg only).
 * NOT part of Vite build. Source: user paste 2026-05-23.
 * Map to F-V12 + `analyzeBiffMessage` / Valv-placering vid `kör UX-inkorg-analys`.
 * Dependencies in mock: `runBiffTriage` (gemini), `BiffResponse` — see `gemini-biff-detector-types.ts`.
 */

import React, { useState } from 'react';
import { ShieldAlert, Eye, EyeOff, Copy, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { runBiffTriage } from '../services/gemini';
import { BiffResponse } from '../types';

const BiffDetector: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BiffResponse | null>(null);
  const [showNoise, setShowNoise] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTriage = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    const response = await runBiffTriage(input);
    setResult(response);
    setIsProcessing(false);
    setShowNoise(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const loadExample = () => {
    setInput("Du hämtar alltid Kasper alldeles för sent och struntar helt i hans rutiner. Han var jättetrött hela tisdagen efter ditt slarv! Du måste förstå att jag måste ta över alla helger om du fortsätter förstöra hans skolgång. Svara direkt hur du tänker lösa detta inför tisdag kl 15:00.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      <div className="glass-panel-gold rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-4 relative z-10 mb-2">
          <div className="p-3 bg-gold-500/20 rounded-2xl border border-gold-500/30">
            <ShieldAlert className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-gold-400 tracking-widest uppercase mb-1">Kognitiv Sköld</h2>
            <h1 className="text-xl font-bold text-slate-100">BIFF-Detektor</h1>
          </div>
        </div>
        <p className="text-sm text-slate-300 relative z-10 mt-2">
          Låt AI:n ta smällen. Filtrera bort JADE-fällor och dolda aggressioner innan du läser.
        </p>
      </div>

      {/* Input Area */}
      <div className="glass-panel rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Inkommande text</h3>
          <button onClick={loadExample} className="text-[10px] font-bold text-gold-400 hover:text-gold-300 bg-gold-500/10 px-3 py-1.5 rounded-lg transition-colors">
            Ladda exempel
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Klistra in meddelandet här..."
          rows={5}
          className="w-full bg-midnight-900 border border-white/10 rounded-2xl px-4 py-3 text-slate-200 focus:outline-none focus:border-gold-500 resize-none"
        />
        <button
          onClick={handleTriage}
          disabled={!input.trim() || isProcessing}
          className="w-full bg-gold-500 hover:bg-gold-400 text-midnight-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:shadow-none"
        >
          {isProcessing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          KÖR BIFF TRIAGE
        </button>
      </div>

      {/* Results Area */}
      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Emotional Noise */}
          <div className="glass-panel border-rose-500/20 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-[10px] font-bold text-rose-400 tracking-widest uppercase">Känslomässigt brus (Filtrerat)</h3>
              </div>
              <button 
                onClick={() => setShowNoise(!showNoise)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 bg-white/5 px-2 py-1 rounded-lg"
              >
                {showNoise ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showNoise ? 'Dölj' : 'Visa'}
              </button>
            </div>
            <div className="relative z-10">
              <p className={`text-sm text-rose-200/70 transition-all duration-500 ${!showNoise ? 'blur-md select-none opacity-50' : ''}`}>
                {result.emotionalNoise}
              </p>
              {!showNoise && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-rose-400/80 bg-midnight-950/80 px-3 py-1 rounded-full border border-rose-500/30">Skyddad från RSD</span>
                </div>
              )}
            </div>
          </div>

          {/* Logistic Core */}
          <div className="glass-panel-turquoise rounded-3xl p-5">
            <h3 className="text-[10px] font-bold text-turquoise-400 tracking-widest uppercase mb-3">Logistisk kärna (Fakta)</h3>
            <div className="bg-midnight-900/80 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-100 font-medium">{result.logisticCore}</p>
            </div>
          </div>

          {/* BIFF Responses */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gold-400 tracking-widest uppercase ml-2">Färdiga svar (Välj & Kopiera)</h3>
            
            {result.responses.map((resp, idx) => {
              const labels = ['Standard BIFF', 'Ultra-Kort / Strikt', 'Minimalist'];
              return (
                <div key={idx} className="glass-panel rounded-3xl p-5 relative group hover:border-gold-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">{labels[idx]}</span>
                    <button 
                      onClick={() => handleCopy(resp, idx)}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-gold-400 bg-white/5 px-2 py-1 rounded-lg transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <><CheckCircle2 className="w-3 h-3 text-turquoise-400" /> Kopierad</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Kopiera</>
                      )}
                    </button>
                  </div>
                  <div className="bg-midnight-900/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-slate-200 font-mono text-sm leading-relaxed">"{resp}"</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default BiffDetector;
