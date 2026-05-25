import { MetricTile } from '../../core/ui/MetricTile';

type WorkWeekSummaryProps = {
  dagensTimmar: number;
  weekTotal: number;
  flexLeft: number;
  flexTarget: number;
  weekTypeLabel?: string;
  hourlyRate: number;
  workHoursWeek: number;
  estimatedWeekPay: number | null;
  statusLine: string;
};

export function WorkWeekSummary({
  dagensTimmar,
  weekTotal,
  flexLeft,
  flexTarget,
  weekTypeLabel,
  hourlyRate,
  workHoursWeek,
  estimatedWeekPay,
  statusLine,
}: WorkWeekSummaryProps) {
  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <MetricTile label="Idag" value={`${dagensTimmar} h`} hint="Registrerat" />
        <MetricTile
          label="Flex kvar"
          value={`${flexLeft} h`}
          hint={weekTypeLabel ?? `Mål ${flexTarget} h/vecka`}
        />
      </div>
      {weekTypeLabel && (
        <p className="mb-3 text-xs text-text-dim">
          {weekTypeLabel} · {workHoursWeek} h arbete registrerat
        </p>
      )}

      {estimatedWeekPay != null && (
        <p className="mb-3 text-sm text-text-dim">
          Uppskattad lön denna vecka:{' '}
          <span className="font-medium text-text">{estimatedWeekPay} kr</span> ({workHoursWeek} h ×{' '}
          {hourlyRate} kr/h)
        </p>
      )}
      {hourlyRate <= 0 && (
        <p className="mb-3 text-xs text-text-dim">
          Sätt timlön under Profil nedan för uppskattad veckolön.
        </p>
      )}

      <p className="mb-3 text-sm text-text-dim">{statusLine}</p>
      <p className="mb-1 text-xs text-text-dim">{weekTotal} h totalt denna vecka (alla kategorier)</p>
    </>
  );
}
