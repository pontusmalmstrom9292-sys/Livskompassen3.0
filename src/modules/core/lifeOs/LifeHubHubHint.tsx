import { Link } from 'react-router-dom';
import { materialEnabled, type LifeHubPreset, type LifeHubPresetId } from './lifeHubPresets';

type HintRow = {
  presetIds: LifeHubPresetId[];
  materialKey: 'familjen_hub_hint' | 'mabra_hub_hint' | 'hamn_hub_hint';
  title: string;
  body: string;
  to: string;
  search?: string;
  actionLabel: string;
};

const HINTS_BY_HUB: Record<'familjen' | 'mabra' | 'hamn', HintRow[]> = {
  familjen: [
    {
      presetIds: ['foralder_trygg'],
      materialKey: 'familjen_hub_hint',
      title: 'Förälder-hub',
      body: 'Barnfokus och planering är prioriterat i din profil.',
      to: '/familjen',
      search: '?tab=reflektion',
      actionLabel: 'Barnfokus',
    },
  ],
  mabra: [
    {
      presetIds: ['rehab_lag'],
      materialKey: 'mabra_hub_hint',
      title: 'Låg stimulus',
      body: 'Andning och korta steg — inget måste presteras.',
      to: '/mabra',
      actionLabel: 'Öppna MåBra',
    },
  ],
  hamn: [
    {
      presetIds: ['foralder_trygg'],
      materialKey: 'hamn_hub_hint',
      title: 'Grey Rock',
      body: 'BIFF och korta svar när det är tungt.',
      to: '/familjen',
      search: '?tab=hamn',
      actionLabel: 'Trygg hamn',
    },
  ],
};

type Props = {
  preset: LifeHubPreset;
  hub: 'familjen' | 'mabra' | 'hamn';
};

export function LifeHubHubHint({ preset, hub }: Props) {
  const row = HINTS_BY_HUB[hub].find(
    (h) => h.presetIds.includes(preset.id) && materialEnabled(preset, h.materialKey),
  );
  if (!row) return null;

  return (
    <div className="life-hub-hint elongated-module p-3 text-sm">
      <p className="font-medium text-accent">{row.title}</p>
      <p className="mt-1 text-text-muted">{row.body}</p>
      <Link
        to={{ pathname: row.to, search: row.search }}
        className="btn-pill--accent mt-2 inline-flex text-xs"
      >
        {row.actionLabel}
      </Link>
    </div>
  );
}
