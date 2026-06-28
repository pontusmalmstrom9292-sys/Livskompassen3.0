import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { KunskapPage, type KunskapEntriesMeta } from '../../kompis/components/KunskapPage';
import { AutonomousArchivePanel } from '../../kompis/components/AutonomousArchivePanel';
import { FamiljenKunskapHubTab } from '@/features/family/children/components/familjen/FamiljenKunskapHubTab';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { KunskapsbankHeader } from '../../vault/components/KunskapsbankHeader';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { BookOpen, RefreshCw } from 'lucide-react';

type TabRequest = 'chat' | 'tidshjul';

/** Samlad Kunskapsbank bakom Valv-PIN — Kunskapsvalv + Familjen-upload (U1 silos oförändrade). */
export function VaultKunskapsbankPanel() {
  const shell = useFamiljenShell();
  const [focusKampsparId, setFocusKampsparId] = useState<string | null>(null);
  const [requestTab, setRequestTab] = useState<TabRequest | null>(null);
  const [entriesMeta, setEntriesMeta] = useState<KunskapEntriesMeta | null>(null);

  const handleEntriesMeta = useCallback((meta: KunskapEntriesMeta) => {
    setEntriesMeta(meta);
  }, []);

  const showEmptyState =
    entriesMeta &&
    !entriesMeta.loading &&
    !entriesMeta.error &&
    entriesMeta.count === 0;

  const showNetworkError = Boolean(entriesMeta?.error);
  const archiveMeta =
    entriesMeta && !entriesMeta.loading
      ? `${entriesMeta.count} poster`
      : entriesMeta?.loading
        ? 'Laddar…'
        : undefined;

  return (
    <div className="space-y-4">
      <KunskapsbankHeader compact />

      {showNetworkError && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-amber-200/90">{entriesMeta?.error}</p>
            <button
              type="button"
              onClick={() => entriesMeta?.reload()}
              disabled={entriesMeta?.loading}
              className="ds-btn ds-btn--secondary inline-flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className="h-3 w-3" aria-hidden />
              Försök igen
            </button>
          </div>
        </div>
      )}

      {showEmptyState && (
        <BentoCard
          glow="blue"
          title="Ditt minne är tomt"
          description="Sök i dina sparade anteckningar — börja med en post"
          icon={<BookOpen className="h-4 w-4" />}
        >
          <EmptyState
            message="Lägg till rutiner, milstolpar eller fakta under Tidshjulet. Därefter kan du ställa frågor i Kunskapsvalv-fliken."
            action={
              <button
                type="button"
                onClick={() => setRequestTab('tidshjul')}
                className="ds-btn ds-btn--secondary text-sm"
              >
                Öppna Tidshjulet
              </button>
            }
          />
        </BentoCard>
      )}

      <BentoCard glow="blue" bare noHover className="!p-0">
        <div className="p-4 sm:p-5">
          <KunskapPage
            embedded
            focusKampsparId={focusKampsparId}
            onFocusKampsparConsumed={() => setFocusKampsparId(null)}
            requestTab={requestTab}
            onRequestTabConsumed={() => setRequestTab(null)}
            onEntriesMeta={handleEntriesMeta}
          />
        </div>
      </BentoCard>

      <CalmCollapsible title="Filarkiv" meta={archiveMeta} defaultOpen={false} glow="blue">
        <AutonomousArchivePanel sharedKampspar={entriesMeta?.entries} />
      </CalmCollapsible>

      {shell.user ? (
        <CalmCollapsible title="Familjen — kunskap och uppladdning" meta="Per barn" defaultOpen={false} glow="blue">
          <FamiljenKunskapHubTab activeChild={shell.activeChild} />
        </CalmCollapsible>
      ) : null}

      <p className="px-1 text-[10px] text-text-dim">
        Personregister:{' '}
        <Link to={vaultDrawerPath('aktorskarta')} className="text-accent/80 hover:text-accent">
          Aktörskarta
        </Link>
      </p>
    </div>
  );
}
