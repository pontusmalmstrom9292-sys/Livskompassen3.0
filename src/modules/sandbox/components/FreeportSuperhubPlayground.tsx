import { lazy, Suspense, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';

const DagbokInputSuperModule = lazy(() =>
  import('@/features/lifeJournal/diary/supermodule/DagbokInputSuperModule').then((m) => ({
    default: m.DagbokInputSuperModule,
  })),
);
const PlaneringInputSuperModule = lazy(() =>
  import('@/features/admin/planning/supermodule/PlaneringInputSuperModule').then((m) => ({
    default: m.PlaneringInputSuperModule,
  })),
);
const MabraInputSuperModule = lazy(() =>
  import('@/features/dailyLife/wellbeing/mabra/supermodule/MabraInputSuperModule').then((m) => ({
    default: m.MabraInputSuperModule,
  })),
);
const FamiljenInputSuperModule = lazy(() =>
  import('@/features/family/children/supermodule/FamiljenInputSuperModule').then((m) => ({
    default: m.FamiljenInputSuperModule,
  })),
);

type LiveTab = 'hjartat' | 'planering' | 'mabra' | 'familjen';

const TABS: { id: LiveTab; label: string; defaultMode: string }[] = [
  { id: 'hjartat', label: 'Hjärtat', defaultMode: 'reflektion' },
  { id: 'planering', label: 'Planering', defaultMode: 'task_quick' },
  { id: 'mabra', label: 'MåBra', defaultMode: 'checkin' },
  { id: 'familjen', label: 'Familjen', defaultMode: 'barnfokus' },
];

function FamiljenLive() {
  const shell = useFamiljenShell();
  return <FamiljenInputSuperModule shell={shell} flowWithIsland />;
}

function LiveFallback() {
  return <p className="design-freeport__hint p-4">Laddar supermodul…</p>;
}

export function FreeportSuperhubPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('fpLive') as LiveTab | null) ?? 'hjartat';
  const [tab, setTab] = useState<LiveTab>(
    TABS.some((t) => t.id === initialTab) ? initialTab : 'hjartat',
  );

  const selectTab = useCallback(
    (next: LiveTab) => {
      setTab(next);
      const meta = TABS.find((t) => t.id === next)!;
      const params = new URLSearchParams(searchParams);
      params.set('fpLive', next);
      params.set('inputMode', meta.defaultMode);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return (
    <div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Live supermoduler</p>
        <p className="design-freeport__hint mt-1">
          Riktiga delegates — samma Firebase som prod. Ett läge i taget.
        </p>
        <div className="design-freeport__tabs mt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx('design-freeport__tab', tab === t.id && 'design-freeport__tab--on')}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <div className="design-freeport__live">
        <Suspense fallback={<LiveFallback />}>
          {tab === 'hjartat' ? <DagbokInputSuperModule /> : null}
          {tab === 'planering' ? <PlaneringInputSuperModule /> : null}
          {tab === 'mabra' ? <MabraInputSuperModule /> : null}
          {tab === 'familjen' ? <FamiljenLive /> : null}
        </Suspense>
      </div>
    </div>
  );
}
