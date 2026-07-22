/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { DF_CURRICULUM_12 } from '../content/dfCurriculum';
import { summarizeKpi } from '../lib/recoveryKpiLocal';

type Props = {
  uid?: string;
};

const WEEK_KEY = 'livskompassen_df_curriculum_week:';

export function ProgressionPanel({ uid }: Props) {
  const [week, setWeek] = useState(() => {
    const raw = localStorage.getItem(`${WEEK_KEY}${uid || 'local'}`);
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n >= 1 && n <= 12 ? n : 1;
  });
  const row = DF_CURRICULUM_12[week - 1]!;
  const kpi = useMemo(() => summarizeKpi(uid), [uid]);

  const saveWeek = (w: number) => {
    setWeek(w);
    localStorage.setItem(`${WEEK_KEY}${uid || 'local'}`, String(w));
  };

  return (
    <div className="space-y-3">
      <BentoCard title="Progression (valfri)" icon={<BookOpen className="h-4 w-4" />} glow="green">
        <p className="text-xs text-text-muted">Föreslår tempo — tvingar inte. Du kan hoppa fritt.</p>
        <p className="mt-3 text-sm text-accent">
          Vecka {row.week}: {row.title_sv}
        </p>
        <p className="mt-1 text-sm text-text-muted">{row.focus_sv}</p>
        <p className="mt-2 text-xs text-text-muted">Verktyg: {row.tools.join(' · ')}</p>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            disabled={week <= 1}
            onClick={() => saveWeek(week - 1)}
          >
            Föregående
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            disabled={week >= 12}
            onClick={() => saveWeek(week + 1)}
          >
            Nästa vecka
          </Button>
        </div>
      </BentoCard>
      <BentoCard title="Din vecka (privat)" glow="green">
        <p className="text-xs text-text-muted">Ingen jämförelse. Bara fakta för dig.</p>
        <ul className="mt-2 space-y-1 text-sm text-text-muted">
          <li>Akut startade: {kpi.akutStarts}</li>
          <li>Akut avslutade: {kpi.akutCompletes}</li>
          <li>
            Andel avslutade:{' '}
            {kpi.akutStarts ? `${Math.round(kpi.completeRate * 100)}%` : '—'}
          </li>
          <li>Protokoll: {kpi.protocols}</li>
          <li>Hjälp-tryck: {kpi.helpTaps}</li>
        </ul>
      </BentoCard>
    </div>
  );
}
