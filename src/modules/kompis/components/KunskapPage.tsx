import { useCallback, useEffect, useState } from 'react';
import { Tidshjulet } from './Tidshjulet';
import { KnowledgeVaultChat } from './KnowledgeVaultChat';
import { KampsparIngestForm } from './KampsparIngestForm';
import { ProfileSeedImport } from './ProfileSeedImport';
import { BentoCard } from '../../core/ui/BentoCard';
import { TabBar } from '../../core/ui/TabBar';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { Compass, Sparkles } from 'lucide-react';
import { useStore } from '../../core/store';
import { getKampsparEntries } from '../../core/firebase/firestore';
import type { KampsparEntryRow } from '../../core/types/firestore';

type Tab = 'chat' | 'tidshjul';

const tabs = [
  { id: 'chat' as const, label: 'Kunskapsvalv', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'tidshjul' as const, label: 'Tidshjulet', icon: <Compass className="h-3 w-3" /> },
];

type KunskapPageProps = {
  embedded?: boolean;
};

export function KunskapPage({ embedded: _embedded = false }: KunskapPageProps) {
  const [tab, setTab] = useState<Tab>('chat');
  const [highlightEntryId, setHighlightEntryId] = useState<string | null>(null);
  const user = useStore((s) => s.user);
  const [entries, setEntries] = useState<KampsparEntryRow[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const reloadEntries = useCallback(async () => {
    if (!user) return;
    setLoadingEntries(true);
    try {
      const rows = await getKampsparEntries(user.uid);
      setEntries(rows);
    } catch {
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

  useEffect(() => {
    reloadEntries();
  }, [reloadEntries]);

  return (
    <div className="space-y-6">
      <TabBar tabs={tabs} active={tab} onChange={(id) => setTab(id)} />

      {tab === 'chat' ? (
        <KnowledgeVaultChat
          onCitationClick={(docId) => {
            setHighlightEntryId(docId);
            setTab('tidshjul');
          }}
        />
      ) : (
        <>
          <BentoCard title="Tidshjulet — Minne" description="Interaktiv tidslinje">
            <Tidshjulet entries={entries} highlightEntryId={highlightEntryId} />
          </BentoCard>

          <ProfileSeedImport entries={entries} onImported={reloadEntries} />

          <KampsparIngestForm onSaved={reloadEntries} />

          <BentoCard title="Senaste poster" description={loadingEntries ? 'Laddar…' : `${entries.length} poster`}>
            {entries.length === 0 ? (
              <p className="text-sm text-text-dim">Inga poster ännu.</p>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className={entry.id === highlightEntryId ? 'rounded-xl ring-2 ring-accent/50' : ''}
                  >
                    <TimelineEntry
                      meta={`${entry.eventDate?.slice(0, 10) || entry.createdAt?.slice(0, 10) || '—'} · ${entry.entryType ? `${entry.entryType} · ` : ''}${entry.category ? `${entry.category} · ` : ''}${entry.title}`}
                      body={
                        entry.tags?.length
                          ? `${entry.content}\n\nTaggar: ${entry.tags.join(', ')}`
                          : entry.content
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </>
      )}
    </div>
  );
}
