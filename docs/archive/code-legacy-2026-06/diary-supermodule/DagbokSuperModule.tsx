import { useState } from 'react';
import { useJournalAndVaultData } from './useJournalAndVaultData';
import { SmartToolbar } from './components/SmartToolbar';
import { JournalTimeline } from './components/JournalTimeline';
import { ContentWorkspace } from './components/ContentWorkspace';
import type { Entry } from './types';

export function DagbokSuperModule() {
  const [activeTab, setActiveTab] = useState<'journal' | 'vault' | 'insights'>('journal');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
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
