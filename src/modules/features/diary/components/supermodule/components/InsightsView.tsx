import { useState } from 'react';
import type { Entry } from '../types';

export const InsightsView = ({ data }: { data: Entry[] }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleAnalyze = () => {
    setLoading(true);
    // Placeholder för AI-anrop
    setTimeout(() => {
      setInsight(`Jag har analyserat ${data?.length || 0} inlägg i din logg.\n\nEtt återkommande mönster verkar vara positiv utveckling kring gränssättning, men du upplever fortfarande spänning när du formulerar din sanning.\n\nJag rekommenderar att vi tittar närmare på morgonrutinen.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto py-8">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-2 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-3xl font-display-serif text-text tracking-wide">Mönster-Arkivarien</h2>
        <p className="text-text-muted">AI-analys över hela din logg ({data?.length || 0} inlägg).</p>
      </div>
      
      {!insight && !loading && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleAnalyze}
            className="group relative px-6 py-3 bg-surface-3 text-indigo-300 rounded-xl font-bold uppercase tracking-widest text-sm border border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out" />
            Kör mönsteranalys
          </button>
        </div>
      )}

      {loading && (
        <div className="p-10 bg-surface-2 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-6">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-indigo-300 uppercase tracking-widest font-mono">Processar mönster...</p>
        </div>
      )}

      {insight && (
        <div className="p-8 bg-surface-2 border border-indigo-500/20 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.05)] relative">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-indigo-400 mb-6 flex items-center gap-2">
            <span>●</span> Analys slutförd
          </h3>
          <p className="text-text text-lg leading-relaxed whitespace-pre-wrap">{insight}</p>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button 
              onClick={() => setInsight(null)}
              className="text-[10px] text-text-muted hover:text-text transition-colors uppercase tracking-widest font-mono"
            >
              [ Rensa ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
