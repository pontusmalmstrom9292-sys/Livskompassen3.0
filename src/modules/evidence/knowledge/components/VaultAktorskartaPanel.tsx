import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { EntityAddForm } from '../../kompis/components/EntityAddForm';
import {
  fetchEntityProfileRegistry,
  type EntityProfileSummary,
} from '../../kompis/api/entityProfileService';
import { ENTITY_ROLE_LABELS } from '../../kompis/constants/entityRegistryLabels';

/** Valv PIN — manuell aktörskarta (G9). Agenter minns via EntityProfile, ej RAG. */
export function VaultAktorskartaPanel() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [profiles, setProfiles] = useState<EntityProfileSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEntityProfileRegistry();
      setProfiles(data.profiles);
    } catch (err) {
      setProfiles([]);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda aktörskartan.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isAuthenticated) return null;

  const seedProfiles = profiles.filter((profile) => profile.isKeyEntity);
  const userProfiles = profiles.filter((profile) => !profile.isKeyEntity);

  return (
    <div className="space-y-4">
      <BentoCard
        title="Aktörskarta"
        description="KEY_ENTITIES · anti-hallucination (G9)"
        icon={<Users className="h-4 w-4 text-accent" />}
      >
        <p className="mb-4 text-sm text-text-muted">
          Personregister för assistenter — inte bevis. Nya personer läggs till här och minns av
          Kunskapsvalv, Valv-triage och Barnen-chat.
        </p>
        <Link
          to={vaultDrawerPath('kunskapsbank')}
          className="btn-pill--ghost mb-4 inline-flex items-center gap-2 text-xs"
        >
          <BookOpen className="h-3 w-3" />
          Till Kunskapsbank
        </Link>

        {loading && <p className="text-sm text-text-muted">Laddar aktörskarta…</p>}
        {error && <p className="text-sm text-amber-400/90">{error}</p>}

        {!loading && !error && profiles.length > 0 && (
          <div className="space-y-4">
            {userProfiles.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs uppercase tracking-widest text-text-dim">
                  Dina tillagda personer
                </h3>
                <EntityProfileList profiles={userProfiles} />
              </section>
            )}
            <section>
              <h3 className="mb-2 text-xs uppercase tracking-widest text-text-dim">
                Nyckelentiteter (seed)
              </h3>
              <EntityProfileList profiles={seedProfiles} />
            </section>
          </div>
        )}
      </BentoCard>

      <BentoCard title="Lägg till person" description="Append-only — sparas permanent för agenter">
        <EntityAddForm onSaved={load} />
      </BentoCard>
    </div>
  );
}

function EntityProfileList({ profiles }: { profiles: EntityProfileSummary[] }) {
  if (profiles.length === 0) {
    return <p className="text-sm text-text-muted">Inga personer i denna lista ännu.</p>;
  }

  return (
    <ul className="space-y-2">
      {profiles.map((profile) => (
        <li
          key={profile.entityKey}
          className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-sm"
        >
          <span className="font-medium text-text">{profile.displayName}</span>
          <span className="ml-2 text-xs text-text-dim">
            {ENTITY_ROLE_LABELS[profile.role] ?? profile.role}
          </span>
          {profile.aliases.length > 0 && (
            <p className="mt-1 text-xs text-text-muted">alias: {profile.aliases.join(', ')}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
