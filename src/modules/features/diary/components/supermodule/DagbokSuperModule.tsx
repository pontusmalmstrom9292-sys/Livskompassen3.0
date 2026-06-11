import { useState } from 'react';
import { useJournalAndVaultData } from './useJournalAndVaultData';

// Placeholder components to be implemented
const SmartToolbar = ({ activeTab, setActiveTab }: any) => (
  <div className="p-4 border-b border-border-muted flex gap-2">
    <button onClick={() => setActiveTab('journal')} className={activeTab === 'journal' ? 'font-bold' : ''}>Dagbok</button>
    <button onClick={() => setActiveTab('vault')} className={activeTab === 'vault' ? 'font-bold' : ''}>Valvet</button>
    <button onClick={() => setActiveTab('insights')} className={activeTab === 'insights' ? 'font-bold' : ''}>Insikter</button>
  </div>
);

const JournalTimeline = ({ data, loading, filter, onSelect }: any) => {
  if (loading) return <div className="p-4 text-text-muted">Laddar...</div>;
  
  const filteredData = data?.filter((item: any) => item.type === filter) || [];
  
  return (
    <div className="p-4 flex flex-col gap-2">
      {filteredData.map((item: any) => (
        <div 
          key={item.id} 
          onClick={() => onSelect(item)}
          className="p-3 bg-background-surface border border-border-muted rounded cursor-pointer hover:border-border-base transition-colors"
        >
          <div className="font-bold text-sm">
            {item.type}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {String(item.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
};

const JournalView = ({ entry }: { entry: any }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{entry.mood || 'Dagboksanteckning'}</h2>
    <p className="whitespace-pre-wrap">{entry.text}</p>
    <div className="flex gap-2">
      {entry.tags?.map((tag: string) => <span key={tag} className="px-2 py-1 bg-accent-muted rounded text-xs">{tag}</span>)}
    </div>
  </div>
);

const VaultView = ({ entry }: { entry: any }) => {
  const isAnchorOrPinned = entry.isAnchor || entry.isPinned || entry.pinned;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent-gold">{entry.action || 'Valv-inlägg'}</h2>
        {isAnchorOrPinned && (
          <span className="text-xs bg-accent-gold/20 text-accent-gold px-2 py-1 rounded-full font-medium">
            📌 Sanningens Ankare
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-background-subtle rounded border-l-4 border-accent-gold">
          <p className="font-semibold text-sm mb-1">Sanning:</p>
          <p>{entry.truth}</p>
        </div>

        {entry.theirVersion && (
          <div className="p-4 bg-background-subtle rounded border-l-4 border-red-500 opacity-80">
            <p className="font-semibold text-sm mb-1 text-red-500">Deras version:</p>
            <p className="italic text-text-muted">{entry.theirVersion}</p>
          </div>
        )}
      </div>

      {(entry.shieldBoundary || entry.shieldFeeling) && (
        <div className="p-4 bg-background-subtle border border-border-muted rounded space-y-2">
          {entry.shieldBoundary && (
            <div>
              <p className="font-semibold text-sm">Gräns (Boundary):</p>
              <p>{entry.shieldBoundary}</p>
            </div>
          )}
          {entry.shieldFeeling && (
            <div>
              <p className="font-semibold text-sm">Känsla:</p>
              <p>{entry.shieldFeeling}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-text-muted">
        Skapat: {entry.createdAt ? new Date(entry.createdAt?.seconds ? entry.createdAt.seconds * 1000 : entry.createdAt).toLocaleDateString() : 'Okänt datum'}
      </p>
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
      setInsight(`Analys slutförd för ${data?.length || 0} inlägg. Ett återkommande mönster verkar vara positiv utveckling.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI-insikter</h2>
      <p className="text-sm text-text-muted">Analys av {data?.length || 0} inlägg i din logg.</p>
      
      {!insight && !loading && (
        <button 
          onClick={handleAnalyze}
          className="px-4 py-2 bg-accent text-white rounded font-bold"
        >
          Generera insikter
        </button>
      )}

      {loading && (
        <div className="p-4 bg-background-subtle rounded text-center animate-pulse">
          Laddar AI-analys...
        </div>
      )}

      {insight && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded">
          <p>{insight}</p>
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
    <div className="flex h-[80vh] w-full bg-background-base border border-border-muted rounded-lg overflow-hidden">
      <aside className="w-1/3 border-r border-border-muted overflow-y-auto">
        <SmartToolbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <JournalTimeline data={data} loading={loading} filter={activeTab} onSelect={setSelectedEntry} />
      </aside>
      <main className="w-2/3 flex flex-col p-6">
        {activeTab === 'insights' || selectedEntry ? (
          <ContentWorkspace entry={selectedEntry} activeTab={activeTab} data={data} />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            Välj ett inlägg från tidslinjen
          </div>
        )}
      </main>
    </div>
  );
}
