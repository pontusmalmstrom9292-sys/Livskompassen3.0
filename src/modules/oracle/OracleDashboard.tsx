import { useState, useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { useStore } from '../core/store';
import { useOracleStore } from './OracleStore';
import type { OracleDataPoint } from './OracleStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { PageSkeleton } from '../../components/layout/PageSkeleton';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as OracleDataPoint;
    return (
      <div className="bg-gray-900/95 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-[280px] sm:max-w-xs relative z-[100]">
        <p className="font-semibold text-gray-100 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: '#4ade80' }}>
            Kapacitet: {data.capacity}
          </p>
          <p className="text-sm font-medium" style={{ color: '#f87171' }}>
            Stress: {data.stressLevel}
          </p>
        </div>
        {data.label && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "{data.label}"
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const QuickIntervention = ({ latestDataPoint }: { latestDataPoint: OracleDataPoint | null }) => {
  const [dismissedDate, setDismissedDate] = useState<string | null>(null);

  if (!latestDataPoint) return null;
  
  const isCritical = latestDataPoint.stressLevel > 85;
  const isDismissed = dismissedDate === latestDataPoint.date;

  if (!isCritical || isDismissed) return null;

  return (
    <div className="mt-6 bg-[#020617] border border-white/10 rounded-xl p-6 relative">
      <button 
        onClick={() => setDismissedDate(latestDataPoint.date)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Stäng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h3 className="text-lg font-semibold text-[#FDE68A] mb-2">Behöver uppmärksamhet</h3>
      <p className="text-gray-300">
        Vagusnervåterställning: Prova 3 minuters djupt nynnande eller kallt vattenstänk.
      </p>
    </div>
  );
};

const ActionableInsights = ({ latestDataPoint }: { latestDataPoint: OracleDataPoint | null }) => {
  if (!latestDataPoint) return null;

  const { actionableAdvice, weeklySummary, detectedPatterns } = latestDataPoint;
  const hasInsights = actionableAdvice || weeklySummary || (detectedPatterns && detectedPatterns.length > 0);

  if (!hasInsights) return null;

  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative z-10 mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Analys och Mönster</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Summary */}
        {weeklySummary && (
          <div className="bg-black/20 rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-medium text-blue-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Sammanfattning
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {weeklySummary}
            </p>
          </div>
        )}

        {/* Actionable Advice */}
        {actionableAdvice && (
          <div className="bg-black/20 rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-medium text-green-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Konkret Råd
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {actionableAdvice}
            </p>
          </div>
        )}
      </div>

      {/* Detected Patterns */}
      {detectedPatterns && detectedPatterns.length > 0 && (
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 mt-6">
          <h3 className="text-lg font-medium text-purple-300 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625H18m1.125-3.75H18m1.125 2.625v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25m0-5.25C18 5.004 17.496 4.5 16.875 4.5H7.125M18 10.875V7.125m0 3.75c0 .621-.504 1.125-1.125 1.125H7.125m10.875-1.125c0-.621-.504-1.125-1.125-1.125H7.125m0 2.25c-.621 0-1.125-.504-1.125-1.125V7.125m0 3.75c0 .621.504 1.125 1.125 1.125" />
            </svg>
            Identifierade Mönster
          </h3>
          <ul className="space-y-3">
            {detectedPatterns.map((p, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{p.pattern}</span>
                <span className="text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded text-xs">
                  {Math.round(p.confidence * 100)}% säkerhet
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default function OracleDashboard() {
  const user = useStore(s => s.user);
  const { dataPoints, isLoading, error, fetchOracleData, mockLoad } = useOracleStore();

  useEffect(() => {
    if (user?.uid) {
      fetchOracleData(user.uid);
    }
  }, [user?.uid, fetchOracleData]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 bg-[var(--color-nordic-dusk)] min-h-screen">
        <p>Ett fel uppstod: {error}</p>
      </div>
    );
  }

  const latestDataPoint = dataPoints && dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null;

  return (
    <ProtectedModule>
      <div className="min-h-screen bg-[var(--color-nordic-dusk)] text-white p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-100">Mönsteroraklet</h1>
                <p className="text-gray-400 mt-1">Visuella insikter över tid. Identifiera dina trender och korrelationer.</p>
              </div>
              {import.meta.env.DEV && (
                <button
                  onClick={mockLoad}
                  className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                >
                  Simulera Data (Dev)
                </button>
              )}
            </div>
          </header>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative z-10">
            <h2 className="text-xl font-semibold mb-6">Kapacitet vs Stress (Senaste 7 dagarna)</h2>
            <div className="h-[400px] w-full relative z-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dataPoints}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                  
                  <ReferenceLine y={70} stroke="#f97316" strokeDasharray="3 3" opacity={0.6} label={{ position: 'insideTopLeft', value: 'Varning', fill: '#f97316', fontSize: 12 }} />
                  <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="3 3" opacity={0.6} label={{ position: 'insideTopLeft', value: 'Kritisk', fill: '#ef4444', fontSize: 12 }} />
                  
                  <Tooltip 
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Area type="monotone" dataKey="capacity" name="Kapacitet" stroke="#4ade80" fillOpacity={1} fill="url(#colorCapacity)" />
                  <Area type="monotone" dataKey="stressLevel" name="Stress" stroke="#f87171" fillOpacity={1} fill="url(#colorStress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <QuickIntervention latestDataPoint={latestDataPoint} />
          </section>

          <ActionableInsights latestDataPoint={latestDataPoint} />
        </div>
      </div>
    </ProtectedModule>
  );
}
