import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { OracleMetricPoint } from '../hooks/useOracleMetrics';

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: OracleMetricPoint }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-[280px] sm:max-w-xs relative z-[100]">
        <p className="font-semibold text-gray-100 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-success">Kapacitet: {data.capacity}</p>
          <p className="text-sm font-medium text-danger">Stress: {data.stressLevel}</p>
          {(data.mabraSessionsCount ?? 0) > 0 ? (
            <div className="pt-2">
              <p className="text-sm font-medium text-emerald-300 flex items-start gap-1">
                <span>🌿</span>
                <span>
                  {data.mabraSessionsCount} MåBra-övning
                  {data.mabraSessionsCount! > 1 ? 'ar' : ''}
                  {data.mabraSessionTypes && data.mabraSessionTypes.length > 0 && (
                    <span className="block text-xs text-emerald-400/80 mt-0.5">
                      ({data.mabraSessionTypes.join(', ')})
                    </span>
                  )}
                </span>
              </p>
            </div>
          ) : null}
          {data.totalHoursWorked !== undefined && data.totalHoursWorked > 0 && (
            <p className="text-sm font-medium text-amber-300 pt-1">
              Arbetad tid: {data.totalHoursWorked}h
            </p>
          )}
          {data.conflictCount !== undefined && data.conflictCount > 0 && (
            <p className="text-sm font-medium text-red-400">
              Konflikter loggade: {data.conflictCount}
            </p>
          )}
          {data.isHighRiskCorrelation && (
            <div className="mt-2 bg-red-500/10 p-2 rounded border border-red-500/20">
              <p className="text-xs font-bold text-red-500">
                ⚠️ Varning: Övertid/Konflikt vid hög stress
              </p>
            </div>
          )}
        </div>
        {data.label && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed italic">&quot;{data.label}&quot;</p>
          </div>
        )}
      </div>
    );
  }
  return null;
}

function MabraDot(props: { cx?: number; cy?: number; payload?: OracleMetricPoint }) {
  const { cx, cy, payload } = props;
  if (payload?.mabraSessionsCount && payload.mabraSessionsCount > 0) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          stroke="currentColor"
          className="text-success"
          strokeWidth={2}
          fill="var(--surface)"
        />
        <circle cx={cx} cy={cy} r={4} className="fill-success" />
      </g>
    );
  }
  return (
    <circle cx={cx} cy={cy} r={3} stroke="var(--success)" strokeWidth={1} fill="var(--surface)" />
  );
}

function RiskDot(props: { cx?: number; cy?: number; payload?: OracleMetricPoint }) {
  const { cx, cy, payload } = props;
  if (payload?.isHighRiskCorrelation) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill="var(--danger)"
          opacity={0.3}
          className="animate-pulse"
        />
        <circle cx={cx} cy={cy} r={5} fill="var(--danger)" stroke="var(--surface)" strokeWidth={2} />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill="var(--danger)" stroke="var(--surface)" strokeWidth={1} />;
}

type Props = {
  dataPoints: OracleMetricPoint[];
  onSelectDay: (point: OracleMetricPoint) => void;
};

export function OracleCapacityChart({ dataPoints, onSelectDay }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={dataPoints}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        onClick={(e) => {
          const payload = (e as { activePayload?: Array<{ payload: OracleMetricPoint }> })?.activePayload;
          if (payload?.length) {
            onSelectDay(payload[0].payload);
          }
        }}
        className="cursor-pointer"
      >
        <defs>
          <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine
          y={70}
          stroke="var(--warning)"
          strokeDasharray="3 3"
          opacity={0.6}
          label={{
            position: 'insideTopLeft',
            value: 'Varning',
            fill: 'var(--warning)',
            fontSize: 12,
          }}
        />
        <ReferenceLine
          y={85}
          stroke="var(--danger)"
          strokeDasharray="3 3"
          opacity={0.6}
          label={{
            position: 'insideTopLeft',
            value: 'Kritisk',
            fill: 'var(--danger)',
            fontSize: 12,
          }}
        />
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
        <Area
          type="monotone"
          dataKey="capacity"
          name="Kapacitet"
          stroke="var(--success)"
          fillOpacity={1}
          fill="url(#colorCapacity)"
          dot={<MabraDot />}
          activeDot={{ r: 8 }}
        />
        <Area
          type="monotone"
          dataKey="stressLevel"
          name="Stress"
          stroke="var(--danger)"
          fillOpacity={1}
          fill="url(#colorStress)"
          dot={<RiskDot />}
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
