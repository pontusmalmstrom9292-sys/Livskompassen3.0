import { useCallback, useEffect, useState } from 'react';
import { BookOpen, Users } from 'lucide-react';
import { Button, ButtonLink } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useStore } from '@/core/store';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { EntityAddForm } from '../../kompis/components/EntityAddForm';
import {
  fetchEntityProfileRegistry,
  type EntityProfileSummary,
} from '../../kompis/api/entityProfileService';
import { VAULT_MAIN_TAB_LABELS, VALV_KUNSKAP_DRAWER_LEAF } from '@/core/copy/valvNavCopy';
import { ENTITY_ROLE_LABELS } from '../../kompis/constants/entityRegistryLabels';

/** A2.6 — primär: lista + lägg till. Sekundär: seed-lista (CalmCollapsible). G9 anti-hallucination. */
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
    <div className="valv-zone-stack space-y-4">
      <section className="calm-card glow-bottom-blue p-4 sm:p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl border border-accent/25 bg-accent/10 p-2">
            <Users className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base text-text">{VAULT_MAIN_TAB_LABELS.aktorskarta}</h2>
            <p className="mt-0.5 text-xs text-text-dim">
              {VALV_KUNSKAP_DRAWER_LEAF.aktorskarta} · personregister för assistenter (ej bevis)
            </p>
          </div>
        </div>

        <ButtonLink
          to={vaultDrawerPath('kunskapsbank')}
          variant="ghost"
          size="sm"
          className="mb-4 inline-flex items-center gap-2"
        >
          <BookOpen className="h-3 w-3" />
          Till Kunskapsbank
        </ButtonLink>

        {loading && <HubPanelSkeleton label="Laddar aktörskarta…" lines={3} />}
        {error && (
          <EmptyState
            message={error}
            action={
              <Button type="button" variant="secondary" size="sm" onClick={() => void load()}>
                Försök igen
              </Button>
            }
          />
        )}

        {!loading && !error && userProfiles.length === 0 && (
          <EmptyState message="Inga egna personer ännu. Lägg till nedan — append-only för agenter." />
        )}

        {!loading && !error && userProfiles.length > 0 && (
          <section aria-label="Dina tillagda personer">
            <h3 className="mb-2 text-xs uppercase tracking-widest text-text-dim">Dina tillagda personer</h3>
            <EntityProfileList profiles={userProfiles} />
          </section>
        )}
      </section>

      <section className="calm-card glow-bottom-blue p-4 sm:p-5" aria-label="Lägg till person">
        <h3 className="mb-1 text-xs uppercase tracking-widest text-accent">Lägg till person</h3>
        <p className="mb-3 text-xs text-text-dim">Append-only — sparas permanent för agenter.</p>
        <EntityAddForm onSaved={load} />
      </section>

      <CalmCollapsible
        title="Nyckelentiteter (seed)"
        meta={seedProfiles.length > 0 ? `${seedProfiles.length} poster` : 'Fördefinierade'}
        defaultOpen={false}
        glow="blue"
      >
        <p className="mb-3 text-xs text-text-dim">
          Fördefinierade aktörer från seed — inte dina manuella tillägg.
        </p>
        <EntityProfileList profiles={seedProfiles} emptyLabel="Inga seed-poster laddade." />
      </CalmCollapsible>
    </div>
  );
}

function EntityProfileList({
  profiles,
  emptyLabel = 'Inga personer i denna lista ännu.',
}: {
  profiles: EntityProfileSummary[];
  emptyLabel?: string;
}) {
  if (profiles.length === 0) {
    return <p className="text-sm text-text-muted">{emptyLabel}</p>;
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
