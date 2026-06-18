import { useCallback, useEffect, useRef, useState } from 'react';
import { Tidshjulet } from './Tidshjulet';
import { TidshjulDetailCard } from './TidshjulDetailCard';
import { KnowledgeVaultChat } from './KnowledgeVaultChat';
import { KampsparIngestForm } from './KampsparIngestForm';
import { KunskapsvalvFileIngest } from './KunskapsvalvFileIngest';
import { ProfileSeedImport } from './ProfileSeedImport';
import { InboxReviewQueueLink } from '@/modules/inkast/components/InboxReviewQueueLink';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar } from '@/core/ui/TabBar';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { Compass, RefreshCw, Sparkles } from 'lucide-react';
import { useStore } from '@/core/store';
import { getKampsparEntries, subscribeKampsparEntries } from '@/core/firebase/firestore';
import type { KampsparEntryRow } from '@/core/types/firestore';
import { buildTidshjulPatternHint } from '../utils/tidshjulTimeline';
import { citationKey } from './KnowledgeCitationList';

type Tab = 'chat' | 'tidshjul';

const tabs = [
  { id: 'chat' as const, label: 'Kunskapsvalv', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'tidshjul' as const, label: 'Tidshjulet', icon: <Compass className="h-3 w-3" /> },
];

export type KunskapEntriesMeta = {
  count: number;
  loading: boolean;
  error: string | null;
  reload: () => void;
  entries: KampsparEntryRow[];
};

type KunskapPageProps = {
  embedded?: boolean;
  /** När satt (t.ex. från Familjen-hub): hoppa till post i Tidshjulet. */
  focusKampsparId?: string | null;
  onFocusKampsparConsumed?: () => void;
  /** Extern tab-begäran (t.ex. tom-state CTA i Valv-panel). */
  requestTab?: Tab | null;
  onRequestTabConsumed?: () => void;
  /** Rapporterar kampspar-status till förälder (VaultKunskapsbankPanel). */
  onEntriesMeta?: (meta: KunskapEntriesMeta) => void;
};

export function KunskapPage({
  embedded = false,
  focusKampsparId,
  onFocusKampsparConsumed,
  requestTab,
  onRequestTabConsumed,
  onEntriesMeta,
}: KunskapPageProps) {
  const [tab, setTab] = useState<Tab>('chat');
  const [highlightEntryId, setHighlightEntryId] = useState<string | null>(null);
  const [highlightPulse, setHighlightPulse] = useState(false);
  const [activeCitationKey, setActiveCitationKey] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<KampsparEntryRow | null>(null);
  const user = useStore((s) => s.user);
  const [entries, setEntries] = useState<KampsparEntryRow[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [citationNotice, setCitationNotice] = useState<string | null>(null);

  const tidshjulSectionRef = useRef<HTMLDivElement>(null);
  const highlightedRowRef = useRef<HTMLDivElement>(null);

  const reloadEntries = useCallback(async () => {
    if (!user) return;
    setLoadingEntries(true);
    setEntriesError(null);
    try {
      const rows = await getKampsparEntries(user.uid);
      setEntries(rows);
    } catch {
      setEntries([]);
      setEntriesError('Kunde inte läsa kampspar. Kontrollera nätverk och inloggning.');
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

  useEffect(() => {
    onEntriesMeta?.({
      count: entries.length,
      loading: loadingEntries,
      error: entriesError,
      reload: reloadEntries,
      entries,
    });
  }, [entries, loadingEntries, entriesError, reloadEntries, onEntriesMeta]);

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
        setEntriesError('Live-uppdatering avbröts — kontrollera nätverket.');
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

  useEffect(() => {
    if (!requestTab) return;
    setTab(requestTab);
    onRequestTabConsumed?.();
  }, [requestTab, onRequestTabConsumed]);

  useEffect(() => {
    if (!highlightEntryId || tab !== 'tidshjul') return;

    setHighlightPulse(true);
    const pulseTimer = window.setTimeout(() => setHighlightPulse(false), 2600);

    const scrollTimer = window.setTimeout(() => {
      tidshjulSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      highlightedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);

    return () => {
      window.clearTimeout(pulseTimer);
      window.clearTimeout(scrollTimer);
    };
  }, [highlightEntryId, tab, entries.length]);

  const handleCitationClick = (docId: string, collection: string) => {
    if (collection !== 'kampspar' && collection !== 'kb_docs') return;
    setCitationNotice(null);
    setActiveCitationKey(citationKey(collection, docId));

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
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      <TabBar tabs={tabs} active={tab} onChange={(id) => setTab(id)} size={embedded ? 'compact' : 'default'} />

      {tab === 'chat' ? (
        <>
          <KnowledgeVaultChat
            embedded={embedded}
            onCitationClick={handleCitationClick}
            activeCitationKey={activeCitationKey}
          />
          {!embedded && <InboxReviewQueueLink />}
        </>
      ) : (
        <>
          {citationNotice && (
            <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-text-muted">
              {citationNotice}
            </p>
          )}
          {activeCitationKey && highlightEntryId && (
            <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-accent">
              Källa markerad i Tidshjulet och listan nedan.
            </p>
          )}
          {!embedded && patternHint && (
            <BentoCard title="Mönster (Minne)" description="Livs-Arkivarien · deterministisk översikt">
              <p className="text-sm text-text-muted">{patternHint}</p>
            </BentoCard>
          )}

          <BentoCard
            title={embedded ? 'Tidshjulet' : 'Tidshjulet — Minne'}
            description={
              loadingEntries
                ? 'Laddar live kampspar…'
                : `${entries.length} poster · Dåtid / Nutid / Framtid`
            }
          >
            {entriesError && (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <p className="text-sm text-amber-400/90">{entriesError}</p>
                <button
                  type="button"
                  onClick={() => reloadEntries()}
                  disabled={loadingEntries}
                  className="btn-pill--secondary inline-flex items-center gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden />
                  Försök igen
                </button>
              </div>
            )}
            <div ref={tidshjulSectionRef}>
              <Tidshjulet
                entries={entries}
                highlightEntryId={highlightEntryId}
                selectedEntryId={selectedEntry?.id ?? null}
                onSelectEntry={setSelectedEntry}
                highlightPulse={highlightPulse}
              />
            </div>
          </BentoCard>

          <TidshjulDetailCard entry={selectedEntry} compact={embedded} />

          {!embedded && <ProfileSeedImport entries={entries} onImported={reloadEntries} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KampsparIngestForm
              compact={embedded}
              onSaved={() => {
                reloadEntries();
              }}
            />
            <div>
              <KunskapsvalvFileIngest 
                onIngested={() => reloadEntries()} 
                sourceLabel="kunskap_page_upload"
              />
            </div>
          </div>

          <BentoCard
            title={embedded ? 'Poster' : 'Senaste poster'}
            description={loadingEntries ? 'Laddar…' : `${entries.length} poster`}
          >
            {entries.length === 0 ? (
              <p className="text-sm text-text-dim">
                Inga poster ännu — lägg till din första post ovan.
              </p>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, embedded ? 6 : 10).map((entry) => {
                  const isHighlighted = entry.id === highlightEntryId;
                  const isSelected = entry.id === selectedEntry?.id;

                  return (
                    <div
                      key={entry.id}
                      ref={isHighlighted ? highlightedRowRef : undefined}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEntry(entry)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedEntry(entry);
                      }}
                      className={`cursor-pointer rounded-xl transition-shadow ${
                        isHighlighted
                          ? 'ring-2 ring-accent/70 shadow-[0_0_12px_-2px_rgba(212,175,55,0.35)]'
                          : isSelected
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
                  );
                })}
              </div>
            )}
          </BentoCard>
        </>
      )}
    </div>
  );
}
