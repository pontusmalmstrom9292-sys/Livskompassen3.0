import { useSearchParams } from 'react-router-dom';
import { HubPageShell } from '../layout/HubPageShell';
import { DagbokPage as JournalDagbokPage } from '@/features/lifeJournal/diary/diary/components/DagbokPage';
import { SpeglingsSystem } from '@/features/lifeJournal/diary/mirror';

type HjartatLayerTab = 'reflektion' | 'speglar';

function resolveLayerTab(raw: string | null): HjartatLayerTab {
  return raw === 'speglar' ? 'speglar' : 'reflektion';
}

/** Hjärtat — Dagbok och Speglar endast. Ingen Valv-logik. */
export function DagbokPage() {
  const [searchParams] = useSearchParams();
  const layerTab = resolveLayerTab(searchParams.get('tab'));

  if (layerTab === 'speglar') {
    return (
      <HubPageShell
        eyebrow="ZON 1 — Hjärtat"
        title="Speglar"
        lead="Validering utan fix — känsla och fakta hålls isär."
      >
        <div className="mx-auto max-w-5xl space-y-4 pb-12">
          <SpeglingsSystem embedded />
        </div>
      </HubPageShell>
    );
  }

  return (
    <HubPageShell
      eyebrow="ZON 1 — Hjärtat"
      title="Dagbok"
      lead="Reflektion och daglig logg — utanför Valvet."
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <JournalDagbokPage embedded />
      </div>
    </HubPageShell>
  );
}

/** Alias för AppRoutes — samma komponent, inget Valv. */
export { DagbokPage as HjartatPage };
