import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Lock, Search, ShieldCheck } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';
import { useStore } from '../../core/store';
import { getChildrenLogs, getVaultLogs } from '../../core/firebase/firestore';
import type { VaultLog } from '../../core/types/firestore';
import { VaultEntryForm } from './VaultEntryForm';
import { saveVaultLog } from '../../core/firebase/firestore';
import type { VaultLogInput } from '../types/vaultEntry';

type CrossRefFilter = 'all' | 'skola' | 'somn' | 'hamtning';

const FILTERS: { id: CrossRefFilter; label: string }[] = [
  { id: 'all', label: 'Alla' },
  { id: 'skola', label: 'Skola' },
  { id: 'somn', label: 'Sömn' },
  { id: 'hamtning', label: 'Hämtning' },
];

type CrossRefHit = {
  id: string;
  source: 'reality_vault' | 'children_logs';
  date: string;
  title: string;
  body: string;
  tags: string[];
};

function formatVaultBody(log: VaultLog): string {
  if (log.entryType === 'two_column') {
    return `Min verklighet: ${log.myReality ?? '—'}`;
  }
  return String(log.truth ?? log.shieldWhat ?? '');
}

function matchesFilter(hit: CrossRefHit, filter: CrossRefFilter): boolean {
  if (filter === 'all') return true;
  const blob = `${hit.title} ${hit.body} ${hit.tags.join(' ')}`.toLowerCase();
  if (filter === 'skola') {
    return blob.includes('skola') || hit.tags.some((t) => t.includes('skola'));
  }
  if (filter === 'somn') {
    return blob.includes('sömn') || blob.includes('somn') || hit.tags.includes('fysiologi');
  }
  if (filter === 'hamtning') {
    return blob.includes('hämt') || blob.includes('overlamning') || blob.includes('överlämning');
  }
  return true;
}

function matchesQuery(hit: CrossRefHit, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return `${hit.title} ${hit.body} ${hit.tags.join(' ')}`.toLowerCase().includes(needle);
}

/** F-07 + F-08 — korsreferens WORM + nytt bevis (ägare-scopad läsning). */
export function VaultCrossReference() {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CrossRefFilter>('all');
  const [vaultLogs, setVaultLogs] = useState<(VaultLog & { id: string })[]>([]);
  const [childRows, setChildRows] = useState<
    { id: string; createdAt?: string; observation?: string; category?: string; childAlias?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const children = await getChildrenLogs(user.uid);
      setChildRows(children);
      if (isVaultUnlocked) {
        setVaultLogs(await getVaultLogs(user.uid));
      } else {
        setVaultLogs([]);
      }
    } catch {
      setError('Kunde inte läsa poster.');
    } finally {
      setLoading(false);
    }
  }, [user, isVaultUnlocked]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hits = useMemo(() => {
    const rows: CrossRefHit[] = [];
    for (const log of vaultLogs) {
      rows.push({
        id: log.id,
        source: 'reality_vault',
        date: String(log.createdAt ?? '').slice(0, 10),
        title: log.category ?? 'Bevis',
        body: formatVaultBody(log),
        tags: [log.category ?? 'valv', log.entryType ?? 'post', 'OFÖRÄNDERLIG'],
      });
    }
    for (const log of childRows) {
      if (!log.observation && !log.category) continue;
      rows.push({
        id: log.id,
        source: 'children_logs',
        date: String(log.createdAt ?? '').slice(0, 10),
        title: `${log.childAlias ?? 'Barn'} · ${log.category ?? 'livslogg'}`,
        body: log.observation ?? '',
        tags: ['barnen', log.category ?? 'livslogg'],
      });
    }
    return rows
      .filter((h) => matchesFilter(h, filter))
      .filter((h) => matchesQuery(h, query))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [vaultLogs, childRows, filter, query]);

  const handleSaveVault = async (input: VaultLogInput) => {
    if (!user) throw new Error('Ej inloggad');
    setSaving(true);
    try {
      await saveVaultLog(user.uid, input);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för korsreferens.</p>;
  }

  return (
    <div className="space-y-4">
      <BentoCard
        title="Oföränderliga Verklighetsvalvet"
        description="Korsreferens — fakta, inte terapi"
        icon={<ShieldCheck className="h-4 w-4" />}
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök i säkrade poster…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                filter === f.id ? 'chip--active' : 'chip--idle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {!isVaultUnlocked && (
          <p className="mt-3 flex items-center gap-2 text-xs text-text-dim">
            <Lock className="h-3 w-3" />
            Valvposter visas när bevisvalvet är upplåst (Fyren 3 sek + PIN).
          </p>
        )}
      </BentoCard>

      {hits.length > 0 && (
        <p className="text-sm text-accent-secondary">
          Verklighetskontroll: {hits.length} post{hits.length === 1 ? '' : 'er'} matchar — fakta
          står kvar oförändrade.
        </p>
      )}

      <BentoCard title="Säkrade poster">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-text-dim">
            <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
          </p>
        ) : hits.length === 0 ? (
          <EmptyState message="Inga träffar i detta filter." />
        ) : (
          <ul className="space-y-3">
            {hits.map((hit) => (
              <li key={`${hit.source}-${hit.id}`} className="vault-cross-ref-row glass-card p-3">
                <p className="text-[10px] uppercase tracking-widest text-gold/90">
                  SÄKRAD POST · {hit.date}
                </p>
                <p className="mt-1 font-display text-sm text-text">{hit.title}</p>
                <p className="mt-2 font-mono text-xs text-text-muted whitespace-pre-wrap">
                  {hit.body}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      {isVaultUnlocked && (
        <BentoCard title="Säkra nytt minnesbevis" description="Objektiva fakta — lås i Valvet">
          <VaultEntryForm userId={user.uid} saving={saving} onSave={handleSaveVault} />
        </BentoCard>
      )}
    </div>
  );
}
