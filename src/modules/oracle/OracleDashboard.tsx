import React, { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { useAuthStore } from '../core/auth/authStore';
import { useOracleStore } from './OracleStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageSkeleton } from '../../components/layout/PageSkeleton';

export default function OracleDashboard() {
  const { user } = useAuthStore();
  const { dataPoints, isLoading, error, fetchOracleData } = useOracleStore();

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
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Mönsteroraklet</h1>
            <p className="text-gray-400">Visuella insikter över tid. Identifiera dina trender och korrelationer.</p>
          </header>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-6">Kapacitet vs Stress (Senaste 7 dagarna)</h2>
            <div className="h-[400px] w-full">
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
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(8px)', color: '#fff' }}
                    itemStyle={{ color: '#e5e7eb' }}
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
