import { Droplets, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { patchNutritionPrefs, readNutritionPrefs } from '../../mabra/lib/mabraNutritionPrefs';
import type { NutritionPrefs } from '../../mabra/lib/mabraNutritionIntakeTypes';

type Props = {
  uid?: string;
};

type PrefRow = {
  key: keyof NutritionPrefs;
  title: string;
  description: string;
  advanced?: boolean;
};

const PREF_ROWS: PrefRow[] = [
  {
    key: 'gentleNudges',
    title: 'Mjuka påminnelser',
    description: 'Korta tips i näringspanelen — utan skuld eller röda varningar.',
  },
  {
    key: 'mealReminders',
    title: 'Måltidspåminnelse',
    description: 'Mild fråga efter kl 14 om du inte loggat mat idag.',
  },
  {
    key: 'trendView',
    title: 'Veckoöversikt',
    description: 'Visa 7-dagars mönster i MåBra → Näring & vätska.',
    advanced: true,
  },
  {
    key: 'detailedAnalysis',
    title: 'Djupare analys',
    description: 'Måltidsrytm och enkla mönster (kommer utökas stegvis).',
    advanced: true,
  },
  {
    key: 'macroTracking',
    title: 'Makron (P/F/K)',
    description: 'Valfria gram per måltid + dagssumma. Ingen kaloriräkning, inga mål.',
    advanced: true,
  },
];

export function NutritionSettingsPanel({ uid }: Props) {
  const storageUid = uid ?? 'local';
  const [prefs, setPrefs] = useState(() => readNutritionPrefs(storageUid));

  const toggle = (key: keyof NutritionPrefs) => {
    const next = patchNutritionPrefs(storageUid, { [key]: !prefs[key] });
    setPrefs(next);
  };

  const coreRows = PREF_ROWS.filter((r) => !r.advanced);
  const advancedRows = PREF_ROWS.filter((r) => r.advanced);

  return (
    <div className="space-y-4">
      <BentoCard title="Näring & intag" icon={<Droplets className="h-4 w-4" />} glow="green">
        <p className="text-sm text-text-muted">
          Diskret mat- och dryckeslogg i MåBra. Data stannar på enheten — ingen export till Valv.
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Öppna via Vardagen → MåBra → Näring & vätska.
        </p>
        <Link
          to="/mabra/verktyg/nutrition"
          className="ds-btn ds-btn--secondary mt-3 inline-flex w-full justify-center text-sm"
        >
          Öppna snabb logg
        </Link>
      </BentoCard>

      <BentoCard title="Grundläggande">
        <ul className="space-y-3">
          {coreRows.map((row) => (
            <li key={row.key}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-success"
                  checked={prefs[row.key]}
                  onChange={() => toggle(row.key)}
                />
                <span className="text-sm leading-relaxed text-text-muted">
                  <span className="block font-medium text-text">{row.title}</span>
                  {row.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </BentoCard>

      <BentoCard title="Utöka (valfritt)">
        <p className="mb-3 flex items-start gap-2 text-xs text-text-dim">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Mer funktioner syns först när du slår på dem här — inget extra brus från start.
        </p>
        <ul className="space-y-3">
          {advancedRows.map((row) => (
            <li key={row.key}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-accent"
                  checked={prefs[row.key]}
                  onChange={() => toggle(row.key)}
                />
                <span className="text-sm leading-relaxed text-text-muted">
                  <span className="block font-medium text-text">{row.title}</span>
                  {row.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {prefs.macroTracking ? (
          <p className="mt-3 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs text-text-dim">
            P/F/K-fält visas vid matlogg i MåBra. Våg och dietmallar kommer i senare våg.
          </p>
        ) : null}
      </BentoCard>
    </div>
  );
}
