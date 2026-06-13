import React, { useEffect, useState } from 'react';
import { VaultService } from '../../../services/VaultService';
import { getAllTimeEntriesForEconomyReadOnly } from '../../core/firebase/arbetslivFirestore';
import { useStore } from '../../core/store';
import type { OracleMetricPoint } from '../hooks/useOracleMetrics';

interface DayForensicsPanelProps {
  dataPoint: OracleMetricPoint;
  onClose: () => void;
}

export const DayForensicsPanel: React.FC<DayForensicsPanelProps> = ({ dataPoint, onClose }) => {
  const user = useStore(s => s.user);
  const [vaultEntries, setVaultEntries] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid || !dataPoint.date) return;
      setIsLoading(true);
      try {
        // Fetch raw data
        const [allVault, allTime] = await Promise.all([
          VaultService.getVaultHistory(user.uid),
          getAllTimeEntriesForEconomyReadOnly(user.uid)
        ]);

        // Filter for this specific date
        // Note: dataPoint.isoDate is expected to be YYYY-MM-DD
        const targetDate = dataPoint.isoDate;

        const filteredVault = allVault.filter(entry => {
          let dateObj = new Date();
          if (entry.createdAt && typeof entry.createdAt.toDate === 'function') {
            dateObj = entry.createdAt.toDate();
          } else if (entry.createdAt) {
            dateObj = new Date(entry.createdAt);
          } else if (entry.timestamp) {
            dateObj = entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp);
          }
          return dateObj.toISOString().split('T')[0] === targetDate;
        });

        const filteredTime = allTime.filter(entry => entry.date === targetDate);

        setVaultEntries(filteredVault);
        setTimeEntries(filteredTime);
      } catch (err) {
        console.error("Error fetching forensics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uid, dataPoint.date, dataPoint.isoDate]);

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative z-50 mt-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Stäng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
          </svg>
          Djupanalys: {dataPoint.date}
        </h2>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            Stress: {dataPoint.stressLevel}
          </span>
          <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
            Kapacitet: {dataPoint.capacity}
          </span>
          {dataPoint.isHighRiskCorrelation && (
            <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse font-medium">
              Kritisk Korrelation
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valv-bevis */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Sanningens Sköld (Vault)
            </h3>
            {vaultEntries.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Inga bevis registrerade denna dag.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {vaultEntries.map((entry, idx) => (
                  <li key={idx} className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                    <p className="line-clamp-3">{entry.content || JSON.stringify(entry)}</p>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                       <span>{new Date(entry.createdAt || entry.timestamp).toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'})}</span>
                       <span className="text-indigo-400/50 uppercase tracking-wider text-[10px]">WORM</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Arbetstid */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-400/80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Loggad Tid
            </h3>
            {timeEntries.length === 0 ? (
               <p className="text-gray-500 text-sm italic">Ingen tid loggad denna dag.</p>
            ) : (
               <div className="space-y-3">
                 {timeEntries.map((entry, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3 text-sm">
                     <span className="text-gray-300">{entry.client || 'Okänd klient'} - {entry.project || 'Ospec.'}</span>
                     <span className="font-mono text-amber-300/90 font-medium">{entry.hoursWorked}h</span>
                   </div>
                 ))}
                 <div className="pt-3 border-t border-white/10 flex justify-between items-center font-medium mt-2">
                   <span className="text-gray-400">Totalt</span>
                   <span className="text-amber-400 font-bold">{dataPoint.totalHoursWorked}h</span>
                 </div>
               </div>
            )}
            
            {/* AI Blixtsammanfattning (Simulerad tillsvidare) */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <h4 className="text-sm font-semibold text-purple-300 mb-2">⚡ Automatisk slutsats</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {dataPoint.isHighRiskCorrelation 
                  ? "Kombinationen av hög arbetsbelastning och/eller konflikt triggade en extrem stressrespons. Överväg att implementera 'Grey Rock' nästa gång detta mönster uppstår." 
                  : "Dagen visade normala variationer. Kapaciteten var tillräcklig för att hantera stressnivån."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
