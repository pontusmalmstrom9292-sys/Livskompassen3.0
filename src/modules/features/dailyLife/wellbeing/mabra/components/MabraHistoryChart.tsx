import { Calendar, Smile, Zap } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type MabraHistoryChartPoint = {
  chartDate: string;
  chartTime: string;
  energy: number;
  mood: number;
  taskNote?: string;
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: MabraHistoryChartPoint }>;
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/40 bg-surface/95 p-4 text-left text-text shadow-2xl backdrop-blur-md max-w-xs relative z-[100]">
        <p className="mb-2 flex items-center gap-1 font-mono text-xs text-text-muted">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {data.chartDate} kl {data.chartTime}
        </p>
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-sm font-medium text-accent-light">
            <Zap className="h-4 w-4 fill-accent/20" aria-hidden />
            Energi: {data.energy} / 10
          </p>
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            <Smile className="h-4 w-4 fill-success/20" aria-hidden />
            Humör: {data.mood} / 10
          </p>
          {data.taskNote && (
            <div className="mt-2 border-t border-border/30 pt-2">
              <p className="text-xs italic leading-relaxed text-text-muted">&quot;{data.taskNote}&quot;</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

type Props = {
  chartData: MabraHistoryChartPoint[];
};

export function MabraHistoryChart({ chartData }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-light)" stopOpacity={0.1} />
            <stop offset="95%" stopColor="var(--accent-light)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in srgb, var(--text) 5%, transparent)" vertical={false} />
        <XAxis
          dataKey="chartDate"
          stroke="var(--text-dim)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          stroke="var(--text-dim)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dx={-5}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'color-mix(in srgb, var(--text) 10%, transparent)', strokeWidth: 1 }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-text-muted hover:text-text transition-colors font-sans">
              {value}
            </span>
          )}
        />
        <Line
          type="monotone"
          name="Energi"
          dataKey="energy"
          stroke="var(--accent-light)"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, stroke: 'var(--accent-light)', fill: 'var(--surface-2)' }}
          activeDot={{ r: 5, strokeWidth: 0 }}
          connectNulls
        />
        <Line
          type="monotone"
          name="Humör"
          dataKey="mood"
          stroke="var(--success)"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, stroke: 'var(--success)', fill: 'var(--surface-2)' }}
          activeDot={{ r: 5, strokeWidth: 0 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
