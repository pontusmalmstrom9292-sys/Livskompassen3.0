import { useCallback, useEffect, useState } from 'react';
import { Tidshjulet } from './Tidshjulet';
import { TidshjulDetailCard } from './TidshjulDetailCard';
import { KnowledgeVaultChat } from './KnowledgeVaultChat';
import { KampsparIngestForm } from './KampsparIngestForm';
import { ProfileSeedImport } from './ProfileSeedImport';
import { EntityRegistryCard } from './EntityRegistryCard';
import { InboxReviewQueue } from '../../../inkast/components/InboxReviewQueue';
import { BentoCard } from '../../../core/ui/BentoCard';
import { TabBar } from '../../../core/ui/TabBar';
import { TimelineEntry } from '../../../core/ui/TimelineEntry';
import { Compass, Sparkles } from 'lucide-react';
import { useStore } from '../../../core/store';
import { getKampsparEntries, subscribeKampsparEntries } from '../../../core/firebase/firestore';
import type { KampsparEntryRow } from '../../../core/types/firestore';
import { buildTidshjulPatternHint } from '../utils/tidshjulTimeline';

type Tab = 'chat' | 'tidshjul';

const tabs = [
  { id: 'chat' as const, label: 'Kunskapsvalv', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'tidshjul' as const, label: 'Tidshjulet', icon: <Compass className="h-3 w-3" /> },
];

type KunskapPageProps = {
  embedded?: boolean;
  /** När satt (t.ex. från Familjen-hub): hoppa till post i Tidshjulet. */
  focusKampsparId?: string | null;
  onFocusKampsparConsumed?: () => void;
};

export function KunskapPage({
  embedded: _embedded = false,
  focusKampsparId,
  onFocusKampsparConsumed,
}: KunskapPageProps) {
  const [tab, setTab] = useState<Tab>('chat');
  const [highlightEntryId, setHighlightEntryId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<KampsparEntryRow | null>(null);
  const user = useStore((s) => s.user);
  const [entries, setEntries] = useState<KampsparEntryRow[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [citationNotice, setCitationNotice] = useState<string | null>(null);

  const reloadEntries = useCallback(async () => {
    if (!user) return;
    setLoadingEntries(true);
    setEntriesError(null);
    try {
      const rows = await getKampsparEntries(user.uid);
      setEntries(rows);
    } catch {
      setEntries([]);
      setEntriesError('Kunde inte läsa kampspar. Kontrollera inloggning.');
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || tab !== 'tidshjul') return;

    setLoadingEntries(true);
    const unsub = subscribeKampsparEntries(
      user.uid,
      (rows) => {
        setEntries(rows);
        setLoadingEntries(false);
        setEntriesError(null);
      },
      () => {
        setEntriesError('Live-uppdatering avbröts — visar senast kända data.');
        setLoadingEntries(false);
        reloadEntries();
      }
    );

    return () => unsub();
  }, [user, tab, reloadEntries]);

  useEffect(() => {
    if (tab === 'chat' && user) {
      reloadEntries();
    }
  }, [tab, user, reloadEntries]);

  useEffect(() => {
    if (!highlightEntryId) return;
    const hit = entries.find((e) => e.id === highlightEntryId);
    if (hit) setSelectedEntry(hit);
  }, [highlightEntryId, entries]);

  useEffect(() => {
    if (!focusKampsparId) return;
    setTab('tidshjul');
    setHighlightEntryId(focusKampsparId);
    onFocusKampsparConsumed?.();
  }, [focusKampsparId, onFocusKampsparConsumed]);

  const handleCitationClick = (docId: string, collection: 'kampspar' | 'kb_docs') => {
    setCitationNotice(null);
    if (collection === 'kampspar') {
      setTab('tidshjul');
      setHighlightEntryId(docId);
      return;
    }
    setTab('tidshjul');
    setHighlightEntryId(null);
    setCitationNotice(
      `Dokumentkälla (${docId.slice(0, 8)}…). Se uppladdade filer under Tidshjulet eller Kunskapsvalv-chatten.`,
    );
  };

  const patternHint = buildTidshjulPatternHint(entries);

  return (
    <div className="space-y-6">
      <TabBar tabs={tabs} active={tab} onChange={(id) => setTab(id)} />

      {tab === 'chat' ? (
        <>
          <KnowledgeVaultChat onCitationClick={handleCitationClick} />
          <InboxReviewQueue />
          <EntityRegistryCard />
        </>
      ) : (
        <>
          {citationNotice && (
            <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-text-muted">
              {citationNotice}
            </p>
          )}
          {patternHint && (
            <BentoCard title="Mönster (Minne)" description="Livs-Arkivarien · deterministisk översikt">
              <p className="text-sm text-text-muted">{patternHint}</p>
            </BentoCard>
          )}

          <BentoCard
            title="Tidshjulet — Minne"
            description={
              loadingEntries
                ? 'Laddar live kampspar…'
                : `${entries.length} poster · Dåtid / Nutid / Framtid`
            }
          >
            {entriesError && (
              <p className="mb-3 text-sm text-amber-400/90">{entriesError}</p>
            )}
            <Tidshjulet
              entries={entries}
              highlightEntryId={highlightEntryId}
              selectedEntryId={selectedEntry?.id ?? null}
              onSelectEntry={setSelectedEntry}
            />
          </BentoCard>

          <TidshjulDetailCard entry={selectedEntry} />

          <ProfileSeedImport entries={entries} onImported={reloadEntries} />

          <KampsparIngestForm
            onSaved={() => {
              reloadEntries();
            }}
          />

          <BentoCard title="Senaste poster" description={loadingEntries ? 'Laddar…' : `${entries.length} poster`}>
            {entries.length === 0 ? (
              <p className="text-sm text-text-dim">Inga poster ännu.</p>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedEntry(entry)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedEntry(entry);
                    }}
                    className={`cursor-pointer rounded-xl ${
                      entry.id === highlightEntryId || entry.id === selectedEntry?.id
                        ? 'ring-2 ring-accent/50'
                        : ''
                    }`}
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
