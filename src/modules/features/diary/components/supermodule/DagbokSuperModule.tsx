import { useState } from 'react';
import { useJournalAndVaultData } from './useJournalAndVaultData';

// Placeholder components to be implemented
const SmartToolbar = ({ activeTab, setActiveTab }: any) => (
  <div className="p-4 border-b border-border-muted flex gap-2 overflow-x-auto no-scrollbar">
    {['journal', 'vault', 'insights'].map(tab => (
      <button 
        key={tab}
        onClick={() => setActiveTab(tab)} 
        className={`
          px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all whitespace-nowrap border
          ${activeTab === tab 
            ? tab === 'vault' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
              : tab === 'insights' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
              : 'bg-white/10 text-text border-white/20 shadow-sm'
            : 'bg-transparent text-text-muted hover:text-text border-transparent hover:bg-white/5'}
        `}
      >
        {tab === 'journal' ? 'Dagbok' : tab === 'vault' ? 'Valvet' : 'Insikter'}
      </button>
    ))}
  </div>
);

const JournalTimeline = ({ data, loading, filter, onSelect, activeEntryId }: any) => {
  if (loading) return (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
  
  // När fliken "Insikter" är vald vill vi ha hela datasetet, annars filtrerar vi
  const filteredData = data?.filter((item: any) => filter === 'insights' ? true : item.type === filter) || [];
  
  return (
    <div className="p-4 flex flex-col gap-3">
      {filteredData.map((item: any) => {
        const isVault = item.type === 'vault';
        const isActive = activeEntryId === item.id;
        
        return (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden border
              ${isActive ? 'bg-[#111b2d] border-[rgba(99,102,241,0.22)] shadow-md' : 'bg-background-surface border-border-muted hover:border-white/20'}
            `}
          >
            {/* Färgaccent i kanten */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isVault ? 'bg-accent-gold' : 'bg-indigo-500'} opacity-70 group-hover:opacity-100 transition-opacity`} />
            
            <div className="pl-2">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isVault ? 'text-accent-gold' : 'text-indigo-400'}`}>
                  {isVault ? 'Valvet' : 'Dagbok'}
                </span>
                <span className="text-[10px] text-text-muted font-mono tabular-nums">
                  {item.createdAt ? new Date(item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <div className="text-sm text-text font-medium truncate">
                {item.mood || item.action || 'Anteckning'}
              </div>
            </div>
          </div>
        );
      })}
      
      {filteredData.length === 0 && (
        <div className="text-center p-6 text-text-muted text-sm border border-dashed border-white/10 rounded-xl">
          Inga inlägg hittades.
        </div>
      )}
    </div>
  );
};

const JournalView = ({ entry }: { entry: any }) => (
  <div className="space-y-6 p-6 bg-background-surface rounded-2xl border border-border-muted shadow-sm">
    <h2 className="text-3xl font-display-serif text-text tracking-wide">{entry.mood || 'Dagboksanteckning'}</h2>
    <p className="whitespace-pre-wrap text-lg leading-relaxed text-text-muted">{entry.text}</p>
    {entry.tags && entry.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border-muted">
        {entry.tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium tracking-wide">
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

const VaultView = ({ entry }: { entry: any }) => {
  const isAnchorOrPinned = entry.isAnchor || entry.isPinned || entry.pinned;

  return (
    <div className="space-y-6 p-6 bg-[#111b2d] border border-[rgba(99,102,241,0.22)] rounded-xl relative overflow-hidden">
      {/* Dekorativ övre ram för "Vault"-känsla */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-50" />
      
      <div className="flex items-center justify-between pb-4 border-b border-border-muted">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 tabular-nums font-mono">
            {entry.createdAt ? new Date(entry.createdAt?.seconds ? entry.createdAt.seconds * 1000 : entry.createdAt).toISOString().split('T')[0] : 'OKÄNT DATUM'}
          </p>
          <h2 className="text-xl font-bold tracking-wide text-text">{entry.action || 'Valv-inlägg'}</h2>
        </div>
        {isAnchorOrPinned && (
          <span className="text-xs bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-3 py-1.5 rounded-full font-medium tracking-wide shadow-[0_0_10px_rgba(212,175,55,0.1)]">
            📌 Sanningens Ankare
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-black/20 rounded-lg border-l-4 border-accent-gold border-y border-r border-border-muted">
          <p className="text-[10px] text-accent-gold uppercase tracking-[0.15em] mb-2 font-mono">Sanning (WORM)</p>
          <p className="text-text leading-relaxed">{entry.truth}</p>
        </div>

        {entry.theirVersion && (
          <div className="p-5 bg-black/20 rounded-lg border-l-4 border-red-500/70 border-y border-r border-border-muted opacity-80">
            <p className="text-[10px] text-red-400 uppercase tracking-[0.15em] mb-2 font-mono">Deras version</p>
            <p className="italic text-text-muted leading-relaxed">{entry.theirVersion}</p>
          </div>
        )}
      </div>

      {(entry.shieldBoundary || entry.shieldFeeling) && (
        <div className="p-5 bg-black/20 border border-border-muted rounded-lg space-y-4">
          {entry.shieldBoundary && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-1 font-mono">Gräns (Boundary)</p>
              <p className="text-text">{entry.shieldBoundary}</p>
            </div>
          )}
          {entry.shieldFeeling && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-1 font-mono">Känsla</p>
              <p className="text-text">{entry.shieldFeeling}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InsightsView = ({ data }: { data: any[] }) => {
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
            className="group relative px-6 py-3 bg-[#111b2d] text-indigo-300 rounded-xl font-bold uppercase tracking-widest text-sm border border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out" />
            Kör mönsteranalys
          </button>
        </div>
      )}

      {loading && (
        <div className="p-10 bg-[#09111e] rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-6">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-indigo-300 uppercase tracking-widest font-mono">Processar mönster...</p>
        </div>
      )}

      {insight && (
        <div className="p-8 bg-[#09111e] border border-indigo-500/20 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.05)] relative">
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

const ContentWorkspace = ({ entry, activeTab, data }: { entry: any, activeTab?: string, data?: any[] }) => {
  if (activeTab === 'insights') {
    return (
      <div className="h-full overflow-y-auto">
        <InsightsView data={data || []} />
      </div>
    );
  }

  if (!entry) return null;
  return (
    <div className="h-full overflow-y-auto">
      {entry.type === 'journal' ? <JournalView entry={entry} /> : <VaultView entry={entry} />}
    </div>
  );
};

export function DagbokSuperModule() {
  const [activeTab, setActiveTab] = useState<'journal' | 'vault' | 'insights'>('journal');
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const { data, loading } = useJournalAndVaultData();

  return (
    <div className="flex h-[80vh] w-full bg-background-base border border-border-muted rounded-2xl overflow-hidden shadow-2xl">
      <aside className="w-1/3 border-r border-border-muted flex flex-col bg-black/10">
        <div className="shrink-0">
          <SmartToolbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <JournalTimeline data={data} loading={loading} filter={activeTab} onSelect={setSelectedEntry} activeEntryId={selectedEntry?.id} />
        </div>
      </aside>
      <main className="w-2/3 flex flex-col p-8 overflow-y-auto relative bg-gradient-to-b from-transparent to-black/5">
        {activeTab === 'insights' || selectedEntry ? (
          <ContentWorkspace entry={selectedEntry} activeTab={activeTab} data={data} />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted font-mono text-xs tracking-widest uppercase">
            [ Välj ett inlägg från tidslinjen ]
          </div>
        )}
      </main>
    </div>
  );
}
