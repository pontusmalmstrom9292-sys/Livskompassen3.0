import React, { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { useAuthStore } from '../core/auth/authStore';
import { useOracleStore } from './OracleStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PageSkeleton } from '../../components/layout/PageSkeleton';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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

export default function OracleDashboard() {
  const { user } = useAuthStore();
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
          </section>
        </div>
      </div>
    </ProtectedModule>
  );
}
