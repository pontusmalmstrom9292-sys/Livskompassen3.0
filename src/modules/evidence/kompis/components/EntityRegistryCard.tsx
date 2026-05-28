import { useCallback, useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import {
  fetchEntityProfileRegistry,
  type EntityProfileSummary,
  type SystemSynapseSummary,
} from '../api/entityProfileService';

const ROLE_LABELS: Record<string, string> = {
  ANVANDARE: 'Du',
  MOTPART: 'Motpart',
  BARN: 'Barn',
  NATVERK: 'Nätverk',
  MYNDIGHET: 'Myndighet',
  SKOLA: 'Skola',
};

export function EntityRegistryCard() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [profiles, setProfiles] = useState<EntityProfileSummary[]>([]);
  const [synapses, setSynapses] = useState<SystemSynapseSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEntityProfileRegistry();
      setProfiles(data.profiles);
      setSynapses(data.synapses);
    } catch (err) {
      setProfiles([]);
      setSynapses([]);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda aktörskartan.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isAuthenticated) return null;

  return (
    <BentoCard
      title="Aktörskarta"
      description="KEY_ENTITIES · anti-hallucination (G9)"
      icon={<Users className="h-4 w-4 text-accent" />}
    >
      <p className="mb-3 text-xs text-text-dim">
        Metadata för agenter — inte RAG-bevis. Nya personer läggs inte till automatiskt.
      </p>

      {loading && <p className="text-sm text-text-muted">Laddar aktörskarta…</p>}
      {error && <p className="text-sm text-amber-400/90">{error}</p>}

      {!loading && !error && profiles.length > 0 && (
        <ul className="mb-4 space-y-2">
          {profiles.map((p) => (
            <li
              key={p.entityKey}
              className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-sm"
            >
              <span className="font-medium text-text">{p.displayName}</span>
              <span className="ml-2 text-xs text-text-dim">
                {ROLE_LABELS[p.role] ?? p.role}
              </span>
              {p.aliases.length > 0 && (
                <p className="mt-1 text-xs text-text-muted">alias: {p.aliases.join(', ')}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && synapses.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-text-muted hover:text-text">
            SystemSynapses ({synapses.length})
          </summary>
          <ul className="mt-2 space-y-2 text-xs text-text-dim">
            {synapses.map((s) => (
              <li key={s.title} className="rounded border border-border/40 px-2 py-1.5">
                <span className="text-text-muted">[{s.category}]</span> {s.title}
              </li>
            ))}
          </ul>
        </details>
      )}
    </BentoCard>
  );
}
