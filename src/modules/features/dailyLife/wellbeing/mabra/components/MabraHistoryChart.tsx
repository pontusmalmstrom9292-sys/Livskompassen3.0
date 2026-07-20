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
      <div className="bg-slate-900/95 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md text-left max-w-xs relative z-[100] text-text">
        <p className="text-xs text-text-muted mb-2 font-mono flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {data.chartDate} kl {data.chartTime}
        </p>
        <div className="space-y-1.5">
          <p className="text-sm font-medium flex items-center gap-1.5 text-accent-light">
            <Zap className="w-4 h-4 fill-amber-400/20" />
            Energi: {data.energy} / 10
          </p>
          <p className="text-sm font-medium flex items-center gap-1.5 text-success">
            <Smile className="w-4 h-4 fill-emerald-400/20" />
            Humör: {data.mood} / 10
          </p>
          {data.taskNote && (
            <div className="pt-2 border-t border-white/5 mt-2">
              <p className="text-xs text-text-muted italic leading-relaxed">&quot;{data.taskNote}&quot;</p>
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
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
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
          cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
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
